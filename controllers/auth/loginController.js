import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt"
import JwtService from "../../services/JwtService";
import Joi from "joi";
import { REFRESH_SECRET } from "../../config";

const loginController = {
    async login (req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const accessToken = JwtService.sign({ _id: user._id, role: user.role });
            const refreshToken = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            await RefreshToken.create({ token: refreshToken });
            res.json({ 'accessToken': accessToken, 'refreshToken': refreshToken })
        } catch(err) {
            return next(err);
        }
    }
}

export default loginController
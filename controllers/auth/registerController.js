import Joi from "joi"
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt"
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const registerController = {
    async register(req, res, next){
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repetpassword: Joi.ref('password'),
        });

        const { error } = registerSchema.validate(req.body)
        
        if(error) {
            return next(error)
        }

        try {
            const exists = await User.exists({ email: req.body.email })

            if(exists) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'))
            }
        } catch (err) {
            return next(err)
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        })

        let result, accessToken, refreshToken

        try {
            result = await user.save()
            accessToken = JwtService.sign({ _id: result._id, role: result.role })
            refreshToken = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET)
            await RefreshToken.create({ token: refreshToken })
        } catch (err) {
            return next(err)
        }

        return res.json({ 'accessToken': accessToken, 'refreshToken': refreshToken })
    }
}

export default registerController
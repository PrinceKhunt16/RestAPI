import Joi from "joi";
import { RefreshToken } from "../../models";

const logoutController = {
    async logout(req, res, next){
        const refreshSchema = Joi.object({
            refreshToken: Joi.string().required(),
        });
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await RefreshToken.deleteOne({ token: req.body.refreshToken });
        } catch(err) {
            return next(new Error('Something went wrong in the database'));
        }

        res.json({ status: 1 });
    }
}

export default logoutController
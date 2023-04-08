import Joi from "joi"
import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt"
import JwtService from "../../services/JwtService";

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

        let result, accessToken

        try {
            result = await user.save()
            accessToken = JwtService.sign({ _id: result._id, role: result.role })
        } catch (err) {
            return next(err)
        }

        return res.json({ 'accessToken': accessToken })
    }
}

export default registerController
import CustomErrorHandler from "../services/CustomErrorHandler"
import JwtService from "../services/JwtService"

const auth = (req, res, next) => {
    let authHeader = req.headers.authorization

    if(!authHeader) {
        return next(CustomErrorHandler.anAuthorized())
    }

    const token = authHeader.split(' ')[1]
    
    try {
        const { _id, role } = JwtService.verify(token)
        const user = {
            _id,
            role
        }

        req.user = user;
        next();
    } catch (err) {
        return next(CustomErrorHandler.anAuthorized())
    }
}

export default auth
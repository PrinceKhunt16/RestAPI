class CustomErrorHandler extends Error {
    constructor(status, msg){
        super()
        this.status = status;
        this.msg = msg;
    }

    static alreadyExist(msg) {
        return new CustomErrorHandler(409, msg);
    }

    static wrongCredentials(message = 'Username or password is wrong!') {
        return new CustomErrorHandler(401, message);
    }

    static anAuthorized(message = 'unAuthorized') {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = 'User Not Found') {
        return new CustomErrorHandler(404, message);
    }

    static serverError(message = 'Internal server error') {
        return new CustomErrorHandler(500, message);
    }
}

export default CustomErrorHandler
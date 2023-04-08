class CustomErrorHandler extends Error {
    constructor(status, msg){
        super()
        this.status = status;
        this.msg = msg;
    }

    static alreadyExist(msg) {
        return new CustomErrorHandler(409, msg);
    }
}

export default CustomErrorHandler
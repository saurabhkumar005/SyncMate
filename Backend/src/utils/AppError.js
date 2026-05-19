class AppError extends Error{
    costructor( message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }
    

}
export default AppError;
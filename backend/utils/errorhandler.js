class ErrorHandler extends Error{

    //constructor
    constructor(message, statusCode){
        // super parent class ke constructure ko cal kare ga yaha
        super(message);
        this.statusCode = statusCode

        // using Error class method here as it is parent class
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler
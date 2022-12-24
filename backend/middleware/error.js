const ErrorHandler = require("../utils/errorhandler")

module.exports = (err, req, res, next)=>{
    //mean ke error ka status code le ya 500 show kare server error
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // worng mongodb error --> ke agar koi user galat id se search kar ga tu ussay yeh exception show hu ge 
if(err.name === "CastError"){
    const message= `Resource not found. Invalid: ${err.path}`;
    err =  new ErrorHandler(message, 400)
}

//===================================================================
// Mongoose Duplicate key errror --> ke agar same id ya name de dein tu kon sa error ye 
//===================================================================
if(err.code === 11000){
    const message= `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err =  new ErrorHandler(message, 400)
}

//===================================================================
// Wrong JSON Token error --> While creating and while putting token 
//===================================================================
if(err.code === "JsonWebTokenError"){
    const message= `Json Web Token Is Invalid, Try Again`;
    err =  new ErrorHandler(message, 400)
}

//===================================================================
// JWT EXPIRE TOKEN
//===================================================================
if(err.code === "TokenExpireError"){
    const message= `Json Web Token Is Expired, Try Again`;
    err =  new ErrorHandler(message, 400)
}

    res.status(err.statusCode).json({
        sucess:false,
        message: err.message
        // error: err.stack  --> we can also check the full stack of the code

    });
};
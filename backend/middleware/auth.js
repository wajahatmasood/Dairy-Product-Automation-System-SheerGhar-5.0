const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const  User = require("../models/userModel");


exports.isAunthenticatedUser = catchAsyncErrors(async(req, res, next)=>{

    // what is request.cookie 
    const { token } =  req.cookies;

    if(!token)
    {
        return next(new ErrorHandler("Please Login To Access This Resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = await User.findById(decodedData.id);
    next(); 

});

// authorize roles wali khani ke kon kon se cheez ko access kar sakta hy

exports.authorizeRoles = (...roles) =>{
    return(req, res, next)=>{

        // this say if role.user iss array mein nai hy than yeh if chaly
        // if hum ne waha se admin bhja hy yeh if skip hu jae ga keo ke ! ka operator laga hua hy
        // this condition only work if there is no admin <-----------
        if(!roles.includes(req.user.role)){
            // 403 mean server understand the requst but refuse it
             return next(   new ErrorHandler(`Role: ${req.user.role} is not allowed to do this action`, 403
             ));
        }

        next();
    };
};
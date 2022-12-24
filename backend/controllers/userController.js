// const ErrorHandler = require("../utils/errorHandler");
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const  User = require("../models/userModel");
const { Error } = require("mongoose");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail"); 
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
var nodemailer = require('nodemailer');

//--------------------------------------------------------
//Register a user
//--------------------------------------------------------

exports.registerUser  = catchAsyncErrors(async(req, res, next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

    // next line mean kwe hum kuch values lein gy
    const {name, email, password} = req.body;
    const user = await User.create({

        name, email, password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });
    
    //calling user token from user model
    sendToken(user, 201, res);
   
});


//--------------------------------------------------------
// OTP CHECK for email
//--------------------------------------------------------

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('backend/views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('backend/views/'),
  };
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "info.sheerghar@gmail.com",
      pass:"qnczvxnmwagfhkvc",
    }
  });
  
  exports.verificationOTP = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new ErrorHandler("Duplicate Email Try Again", 404));
    }
    const OTP = Math.floor(100000 + Math.random() * 100001);
    const email = req.body.email;
    const message = `Your Email OTP is :- \n\n ${OTP}\n\n if you have not requested this email than please igrone it `;
//    console.log("THis is email : ",email)
    // await sendEmail({
    //   email,
    //   subject: `Sheer-Ghar OTP`,
    //   message,
    // });
  
    transporter.use('compile', hbs(handlebarOptions))
  
    var mailOptions = {
        from: "info.sheerghar@gmail.com",
        to: email,
        subject: 'Email Verification OTP Request',
        template: 'index',
        context: {
            code:OTP,
        }
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(404).json({ error: error })
        } else {
            res.status(200).json({ success: true, OTP })
        }
    });
  
    // res.status(200).json({
    //   success: true,
    //   message: `Email Send to ${email} successfully `, OTP,
    // });
  });
  
//--------------------------------------------------------
// login user
//--------------------------------------------------------
exports.loginUser = catchAsyncErrors(async(req, res, next)=>{
    const {email, password} = req.body;
    // checking if user has given password and email both
    if(!email || !password){
        //400--> badrequest
        return next(new ErrorHandler("Please Enter email and Password", 400))
    }
    // if email and pasco mill gya tu database mein dekhe ga for validation

    const user = await User.findOne({ email }).select("+password");
    // agar user nai milla tu yeh kare
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    //comparePassowrd(); yeh method is in userModel
    const isPasswordMatched = await user.comparePassowrd(password);

    // 401 meean unauthorize
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // yeh code ke zaroorat nai hy iss ke bjye yeh likh sakty hein hum
    // const token = user.getJWTToken(password);

    // res.status(200).json({
    // success: true,
    // token,
    // }); --> yeh neche wali line likh sakty iss ka method JWTTOKEn.js mein hy

    sendToken(user, 200, res);
});

//--------------------------------------------------------
// logout user
//--------------------------------------------------------

exports.logout = catchAsyncErrors(async(req, res,  next)=>{

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success:true,
        message:"Logged Out"
    });

});

//--------------------------------------------------------
// Forgot Passwprd
//--------------------------------------------------------

exports.forgotPassword = catchAsyncErrors(async(req, res, next)=>{
        
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return next(new ErrorHandler("User Not Found", 404))
        }
        // Get ResetPassword Token
       const resetToken = user.getRestPasswordToken();
       // hash ko save kar lya yaha 
       await user.save({validateBeforeSave: false});

       // creating mail --> takky mail jae user ko na ke hash 
       //req.get("host") --> mean ke hum ne all the time local host par tu nai chalani web hmay online host par be karni hy so for that hum yeh use kar rhy
       // req.protocol same with this it can be http or https
    
    
       // when we deploy the project we'll use this one 
          const resetPasswordUrl =`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    //    const resetPasswordUrl =`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

       // prepating a message

       const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\n if you have not requested this email than please igrone it `;

       try
       {

        await sendEmail({
                email:user.email,
                subject:`Sheer-Ghar Password Reset`,
                message,
        });
        res.status(200).json({
            success:true,
            message: `Email Send to ${user.email} successfully`
        });

       }catch (error){
        // yeh hy ke jo token save hoa hy ussay undefine kar de agarkoi issue aye
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({validateBeforeSave: false});
            return next(new ErrorHandler(error.message, 500));


       }
});

//--------------------------------------------------------
// Token Milnay ke baad  ResetPasswprd
//--------------------------------------------------------

exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{
// hmary pass mail mein token tu gya hy hum yeh kare ge uss token ko aCCCESS  kar ke db mein dhonday gy 
//creating token hash --> iss hash ko db mein dhonday gy
const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

// finging user
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset Passowrd Token is Invalid or has been expired", 400));
    }

    // jab wo new pasco de ga verify hony ke baad -->
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match", 400));

    }

    // if dono shi hein
    user.password = req.body.password;
    // chnage karne ke baad toekn ko undefine karna hu ga
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);


});
//-----------------------------------------------------------------------
// Get User Details by himself(user)--> taky user update kar sakty apni details wagera ko
//-----------------------------------------------------------------------

exports.getUserDetails =  catchAsyncErrors(async (req, res, next) =>{
const user  = await User.findById(req.user.id);
// iss mein if(!user) wala nai hu ga because --> user login hua hu ga tu yeh swal he paida nai hu ga ke wo not exsist kare
res.status(200).json({
    success: true,
    user
});
});

//-----------------------------------------------------------------------
// User-Update-Password
//-----------------------------------------------------------------------
exports.updatePassword =  catchAsyncErrors(async (req, res, next) =>{
    const user  = await User.findById(req.user.id).select("+password");
    
    const isPasswordMatched = await user.comparePassowrd(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }
   
    if(req.body.newPassowrd !== req.body.confirmPassword){
        return next(new ErrorHandler("New Password Does not match, try again", 400));
    }
    user.password = req.body.newPassowrd;
    await user.save();
    
    sendToken(user, 200, res);
});

//-----------------------------------------------------------------------
// Update-User-Profile
//-----------------------------------------------------------------------
exports.updateProfile =  catchAsyncErrors(async (req, res, next) =>{
    
    const newUserData ={
        name: req.body.name,
        email:req.body.email,
    };
// this run when we did pass any some thing in avatr 
// this mean if req.body.avatar is not empty than do this
        if(req.body.avatar !== ""){
            const user = await User.findById(req.user.id);
            const imageId = user.avatar.public_id;
            //now we need to update the cloudnary 
            await cloudinary.v2.uploader.destroy(imageId);
            // iss neche waly function ke through hum dubara sy image upload kar dein gy
            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });
            newUserData.avatar ={
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
            }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    });

});

//-----------------------------------------------------------------------
// How many user are been registerd ? --> admin access
//-----------------------------------------------------------------------

exports.getAllUser =  catchAsyncErrors(async (req, res, next) =>{
    const users  = await User.find();
    res.status(200).json({
        success:true,
        users,
    });
});

//-----------------------------------------------------------------------
// Get Singke User details by ---> admin
//-----------------------------------------------------------------------

exports.getSingleUser =  catchAsyncErrors(async (req, res, next) =>{
    const user  = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User Doesn't Exsist With Id: ${req.params.id}`));
    }
    res.status(200).json({
        success:true,
        user,
    });
});

//-----------------------------------------------------------------------
// Admin ---> Try to change the user information
// Uodate user profile ---> Admin
//-----------------------------------------------------------------------
exports.updateUserRole =  catchAsyncErrors(async (req, res, next) =>{
    
    const newUserData ={
        name: req.body.name,
        email:req.body.email,
        role: req.body.role,
    };
    // we will add cloudnary later
    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify:false,
    });
    if(!user){
        return next(new ErrorHandler(`User doesn't esxist with id: ${req.params.id}`), 400)
    }
    res.status(200).json({
        success:true,
    });

    // sending mail to the use <> whose id is been updated
    const message = `Sheer Ghar Admin has updated your Profile. Your New Name is: ${user.name} || Your New Email is: ${user.email} ||  Your New ROLE is: ${user.role}`;
    try
    {
     await sendEmail({
             email:user.email,
             subject:`Sheer Ghar Profile Update`,
             message,
     });
     res.status(200).json({
         success:true,
         message: `Email Send to ${user.email} successfully`
     });
    }catch (error){
    }
//-----------------------------------------------------------

});



//-----------------------------------------------------------------------
// Admin ---> Try to Delete the user
// Delete user  ---> Admin
//-----------------------------------------------------------------------
exports.deleteUser =  catchAsyncErrors(async (req, res, next) =>{
    
 
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesn't esxist with id: ${req.params.id}`), 400)
    }
    
    // destroying image from cloudnary
    const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();
    res.status(200).json({
        success:true,
        message: "User Deleted Successfuly)"
    });

        // sending mail to the use <> whose id is been updated
        const message = `Dear: ${user.name} || Your Accounnt has been deleted due to some voilations.`;
        try
        {
         await sendEmail({
                 email:user.email,
                 subject:`Account Deletd Permanently`,
                 message,
         });
         res.status(200).json({
             success:true,
             message: `Email Send to ${user.email} successfully`
         });
        }catch (error){
        }
    //-----------------------------------------------------------

});

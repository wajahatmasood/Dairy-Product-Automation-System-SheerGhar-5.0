// 1:55min
// this is user profile build 
// first we connect Database to the system
const mongoose = require("mongoose");
const validator =  require("validator");
// we import bycrypt taaky hmary password database mein store hony se pehle encrypt hu jaen
const bcrypt =  require("bcryptjs");
// importing JWT token
const jwt = require("jsonwebtoken");
// build in module import
const crypto = require("crypto");

const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Your Name"],
        maxLength:[30,"Name Canot Exceeed 30 Caracter"],
        minLength: [4, "Name Should have more than 4 character"]
    },
    email:{
        type:String,
        required:[true, "Please Enter Your Email"],
        unique: true,
        validate:[validator.isEmail,"Please Enter a Valid Email"]
    },
    password:{
        type:String,
        required:[true, "Please Enter Your Password"],
        minLength: [8, "Password Should be greater than 8 characters"],
        // we did "select:false" this because when admin retrieves the user profile tu ussay uss ka password nai show hu ga 
        // this will send hash  to the mongos 
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    // password reset thing here
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

//------------------------------------------------------
// creating an event for creating hash for the password
//------------------------------------------------------

// save ek event hy jab be userschema call hu ga yeh action uss schema ko save karny se pehle execute hu ga
userSchema.pre("save", async function(next){
// this 10 --> is the power ke kiss power tak wo encrypt hu
    if (!this.isModified("password") ){
        next();
    }
    // this if condotion is soo good here it says ke agar tu password chnage hua hy tu ussay hash ya encrypt kar de4
    // if nai change simple next() move kar dev without encrypt again cuz agar wo mazeed encrypt kare ga tu bhoot issue aye ga
    this.password = await bcrypt.hash(this.password, 10);
});


//JWT Token <--- we generate token and cookies se save kar lein gy ?? why we do this
// yeh iss lye if user ne register kya hy than system ussay diect login karwa de essa na hu ke register karne ke baad wo login kare this feel weird so for that we use token

userSchema.methods.getJWTToken = function(){
    // jwt_secret IS THE secret key jiss sy ap admin acces tak ja sakty hein we don't need to share that key
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRE,
    });
};

//----------------------------------------------
// compare pasword 
//----------------------------------------------

// as database pasco is in hash how to compare ??? again we use bcrypter
userSchema.methods.comparePassowrd = async function (enteredPassword){
    //bcrypt method --> Compare jo khud he compare kar leta hy
    return await bcrypt.compare(enteredPassword, this.password);
};


//----------------------------------------------
// Generating pasco rest token
//----------------------------------------------
userSchema.methods.getRestPasswordToken =  function(){
    //generating token
    // this line below genrate random bytes to reset
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hashing and adding it into user Schema
    // sha256 is an algo to generate hash <--------------
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    // hammy expire be karna hy wo reset wala sc in 15 min
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports =  mongoose.model("User", userSchema);

const Order = require("../models/orderModel");
const Product = require("../models/productModel");
// const ErrorHandler = require("../utils/errorHandler");
const ErrorHandler = require("../utils/errorhandler")

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
var nodemailer = require('nodemailer');
//-----------------------------------------------------------
// CREATE A NEW ORDER
//-----------------------------------------------------------
exports.newOrder =  catchAsyncErrors(async (req, res, next)=>{

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,

    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        // yeh user iss lye dall rhy keo ke user login hu ga tu wo order place kar sakta hy
        user: req.user._id,
    });
    //201 ----> Created
    res.status(201).json({
        success: true,
        order,
    });
});

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

    // const OTP = Math.floor(100000 + Math.random() * 100001);
    // const email = req.body.email;

    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: "info.sheerghar@gmail.com",
    //         pass:"qnczvxnmwagfhkvc",
    //     }
    //   });
  
    // var mailOptions = {
    //     from: "info.sheerghar@gmail.com",
    //     to: email,
    //     subject: 'ORDER Verification OTP Request',
    //    text:`Your Order OTP is: ${OTP} Please provide the OTP when rider arrive Note: Upon giving wrong OTP rider will not give you the product`
    // };
    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         res.status(404).json({ error: error })
    //     } else {
    //         res.status(200).json({ OTP })
    //     }
    // });
  
    // res.status(200).json({
    //   success: true,
    //   message: `Email Send to ${email} successfully `, OTP,
    // });
    
    const OTP = Math.floor(100000 + Math.random() * 100001);
    transporter.use('compile', hbs(handlebarOptions))
    const order = req.body.order;
    console.log(order);
    const shippingcharges =  order.shippingPrice;
    const gst =  order.taxPrice;
    const totalprice = order.totalPrice;
    const status = order.paymentInfo.status;
    
    var mailOptions = {
        from: "info.sheerghar@gmail.com",
        to: order.user.email,
        subject: 'Order Verification OTP (SheerGhar)',
        template: 'riderotp',
        context: {
            OTP,
            shippingcharges,
            gst,
            totalprice,
            status,  
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


//-----------------------------------------------------------
// Get Single Order Details
//-----------------------------------------------------------

exports.getSingleOrder =  catchAsyncErrors(async (req, res, next)=>{

    // this below line is simple as we've mentioned a user when we create an order when we want to see
    // we simply get user by id but we also get name and email And we do it using body method 
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
        );
    if(!order){
        return next(new ErrorHandler("Order Not Found With This ID", 404))
    }
    res.status(201).json({
        success: true,
        order,
    });
});


//-----------------------------------------------------------
// Get Order Details --> this is for user ke wo login kar ke apne orders dekh le
//-----------------------------------------------------------

exports.myOrders =  catchAsyncErrors(async (req, res, next)=>{

    // "user: req.user._id"  this finds the user. mean ke jiss id se user ne order kya hy uss id sy order data fetch kare ga 
    const orders = await Order.find({ user: req.user._id });

    res.status(201).json({
        success: true,
        orders,
    });
});

//-----------------------------------------------------------
// Get All Order --> A D M I N
//-----------------------------------------------------------

exports.getAllOrders =  catchAsyncErrors(async (req, res, next)=>{

    const orders = await Order.find();
    // -------------> this to calculate all the orders <---------------
    let totalAmount =0;
         orders.forEach(order =>{
              totalAmount += order.totalPrice;
    });
    // -------------> this to calculate all the orders <---------------
    res.status(201).json({
        success: true,
        totalAmount,
        orders,
    });
});


//-----------------------------------------------------------
// Update order Status --> A D M I N
//-----------------------------------------------------------

exports.updateOrder =  catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found With This ID", 404))
    }
    
    if(order.orderStatus ===  "Delivered"){
        return next(new ErrorHandler("You have delivered this product <3 ", 404));
    }

    // yeh  function iss lye hy keo ke --> jab order deliver hu jae ga tu than obviouly stcok mein kami aye ge so, for that we are do this
    if(req.body.status === "Shipped"){
    order.orderItems.forEach(async (o) =>{
        await updateStock(o.product,o.quantity)
    });}

    order.orderStatus =  req.body.status;
    order.otp =  req.body.otp;
    
    if(req.body.status === "Delivered")
    {
    order.deliveredAt = Date.now();
    order.paymentInfo.status = "succeeded"
    }
    await order.save({validateBeforeSave : false})
   
    res.status(201).json({
        success: true,
    });
});



//==========================get otp
exports.getOrderOTP =  catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found With This ID", 404))
    }

    res.status(201).json({
        orderOTP: order.otp,
    });
});


async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.Stock -= quantity ;
    await product.save({validateBeforeSave : false});
};

//-----------------------------------------------------------
// Delete Order --> A D M I N
//-----------------------------------------------------------

exports.deleteOrder =  catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found With This ID", 404))
    }

    await order.remove();

    res.status(201).json({
        success: true,
    }); 
});
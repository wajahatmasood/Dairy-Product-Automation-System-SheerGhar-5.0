const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({

    shippingInfo:{
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true, default: "Pakistan"},
        pinCode: {type: Number, required: true},
        phoneNo: {type: Number, required: true},
    },
    // order item array for order item
    orderItems:[{
        name:{
            type: String, required: true,
        },
        price:{
            type: Number, required: true,
        },
        quantity:{
            type: Number, required: true,
        },
        image:{
            type: String, required: true,
        },
        // How we give products ?? we use productobject id for that --> ke jo user ne product khareeda hy kon sa hy
        product:{
            type: mongoose.Schema.ObjectId,
             ref: "Product",
             required: true,
        },
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    paymentInfo:{
        id:{
            type: String, required: true,
        },
        status:{
            type: String, required: true,
        }
    },
    paidAt:{
        type: Date, required: true,
    },
    itemPrice:{
        type: Number, required: true, default: 0,
    },
    taxPrice:{
        type: Number, required: true, default: 0,
    },
    shippingPrice:{
        type: Number, required: true, default: 0,
    },
    totalPrice:{
        type: Number, required: true, default: 0,
    },
    orderStatus:{
        type: String, required: true, default: "Processing",
    },
    deliveredAt:Date,
    createdAt:{
        type : Date,
        default: Date.now,
    },
    otp:{
        type: String, required: false,
    },
});

module.exports =  mongoose.model("Order", orderSchema);
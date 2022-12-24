const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Product Name"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Description"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please Enter Price"],
        maxLength: [6, "Price cannot exceed 8 char"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    // FOR IMAGE WE TAKE 2 THINGS PULIC ID + URL (PUBLIC ID)-> WE GET FROM CLOUD NIGHT 
    // image ko as array lein gy
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    // FOR IMAGE WE TAKE 2 THINGS PULIC ID + URL (PUBLIC ID)-> WE GET FROM CLOUD NIGHT \

    // in category hum enum dy kar yehi define kar sakty categories but hum yeh nai kare gy we do it in front end
    category: {
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    Stock: {
        type: Number,
        required: [true, "Please Enter Stock"],
        maxLength: [3, "Stock cannot exceed 4 char"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,

        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true
        }
    }],

    // this show ke kon se product kiss bandy ne create ke hy ?? like 2 admin hein tu confusion na raahe kahien be 
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
// exporting the model of this database setting in productModel
module.exports = mongoose.model("Product", productSchema)
// IMPORTING THINGS <-----------
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// creating payment function
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  // creating create method <---
  const mayPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "pkr",
    metadata: {
      company: "Sheerghar",
    },
  });
  res
    .status(200)
    .json({ success: true, client_secret: mayPayment.client_secret });
});

// sending API KEY to frontend <-
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
    res
    .status(200)
    .json({  stripeApiKey: process.env.STRIPE_API_KEY });
});

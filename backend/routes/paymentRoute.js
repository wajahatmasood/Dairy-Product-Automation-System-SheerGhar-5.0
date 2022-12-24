const express = require("express");
const { processPayment, sendStripeApiKey } = require("../controllers/paymentController");
const router = express.Router();
const{ isAunthenticatedUser, authorizeRoles} = require("../middleware/auth");

router.route("/payment/process").post(isAunthenticatedUser, authorizeRoles("user"), processPayment);
router.route("/stripeapikey").get(isAunthenticatedUser, authorizeRoles("user"),  sendStripeApiKey);

module.exports = router;
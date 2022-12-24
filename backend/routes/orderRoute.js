const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  verificationOTP,
  getOrderOTP,
} = require("../controllers/orderController");
const router = express.Router();
const { isAunthenticatedUser, authorizeRoles } = require("../middleware/auth");

// create an order route
router.route("/order/new").post(isAunthenticatedUser, newOrder);
router.route("/order/:id").get(isAunthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAunthenticatedUser, myOrders);
router
  .route("/admin/orders")
  .get(isAunthenticatedUser, authorizeRoles("admin", "rider", "manager"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAunthenticatedUser, authorizeRoles("admin", "rider", "manager"), updateOrder)
  .delete(isAunthenticatedUser, authorizeRoles("admin", "manager"), deleteOrder);
 
//shipping mail otp ya ---
router.route("/shippingotp").post(verificationOTP);
router.route("/getOrderOTP/:id").get(getOrderOTP);

module.exports = router;

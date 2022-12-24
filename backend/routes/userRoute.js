const express = require("express");

//register route
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  verificationOTP,
  deleteUser,
} = require("../controllers/userController");
const { isAunthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

//OTP route --> email verfication
router.route("/otp").post(verificationOTP);

router.route("/register").post(registerUser);

//login route
router.route("/login").post(loginUser);

//forgot pasco route
router.route("/password/forgot").post(forgotPassword);

//reset
router.route("/password/reset/:token").put(resetPassword);

//logout route
router.route("/logout").get(logout);

//get user
router.route("/me").get(isAunthenticatedUser, getUserDetails);

//update password
router.route("/password/update").put(isAunthenticatedUser, updatePassword);

//update profile
router.route("/me/update").put(isAunthenticatedUser, updateProfile);

//get user details ---> admin
router
  .route("/admin/users")
  .get(isAunthenticatedUser, authorizeRoles("admin", "manager"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAunthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAunthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAunthenticatedUser, authorizeRoles("admin"), deleteUser);
module.exports = router;

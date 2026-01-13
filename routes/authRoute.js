const express = require("express");
const router = express.Router();

const {
  adminRegister,
  adminLogin,
  verifyAdminOTP,
  forgotPassword,
  resetPassword,
  resendOtp,
} = require("../controllers/adminController");

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/verify-otp", verifyAdminOTP);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


module.exports = router;

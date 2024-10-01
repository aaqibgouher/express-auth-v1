const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Register
router.post("/register", authController.register);
router.post("/send-otp-email", authController.sendOtpEmail);
router.patch("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);

module.exports = router;

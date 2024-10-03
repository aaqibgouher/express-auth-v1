const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", authController.register);
router.post("/send-otp-email", authController.sendOtpEmail);
router.patch("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.get("/users/me", authMiddleware.isAuthenticated, authController.getMe);

module.exports = router;

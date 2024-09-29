const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587, // SMTP port
  secure: false, // Set to true if using port 465, otherwise false for port 587
  auth: {
    user: "aaqibgouher@gmail.com", // Your Ethereal email
    pass: "gwmw jioo oraz seup", // Your Ethereal password
  },
});

const sendOtpEmailUtils = (email, otp) => {
  const mailOptions = {
    from: "aaqibgouher@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    html: `<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9f9f9; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://i.imgur.com/qIufhof.png" alt="Verification" style="width: 100px; margin-bottom: 20px;">
          <h1 style="color: #333; font-size: 24px; font-weight: bold;">Verify Your Email</h1>
          <p style="font-size: 16px; color: #555;">We're excited to have you on board. Please verify your email address by using the OTP below:</p>
          <h2 style="color: #4CAF50; font-size: 32px; font-weight: bold; margin: 20px 0;">${otp}</h2>
          <p style="font-size: 14px; color: #999;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <img src="https://i.imgur.com/CtAPs7N.png" alt="Thank you" style="width: 150px;">
        </div>
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 30px;">If you have any questions, feel free to contact us at support@example.com</p>
      </div>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOtpEmailUtils,
};

const axios = require("axios");

const sendOtp = async (to, otp) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY missing");
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Student Result System",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject: "Your OTP Code",
        htmlContent: `
          <h2>OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This OTP is valid for <b>30 seconds</b>.</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        timeout: 15000,
      },
    );

    console.log(" OTP sent successfully to:", to);
  } catch (err) {
    console.error(" OTP Error:", err.response?.data || err.message);
    throw err;
  }
};

const sendResetPasswordEmail = async (to, resetLink) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY missing");
    }

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Student Result System",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject: "Reset Your Password",
        htmlContent: `
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password.</p>
          <a href="${resetLink}" 
             style="display:inline-block;padding:12px 20px;
             background:#2563eb;color:#fff;
             text-decoration:none;border-radius:6px;">
             Reset Password
          </a>
          <p>This link is valid for <b>15 minutes</b>.</p>
          <p>If you didn't request this, ignore this email.</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );

    console.log(" Reset link sent to:", to);
  } catch (error) {
    console.error("Reset  email error:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = { sendOtp, sendResetPasswordEmail };

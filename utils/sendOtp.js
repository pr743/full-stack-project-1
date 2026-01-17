const axios = require("axios");

const sendOtp = async (to, otp) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Admin Panel",
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
      }
    );

    console.log(" OTP sent via Brevo API:", to);
  } catch (err) {
    console.error(
      " Brevo API OTP Error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

module.exports = { sendOtp };

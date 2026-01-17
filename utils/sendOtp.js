const nodemailer = require("nodemailer");

const sendOtp = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_LOGIN, 
        pass: process.env.BREVO_SMTP_PASS,  
      },
    });
    await transporter.sendMail({
      from: `"Admin Panel" <${process.env.BREVO_SENDER_EMAIL}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:5px;">${otp}</h1>
        <p>This OTP is valid for <b>30 seconds</b>.</p>
      `,
    });

    console.log(" OTP sent successfully to:", to);
  } catch (err) {
    console.error(" SMTP OTP Error:", err.message);
    throw err;
  }
};

module.exports = { sendOtp };

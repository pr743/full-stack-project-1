const nodemailer = require("nodemailer");

const sendOtp = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.BREVO_API_KEY,
      },
      tls: {
        rejectUnauthorized: false,
      },

      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    await transporter.verify();
    console.log("SMTP Connection verified");

    await transporter.sendMail({
      from: "Admin Panel <no-reply@studentapp.com>",
      to,
      subject: "Your OTP Code",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:5px;">${otp}</h1>
        <p>This OTP is valid for <b>30 seconds</b>.</p>
      `,
    });

    console.log("OTP sent to email:", to);
  } catch (error) {
    console.error("Send OTP error:", error);
    throw error;
  }
};

const sendEmail = async (to, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Admin Panel - Password Reset",
    html: htmlContent,
  });
};

module.exports = { sendOtp, sendEmail };

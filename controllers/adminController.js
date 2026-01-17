const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtp , sendEmail } = require("../utils/sendOtp");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET;

exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.trim().toLowerCase();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      isVerified: false,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password){
      return res.status(400).json({ message: "Email & Password required" });

    }
    email = email.trim().toLowerCase();



    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    
     let otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpireAt = Date.now() + 5 * 60 * 1000; 
    await admin.save();

    await sendOtp(admin.email, otp);

    res.json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;


    if(!email || !otp){
      return res.status(400).json({ message: "Email & OTP required" });
    }

    email = email.trim().toLowerCase();

    const admin = await Admin.findOne({email});
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (!admin.otp || admin.otpExpireAt < Date.now()){
       return res.status(400).json({ message: "OTP expired" });

    }
     
    if(String(admin.otp) !==  String(otp) ){
      return res.status(400).json({ message: "Invalid OTP" });

    }


    admin.isVerified = true;
    admin.otp = null;
    admin.otpExpireAt = null;



    await admin.save();

    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "OTP verified. Login successful.",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    email = email.trim().toLowerCase();

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpireAt = Date.now() + 5 * 60 * 1000;
    await admin.save();

    await sendOtp(admin.email, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    email = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");


    admin.resetToken = hashedToken;
    admin.resetTokenExpiry = Date.now() + 15 * 60 * 1000; 
    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;

    await sendEmail(
      admin.email,
      `<h2>Password Reset</h2>
       <p>Click the link below to reset your password:</p>
       <a href="${resetUrl}"  target="_blank">${resetUrl}</a>
       <p>This link will expire in 15 minutes.</p>
      `
    );

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Token & password required" });

     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");



    const admin = await Admin.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!admin)
      return res.status(400).json({ message: "Invalid or expired token" });

    admin.password = await bcrypt.hash(password, 10);
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    const jwtToken = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      message: "Password reset successful",
      token: jwtToken,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
   
    res.status(500).json({ message: "Server error" });
  }
};

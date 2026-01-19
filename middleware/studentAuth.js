const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const { models } = require("mongoose");


const JWT_SECRET = process.env.JWT_SECRET;

const studentAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);


    const student = await Student.findById(decoded.id).select("-password");

    if (!student) {
      return res.status(401).json({ message: "student not found" });
    }

    req.studentId = student._id;
    req.student  = student;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = studentAuth;

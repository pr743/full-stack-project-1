const Student = require("../models/Student");
const Institute = require("../models/Institute");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const JWT_SECRET  = process.env.JWT_SECRET;


exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      type,
      classOrCourse,
      instituteId,
    } = req.body;

    if (!name || !rollNo || !type) {
      return res.status(400).json({
        message: "Name, Roll No, Password and Type are required",
      });
    }

    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }



    const hashedPassword =  await bcrypt.hash(rollNo,10);

    const student = await Student.create({
      name,
      rollNo,
      password: hashedPassword,
      type,
      classOrCourse,      
      instituteId,

    });

    return res.status(200).json({
      message: "Student created successfully",
      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        type: student.type,
      },
    });
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.studentLogin = async (req, res) => {
  try {
    let { rollNo, password } = req.body;

    if (!rollNo || !password) {
      return res.status(400).json({
        message: "Roll Number and password are required",
      });
    }

    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(400).json({ message: "Invalid roll number" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );



    return res.json({
      message: "Student login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        type: student.type,
      },
    });
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate({path:"instituteId",select:"name type"});
    const formatted = students.map((s) => ({
      _id: s._id,
      name: s.name,
      rollNo: s.rollNo,
      classOrCourse: s.classOrCourse || "",
      instituteId: s.instituteId?._id || "",
      instituteName: s.instituteId?.name || "N/A",
      instituteType: s.instituteId?.type || "N/A",
      type:s.type,
    }));
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Get All Students Error:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getStudentProfile = async (req, res) => {
  try {

    return res.json(req.student);
  } catch (error) {
    console.error("Student Profile Error:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const updateStudent = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updateStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({
      message: "Student updated successfully",
      student: updateStudent,
    });
  } catch (error) {
    console.error("Update Student Error:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Student.findByIdAndDelete(studentId);

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ error: error.message });
  }
};

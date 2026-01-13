const express = require("express");
const router = express.Router();

const {
  studentLogin,
  createStudent,
  getAllStudents,
  getStudentProfile,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const auth = require("../middleware/auth");


const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied – admin only" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


router.post("/login", studentLogin);


router.post("/create/", auth, isAdmin, createStudent);


router.get("/", auth, isAdmin, getAllStudents);


router.get("/me", auth, getStudentProfile);


router.put("/:id", auth, isAdmin, updateStudent);


router.delete("/:id", auth, isAdmin, deleteStudent);


module.exports = router;




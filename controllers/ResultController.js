const Result = require("../models/Result");
const Student = require("../models/Student");
const mongoose = require("mongoose");

exports.createResult = async (req, res) => {
  try {
    let { studentId, classLevel , types } = req.body;

    if (!classLevel && studentId) {
      const student = await Student.findById(studentId).select("classLevel");
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      classLevel = student.classLevel; 
    }

    if(!classLevel){
      return res.status(400).json({ message: "Class level is required" });
    }
    const result = new Result({
      studentId,
      instituteId: req.body.instituteId,
      classLevel,
      type: req.body.type || "regular",
      stream: req.body.stream,
      subjectResult: req.body.subjectResult,
      total: req.body.total,
      percentage: req.body.percentage,
      overallStatus: req.body.overallStatus,
      overallGrade: req.body.overallGrade,
      date: req.body.date || new Date(),
    });
    await result.save();

    res.status(200).json({
      message: "Result saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Result Save Error", error);
    res
      .status(500)
      .json({ message: "Failed to save result", error: error.message });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("studentId")
      .populate("instituteId");

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "error loading result" });
  }
};

exports.getResultByStudent = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error loading  student result" });
  }
};

exports.publishResult = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({ message: "Invalid result ID" });
    }

    const results = await Result.findById(id);

    if (!results) {
      return res.status(404).json({ message: "Result not found" });
    }

    if (results.isPublished) {
      return res.status(400).json({ message: "Result already published" });
    }

    results.isPublished = true;

    await results.save();
    res.status(200).json({
  message: "Result published successfully",
  data: results,
});

  } catch (error) {
    console.error("Publish Result Error:", error);
    res.status(500).json({ message: "error to result published" });
  }
};

exports.getResultStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const publishedResults = await Result.countDocuments({ isPublished: true });
    const pendingResults = await Result.countDocuments({ isPublished: false });

    res.json({
      totalStudents,
      publishedResults,
      pendingResults,
    });
  } catch (error) {
    res.status(500).json({ message: "error to result published" });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid result ID" });
    }

    const result = await Result.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    await Result.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Result deleted successfully" });
  } catch (error) {
    console.error("Delete Result Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

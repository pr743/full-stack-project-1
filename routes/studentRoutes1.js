const express = require("express");
const router = express.Router();

const {
  studentDashboard,
  studentResult,
} = require("../controllers/studentController1");

const studentAuth = require("../middleware/studentAuth");
const Result = require("../models/Result");


router.get("/dashboard", studentAuth, studentDashboard);
router.get("/result", studentAuth, studentResult);

router.get("/marksheet/pdf", studentAuth, async (req, res) => {
  try {
    const PDFDocument = require("pdfkit");

    const result = await Result.findOne({
      studentId: req.student._id,
      isPublished: true,
    }).populate("studentId instituteId");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Marksheet.pdf");

    doc.pipe(res);

    doc.fontSize(22).text("OFFICIAL STUDENT MARKSHEET", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Name: ${result.studentId.name}`);
    doc.text(`Roll No: ${result.studentId.rollNo}`);
    doc.text(`Institute: ${result.instituteId?.name || "N/A"}`);

    doc.moveDown();

    result.subjectResult.forEach((s) => {
      doc.text(`${s.name} - ${s.marks} (${s.grade})`);
    });

    doc.moveDown();
    doc.text(`Total: ${result.total}`);
    doc.text(`Percentage: ${result.percentage}%`);
    doc.text(`Status: ${result.overallStatus}`);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF generation failed" });
  }
});

module.exports = router;

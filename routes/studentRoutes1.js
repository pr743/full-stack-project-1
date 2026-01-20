const express = require("express");
const router = express.Router();

const {
  studentDashboard,
  studentResult,
} = require("../controllers/studentController1");

const studentAuth = require("../middleware/studentAuth");
const PDFDocument = require("pdfkit");
const Result = require("../models/Result");


router.get("/students-extra/dashboard", studentAuth, studentDashboard);
router.get("/students-extra/result", studentAuth, studentResult);


router.get("/marksheet/pdf", studentAuth, async (req, res) => {
  try {
    const result = await Result.findOne({
      studentId: req.student.id,
      isPublished: true,
    }).populate("studentId instituteId");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Marksheet.pdf"
    );

    doc.pipe(res);

    
    doc
      .fillColor("#1e40af")
      .fontSize(22)
      .text("OFFICIAL STUDENT MARKSHEET", { align: "center" });

    doc
      .moveDown(0.5)
      .fontSize(12)
      .fillColor("gray")
      .text(result.instituteId?.name || "Institute Name", {
        align: "center",
      });

    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();

   
    doc.moveDown(1);
    doc.fillColor("black").fontSize(12);

    doc.text(`Name: ${result.studentId.name}`);
    doc.text(`Roll No: ${result.studentId.rollNo}`);
    doc.text(`Class: ${result.classLevel}`);
    doc.text(`Institute: ${result.instituteId?.name}`);

    doc.moveDown(1.5);

   
    const startY = doc.y;
    const col1 = 60;
    const col2 = 300;
    const col3 = 430;

    doc
      .fillColor("#1e3a8a")
      .fontSize(13)
      .text("Subject", col1, startY)
      .text("Marks", col2, startY)
      .text("Grade", col3, startY);

    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();

   
    let y = doc.y + 8;
    doc.fontSize(12).fillColor("black");

    result.subjectResult.forEach((s) => {
      doc.text(s.name, col1, y);
      doc.text(String(s.marks), col2, y);
      doc.text(s.grade, col3, y);
      y += 22;
    });

    doc.moveDown(1);
    doc.moveTo(40, y).lineTo(555, y).stroke();

   
    doc.moveDown(1);
    doc.fontSize(13).fillColor("black");

    doc.text(`Total Marks: ${result.total}`);
    doc.text(`Percentage: ${result.percentage}%`);
    doc.text(`Overall Grade: ${result.overallGrade}`);

    doc
      .fillColor(result.overallStatus === "PASS" ? "green" : "red")
      .fontSize(14)
      .text(`Result Status: ${result.overallStatus}`);

    
    doc
      .moveDown(2)
      .fontSize(10)
      .fillColor("gray")
      .text("This is a system-generated marksheet.", { align: "center" });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF generation failed" });
  }
});

module.exports = router;





const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    educationLevel: {
      type: String,
      enum: ["school", "college"],
      required: true,
    },

    classLevel: {
      type: Number,
      required: function () {
        return this.educationLevel === "school";
      },
    },

    subject: {
      type: String,
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalMarks: {
      type: Number,
      default: 100,
    },

    semester: {
      type: Number,
      required: function () {
        return this.educationLevel === "college";
      },
    },

    percentage: Number,
    grade: String,

    cgpa: {
      type: Number,
      max: 10,
    },
  },

  {
    timestamps: true,
  }
);

marksSchema.pre("save", function (next) {
  if (this.educationLevel === "school") {
    this.percentage = (this.marksObtained / this.totalMarks) * 100;

    if (this.percentage >= 90) {
      this.grade = "A+";
    } else if (this.percentage >= 80) {
      this.grade = "A";
    } else if (this.percentage >= 70) {
      this.grade = "B";
    } else if (this.percentage >= 60) {
      this.grade = "C";
    } else if (this.percentage >= 50) {
      this.grade = "D";
    } else if (this.percentage >= 40) {
      this.grade = "E";
    } else if (this.percentage >= 33) {
      this.grade = "F";
    } else {
      this.grade = "Fail";
    }

    this.cgpa = undefined;

    if (this.educationLevel === "college") {
      if (!cgpa) {
        this.cgpa = ((this.marksObtained / this.totalMarks) * 10).toFixed(2);
      }

      this.percentage = undefined;
      this.grade = undefined;
    }
  }
  next();
});

module.exports = mongoose.model("Marks", marksSchema);

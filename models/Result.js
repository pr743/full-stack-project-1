const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
  },

  type: {
    type: String,
    enum: ["regular", "private", "distance"],
    required: true,
  },

  stream: {
    type: String,
  },

  subjectResult: [
    {
      name: String,
      marks: Number,
      grade: String,
      status: String,
    }
  ],

  total: {
    type: Number,
    required: true,
  },

  percentage: {
    type: Number,
    required: true,
  },

  overallStatus: {
    type: String,
    enum: ["PASS", "FAIL"],
    required: true,
  },

  overallGrade: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  isPublished:{
    type:Boolean,
    default:false
  },

  
},
{
  timestamps: true,
});

module.exports = mongoose.model("Result", resultSchema);

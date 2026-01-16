const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,      
      required: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["regular", "private", "distance"],
      required: true,
    },

    classOrCourse: {
      type: String,
    },

    classLevel:{
      type: String,
      required: true,
    },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      require:true,
    },


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);

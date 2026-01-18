const mongoose = require("mongoose");
const instituteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim:true
    },

    type: {
      type: String,
      enum: ["school"],
      required: true,
    },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Institute", instituteSchema);

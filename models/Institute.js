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
      enum: ["school", "college", "university"],
      required: true,
    },
    
   address:{
    type: String,
   },

   code:{
    type:String,
    require:true,
    unique:true,
   }


},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Institute", instituteSchema);

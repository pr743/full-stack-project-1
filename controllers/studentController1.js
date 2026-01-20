const Result = require("../models/Result");

exports.studentDashboard = async (req, res) => {
  try {
    console.log("STUDENT ID:", req.studentId);
    const student = req.student._id;

    const result = await Result.findOne({
      studentId: student._id,
      isPublished: true,
    });

    res.json({
      student: {
        name: student.name,
        rollNo: student.rollNo,
      },

      result: result
        ? {
            status: result.overallStatus,
            isPublished: true,
            total: result.total,
            percentage: result.percentage,
            grade: result.overallGrade,
          }
        : {
            isPublished: false,
          },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



exports.studentResult = async(req,res)=>{
    try {
        const result = await Result.findOne({
            studentId:req.student._id,
            isPublished:true
        })

        .populate("studentId","name rollNo classLevel")
        .populate("instituteId","name")


        if(!result){
            return res.status(400).json({message:"Result not published yet"});   

        }

        res.json(result);
    } catch (error) {
        console.error(err);
         res.status(500).json({ message: "Server error" });
 
    }
}
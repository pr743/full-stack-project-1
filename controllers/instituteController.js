const Institute = require("../models/Institute");

exports.createInstitute = async (req, res) => {
  try {
    console.log("BODY:",req.body);
    const {name ,type} = req.body;

    if(!name || !type){
      return res.status(400).json({message:"name and type required"})
    }
    const inst = await Institute.create({name ,type});
    res.status(200).json(inst);
  } catch (err) {
    console.error("CREATE INSTITUTE ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getAllInstitute = async (req, res) => {
  try {
    const data = await Institute.find();
     res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({message:error.message});
    
  }
};

exports.updateInstitute = async (req, res) => {
  const inst = await Institute.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(inst);
};

exports.deleteInstitute = async (req, res) => {
  await Institute.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};

const Institute = require("../models/Institute");

exports.createInstitute = async (req, res) => {
  try {
    const inst = await Institute.create(req.body);
    res.json(inst);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getAllInstitute = async (req, res) => {
  const data = await Institute.find();
  res.json(data);
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

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  publishResult,
  getResultStats,
  deleteResult
} = require("../controllers/ResultController");
const Result = require("../models/Result");

router.post("/publish/:id", publishResult);
router.get("/stats", getResultStats);

router.get("/published", async (req, res) => {
  try {
    const results = await Result.find({ isPublished: true })
      .populate("studentId", "name rollNo")
      .populate("instituteId", "name ");
      res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching published results" });
  }
});


router.delete("/:id", auth, deleteResult);

router.get("/marksheet/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("studentId", "name rollNo")
      .populate("instituteId", "name address");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching marksheet" });
  }
});

module.exports = router;


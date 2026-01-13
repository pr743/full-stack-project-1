const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createResult,
  getAllResults,
  getResultByStudent,
  deleteResult
  
} = require("../controllers/ResultController");



router.post("/", createResult);
router.get("/", getAllResults);
router.get("/student/:studentId", getResultByStudent);
router.delete("/:id", auth, deleteResult);

module.exports = router;


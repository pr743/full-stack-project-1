const express = require("express");
const router = express.Router();

const {
  getAllInstitute,
  createInstitute,
  updateInstitute,
  deleteInstitute,
} = require("../controllers/instituteController");

const auth = require("../middleware/auth");


router.post("/", auth, createInstitute);


router.get("/", auth, getAllInstitute);


router.put("/:id", auth, updateInstitute);


router.delete("/:id", auth, deleteInstitute);

module.exports = router;

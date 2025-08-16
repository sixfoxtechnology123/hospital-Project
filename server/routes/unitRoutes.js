const express = require("express");
const {
  getAllUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  getLatestUnitId,
} = require("../controllers/unitController");

const router = express.Router();

router.get("/", getAllUnits);
router.get("/latest", getLatestUnitId);
router.post("/", createUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

module.exports = router;

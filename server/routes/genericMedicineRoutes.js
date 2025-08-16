const express = require("express");
const {
  getAllGenerics,
  createGeneric,
  updateGeneric,
  deleteGeneric,
  getLatestGenericId,
} = require("../controllers/genericMedicineController");

const router = express.Router();

router.get("/", getAllGenerics);
router.get("/latest", getLatestGenericId);
router.post("/", createGeneric);
router.put("/:id", updateGeneric);
router.delete("/:id", deleteGeneric);

module.exports = router;

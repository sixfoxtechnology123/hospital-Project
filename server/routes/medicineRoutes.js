const express = require("express");
const router = express.Router();
const {
  getLatestMedicineId,
  getAllMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine
} = require("../controllers/medicineController");

router.get("/latest", getLatestMedicineId);
router.get("/", getAllMedicines);
router.post("/", createMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;

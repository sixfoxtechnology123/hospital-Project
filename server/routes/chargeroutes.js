// routes/chargeRoutes.js
const express = require("express");
const router = express.Router();
const {
  getLatestChargeId,
  getAllCharges,
  createCharge,
  updateCharge,
  deleteCharge,
  getItemsByType,
} = require("../controllers/chargecontroller");

router.get("/", getAllCharges);
router.get("/latest", getLatestChargeId);
router.get("/items/:type", getItemsByType);
router.post("/", createCharge);
router.put("/:id", updateCharge);
router.delete("/:id", deleteCharge);

module.exports = router;

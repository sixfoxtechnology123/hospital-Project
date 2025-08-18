// routes/insuranceRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllProviders,
  getLatestProviderId,
  createProvider,
  updateProvider,
  deleteProvider,
} = require("../controllers/insuranceController");

router.get("/", getAllProviders);
router.get("/latest", getLatestProviderId);
router.post("/", createProvider);
router.put("/:id", updateProvider);
router.delete("/:id", deleteProvider);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getNextStatusId,
  createStatus,
  updateStatus,
  getAllStatus,
  deleteStatus
} = require("../controllers/statusController");

// Generate next Status ID
router.get("/next-id", getNextStatusId);

// Create
router.post("/", createStatus);

// Update
router.put("/:id", updateStatus);

// List all
router.get("/", getAllStatus);

// Delete
router.delete("/:id", deleteStatus);

module.exports = router;

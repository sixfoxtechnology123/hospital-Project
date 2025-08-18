const Status = require("../models/Status");

// Generate next Status ID
async function getNextStatusId(req, res) {
  try {
    const last = await Status.findOne().sort({ statusId: -1 }).lean();
    let nextId = "STATUS001";

    if (last && last.statusId) {
      const lastNum = parseInt(last.statusId.replace("STATUS", ""));
      nextId = "STATUS" + String(lastNum + 1).padStart(3, "0");
    }

    res.json({ nextId });
  } catch (err) {
    console.error("Error generating next statusId", err);
    res.status(500).json({ error: "Failed to generate next statusId" });
  }
}

// Create new Status
async function createStatus(req, res) {
  try {
    // If frontend didn’t send statusId → generate
    let { statusId, statusName, description } = req.body;

    if (!statusId) {
      const last = await Status.findOne().sort({ statusId: -1 }).lean();
      let nextId = "STATUS001";
      if (last && last.statusId) {
        const lastNum = parseInt(last.statusId.replace("STATUS", ""));
        nextId = "STATUS" + String(lastNum + 1).padStart(3, "0");
      }
      statusId = nextId;
    }

    const newStatus = new Status({ statusId, statusName, description });
    await newStatus.save();
    res.status(201).json(newStatus);
  } catch (err) {
    console.error("Error creating status", err);
    res.status(500).json({ error: "Failed to create status" });
  }
}

// Update Status
async function updateStatus(req, res) {
  try {
    const updated = await Status.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating status", err);
    res.status(500).json({ error: "Failed to update status" });
  }
}

// Get all Status
async function getAllStatus(req, res) {
  try {
    const statuses = await Status.find();
    res.json(statuses);
  } catch (err) {
    console.error("Error fetching statuses", err);
    res.status(500).json({ error: "Failed to fetch statuses" });
  }
}

// Delete Status
async function deleteStatus(req, res) {
  try {
    const deleted = await Status.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Status not found" });
    }
    res.json({ message: "Status deleted successfully" });
  } catch (err) {
    console.error("Error deleting status", err);
    res.status(500).json({ error: "Failed to delete status" });
  }
}

module.exports = {
  getNextStatusId,
  createStatus,
  updateStatus,
  getAllStatus,
  deleteStatus



  
};


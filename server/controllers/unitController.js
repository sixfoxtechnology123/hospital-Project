const Unit = require("../models/Unit");

const PREFIX = "UNIT";
const PAD = 4;

// Generate next Unit ID
async function generateNextUnitId() {
  const last = await Unit.aggregate([
    {
      $project: {
        numericId: {
          $toInt: {
            $substrCP: ["$unitId", PREFIX.length, { $strLenCP: "$unitId" }]
          }
        }
      }
    },
    { $sort: { numericId: -1 } },
    { $limit: 1 }
  ]);

  if (!last || last.length === 0) {
    return `${PREFIX}${String(1).padStart(PAD, "0")}`; // UNIT0001
  }

  const nextNum = last[0].numericId + 1;
  return `${PREFIX}${String(nextNum).padStart(PAD, "0")}`;
}

// Get latest ID
exports.getLatestUnitId = async (_req, res) => {
  try {
    const nextId = await generateNextUnitId();
    res.json({ unitId: nextId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all units
exports.getAllUnits = async (_req, res) => {
  try {
    const units = await Unit.find().lean();
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create unit
exports.createUnit = async (req, res) => {
  try {
    const { unitName, description = "", status = "Active" } = req.body;
    if (!unitName) return res.status(400).json({ error: "unitName is required" });

    const unitId = await generateNextUnitId();
    const doc = new Unit({ unitId, unitName, description, status });
    await doc.save();

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update unit
exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    delete payload.unitId;

    const updated = await Unit.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: "Unit not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete unit
exports.deleteUnit = async (req, res) => {
  try {
    const deleted = await Unit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Unit not found" });

    res.json({ message: "Unit deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

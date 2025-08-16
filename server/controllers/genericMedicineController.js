const GenericMedicine = require("../models/genericMedicine");

const PREFIX = "GENMED";
const PAD = 4;

// Generate next Generic ID
async function generateNextGenericId() {
  const last = await GenericMedicine.aggregate([
    {
      $project: {
        numericId: {
          $toInt: {
            $substrCP: ["$genericId", PREFIX.length, { $strLenCP: "$genericId" }]
          }
        }
      }
    },
    { $sort: { numericId: -1 } },
    { $limit: 1 }
  ]);

  if (!last || last.length === 0) {
    return `${PREFIX}${String(1).padStart(PAD, "0")}`; // GENMED0001
  }

  const nextNum = last[0].numericId + 1;
  return `${PREFIX}${String(nextNum).padStart(PAD, "0")}`;
}

// Get latest ID
exports.getLatestGenericId = async (_req, res) => {
  try {
    const nextId = await generateNextGenericId();
    res.json({ genericId: nextId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all
exports.getAllGenerics = async (_req, res) => {
  try {
    const generics = await GenericMedicine.find().lean();
    res.json(generics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create
exports.createGeneric = async (req, res) => {
  try {
    const { genericName, description = "", status = "Active" } = req.body;
    if (!genericName) return res.status(400).json({ error: "genericName is required" });

    const genericId = await generateNextGenericId();

    const doc = new GenericMedicine({ genericId, genericName, description, status });
    await doc.save();

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateGeneric = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    delete payload.genericId; // prevent editing ID

    const updated = await GenericMedicine.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: "Generic medicine not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteGeneric = async (req, res) => {
  try {
    const deleted = await GenericMedicine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Generic medicine not found" });

    res.json({ message: "Generic medicine deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

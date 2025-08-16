const Medicine = require('../models/Medicine');

const PREFIX = "MED";
const PAD = 4;

async function generateNextMedicineId() {
  const last = await Medicine.findOne().sort({ medicineId: -1 }).lean();
  if (!last || !last.medicineId) return `${PREFIX}${String(1).padStart(PAD, '0')}`;
  const lastNum = parseInt(last.medicineId.replace(PREFIX, ''), 10) || 0;
  return `${PREFIX}${String(lastNum + 1).padStart(PAD, '0')}`;
}

exports.getLatestMedicineId = async (_req, res) => {
  try {
    const medicineId = await generateNextMedicineId();
    res.json({ medicineId });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to generate medicineId" });
  }
};

exports.getAllMedicines = async (_req, res) => {
  try {
    const meds = await Medicine.find().sort({ medicineId: 1 });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch medicines" });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const { name, genericName, unit, stock = 0, status = "Active" } = req.body;
    if (!name || !genericName || !unit)
      return res.status(400).json({ error: "name, genericName, unit are required" });

    const medicineId = await generateNextMedicineId();
    const doc = new Medicine({ medicineId, name, genericName, unit, stock, status });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create medicine" });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    if (payload.medicineId) delete payload.medicineId;

    const updated = await Medicine.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: "Medicine not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update medicine" });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const removed = await Medicine.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Medicine not found" });
    res.json({ message: "Medicine deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete medicine" });
  }
};

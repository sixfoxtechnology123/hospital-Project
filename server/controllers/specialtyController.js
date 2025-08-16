// controllers/specialtyController.js
const mongoose = require('mongoose');
const Specialty = require('../models/Specialty');
const Department = require('../models/Department');

const PREFIX = 'SP';
const PAD = 3;

// Auto-generate next Specialty ID
async function generateNextSpecialtyId() {
  const last = await Specialty.findOne().sort({ specialtyId: -1 }).lean();
  if (!last || !last.specialtyId) return `${PREFIX}${String(1).padStart(PAD, '0')}`;

  const lastNum = parseInt(last.specialtyId.replace(PREFIX, ''), 10) || 0;
  const nextNum = lastNum + 1;
  return `${PREFIX}${String(nextNum).padStart(PAD, '0')}`;
}

// GET latest ID
exports.getLatestSpecialtyId = async (_req, res) => {
  try {
    const nextId = await generateNextSpecialtyId();
    res.json({ specialtyId: nextId });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get next specialty ID' });
  }
};

// GET all specialties
exports.getAllSpecialties = async (_req, res) => {
  try {
    const specialties = await Specialty.find()
      .populate('departmentId', 'deptName')
      .lean();

    const formatted = specialties.map(sp => ({
      _id: sp._id,
      specialtyId: sp.specialtyId,
      name: sp.name,
      departmentName: sp.departmentId?.deptName || '',
      status: sp.status,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch specialties' });
  }
};

// CREATE specialty
exports.createSpecialty = async (req, res) => {
  try {
    const { name, departmentId, status = 'Active' } = req.body;

    if (!name || !departmentId) {
      return res.status(400).json({ error: 'name and departmentId are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ error: 'departmentId is not a valid ObjectId' });
    }

    const specialtyId = await generateNextSpecialtyId();

    const doc = new Specialty({ specialtyId, name, departmentId, status });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create specialty' });
  }
};

// UPDATE specialty
exports.updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.specialtyId) delete payload.specialtyId; // prevent overwrite

    if (payload.departmentId && !mongoose.Types.ObjectId.isValid(payload.departmentId)) {
      return res.status(400).json({ error: 'departmentId is not a valid ObjectId' });
    }

    const updated = await Specialty.findByIdAndUpdate(id, payload, { new: true }).populate('departmentId', 'deptName');
    if (!updated) return res.status(404).json({ error: 'Specialty not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update specialty' });
  }
};

// DELETE specialty
exports.deleteSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndDelete(req.params.id);
    if (!specialty) return res.status(404).json({ error: 'Specialty not found' });
    res.json({ message: 'Specialty deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

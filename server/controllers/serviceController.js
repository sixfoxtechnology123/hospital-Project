// controllers/serviceController.js
const mongoose = require('mongoose');
const Service = require('../models/service');

// prefix used everywhere (matches your frontend fallback "SRV0001")
const PREFIX = 'SERV';
const PAD = 4;

// Generate next Service ID by looking at the highest serviceId in DB
async function generateNextServiceId() {
  // Sort by serviceId DESC; since it's zero-padded, lexicographic sort works
  const last = await Service.findOne().sort({ serviceId: -1 }).lean();
  if (!last || !last.serviceId) return `${PREFIX}${String(1).padStart(PAD, '0')}`;

  const lastNum = parseInt(last.serviceId.replace(PREFIX, ''), 10) || 0;
  const nextNum = lastNum + 1;
  return `${PREFIX}${String(nextNum).padStart(PAD, '0')}`;
}

// GET /api/services/latest  -> { serviceId: 'SRV0001' }
exports.getLatestServiceId = async (_req, res) => {
  try {
    const nextId = await generateNextServiceId();
    res.json({ serviceId: nextId });
  } catch (err) {
    console.error('getLatestServiceId error:', err);
    res.status(500).json({ error: err.message || 'Failed to get next service ID' });
  }
};

// GET /api/services  -> list with populated department name
exports.getAllServices = async (_req, res) => {
  try {
    const services = await Service.find().populate('departmentId', 'deptName');
    res.json(services);
  } catch (err) {
    console.error('getAllServices error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch services' });
  }
};

// POST /api/services  -> create (auto-generates serviceId)
exports.createService = async (req, res) => {
  try {
    const { serviceName, serviceCategory, departmentId, description = '', status = 'Active' } = req.body;

    // Basic validation (better error messages than a generic 500)
    if (!serviceName || !serviceCategory || !departmentId) {
      return res.status(400).json({ error: 'serviceName, serviceCategory, and departmentId are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ error: 'departmentId is not a valid ObjectId' });
    }

    const serviceId = await generateNextServiceId();

    const doc = new Service({
      serviceId,
      serviceName,
      serviceCategory,
      departmentId,
      description,
      status,
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('createService error:', err);
    // Surface the real reason to the client for debugging
    res.status(500).json({ error: err.message || 'Failed to create service' });
  }
};

// PUT /api/services/:id  -> update
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    // Do not allow serviceId changes from client
    if (payload.serviceId) delete payload.serviceId;

    if (payload.departmentId && !mongoose.Types.ObjectId.isValid(payload.departmentId)) {
      return res.status(400).json({ error: 'departmentId is not a valid ObjectId' });
    }

    const updated = await Service.findByIdAndUpdate(id, payload, { new: true }).populate('departmentId', 'deptName');
    if (!updated) return res.status(404).json({ error: 'Service not found' });

    res.json(updated);
  } catch (err) {
    console.error('updateService error:', err);
    res.status(500).json({ error: err.message || 'Failed to update service' });
  }
};

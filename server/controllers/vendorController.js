// controllers/vendorController.js
const Vendor = require('../models/Vendor');

const PREFIX = 'VEND';
const PAD = 4;

// Generate next vendor ID
async function generateNextVendorId() {
  const last = await Vendor.findOne().sort({ vendorId: -1 }).lean();
  if (!last || !last.vendorId) return `${PREFIX}${String(1).padStart(PAD, '0')}`;
  const lastNum = parseInt(last.vendorId.replace(PREFIX, ''), 10) || 0;
  return `${PREFIX}${String(lastNum + 1).padStart(PAD, '0')}`;
}

// GET latest vendorId
exports.getLatestVendorId = async (_req, res) => {
  try {
    const nextId = await generateNextVendorId();
    res.json({ vendorId: nextId });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get vendor ID' });
  }
};

// GET all vendors
exports.getAllVendors = async (_req, res) => {
  try {
    const vendors = await Vendor.find().lean();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch vendors' });
  }
};

// CREATE vendor
exports.createVendor = async (req, res) => {
  try {
    const { vendorName, contactPerson, mobileNumber, gstNo, email, address } = req.body;

    if (!vendorName || !contactPerson || !mobileNumber || !gstNo || !email || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const vendorId = await generateNextVendorId();

    const doc = new Vendor({ vendorId, vendorName, contactPerson, mobileNumber, gstNo, email, address });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create vendor' });
  }
};

// UPDATE vendor
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    if (payload.vendorId) delete payload.vendorId;

    const updated = await Vendor.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: 'Vendor not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update vendor' });
  }
};

// DELETE vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

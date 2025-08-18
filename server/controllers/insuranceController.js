// controllers/insuranceController.js
const InsuranceProvider = require("../models/InsuranceProvider");

const PREFIX = "INSPROV";
const PAD = 4;

async function generateNextProviderId() {
  const last = await InsuranceProvider.findOne().sort({ providerId: -1 }).lean();
  if (!last || !last.providerId) return `${PREFIX}${String(1).padStart(PAD, "0")}`;

  const lastNum = parseInt(last.providerId.replace(PREFIX, ""), 10) || 0;
  const nextNum = lastNum + 1;
  return `${PREFIX}${String(nextNum).padStart(PAD, "0")}`;
}

exports.getLatestProviderId = async (_req, res) => {
  try {
    const nextId = await generateNextProviderId();
    res.json({ providerId: nextId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProviders = async (_req, res) => {
  try {
    const providers = await InsuranceProvider.find().lean();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProvider = async (req, res) => {
  try {
    const { name, contact_person, contact_number, email, status } = req.body;
    const providerId = await generateNextProviderId();

    const newProvider = new InsuranceProvider({
      providerId,
      name,
      contact_person,
      contact_number,
      email,
      status,
    });

    await newProvider.save();
    res.status(201).json(newProvider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProvider = async (req, res) => {
  try {
    const updated = await InsuranceProvider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Provider not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    const deleted = await InsuranceProvider.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Provider not found" });
    res.json({ message: "Provider deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

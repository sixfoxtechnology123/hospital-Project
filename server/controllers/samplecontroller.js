// controllers/sampleController.js
const Sample = require('../models/sample');

const PREFIX = 'SAMPLE';
const PAD = 4;

// Generate next sampleId
async function generateNextSampleId() {
  const last = await Sample.findOne().sort({ sampleId: -1 }).lean();
  if (!last || !last.sampleId) return `${PREFIX}${String(1).padStart(PAD, '0')}`;
  const lastNum = parseInt(last.sampleId.replace(PREFIX, ''), 10) || 0;
  return `${PREFIX}${String(lastNum + 1).padStart(PAD, '0')}`;
}

exports.getLatestSampleId = async (_req, res) => {
  try {
    const nextId = await generateNextSampleId();
    res.json({ sampleId: nextId });
  } catch (err) {
    console.error('getLatestSampleId error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSamples = async (_req, res) => {
  try {
    const samples = await Sample.find().lean();
    res.json(samples);
  } catch (err) {
    console.error('getAllSamples error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createSample = async (req, res) => {
  try {
    const { sampleName, description = '', status = 'Active' } = req.body;
    if (!sampleName) return res.status(400).json({ error: 'sampleName is required' });

    const sampleId = await generateNextSampleId();
    const doc = new Sample({ sampleId, sampleName, description, status });
    await doc.save();

    res.status(201).json(doc);
  } catch (err) {
    console.error('createSample error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSample = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    if (payload.sampleId) delete payload.sampleId; // prevent overriding ID

    const updated = await Sample.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: 'Sample not found' });

    res.json(updated);
  } catch (err) {
    console.error('updateSample error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSample = async (req, res) => {
  try {
    const sample = await Sample.findByIdAndDelete(req.params.id);
    if (!sample) return res.status(404).json({ error: 'Sample not found' });
    res.json({ message: 'Sample deleted successfully' });
  } catch (err) {
    console.error('deleteSample error:', err);
    res.status(500).json({ error: err.message });
  }
};

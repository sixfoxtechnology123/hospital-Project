// controllers/serviceRateController.js
const ServiceRate = require('../models/ServiceRate');
const ServiceMaster = require('../models/service'); // your existing ServiceMaster model

const PREFIX = 'SERVRATE';
const PAD = 4;

async function generateNextRateId() {
  const last = await ServiceRate.findOne().sort({ rateId: -1 }).lean();
  if (!last || !last.rateId) return `${PREFIX}${String(1).padStart(PAD, '0')}`;
  const lastNum = parseInt(last.rateId.replace(PREFIX, ''), 10) || 0;
  const nextNum = lastNum + 1;
  return `${PREFIX}${String(nextNum).padStart(PAD, '0')}`;
}

// GET /api/service-rates/latest
exports.getLatestRateId = async (_req, res) => {
  try {
    const nextId = await generateNextRateId();
    res.json({ rateId: nextId });
  } catch (err) {
    console.error('getLatestRateId error:', err);
    res.status(500).json({ error: err.message || 'Failed to get next rate ID' });
  }
};

// GET /api/service-rates (list with service name)
exports.getAllRates = async (_req, res) => {
  try {
    const rates = await ServiceRate.aggregate([
      {
        $lookup: {
          from: 'servicemaster',        // collection name for ServiceMaster
          localField: 'serviceId',      // string like SRV0001 / SERV0001
          foreignField: 'serviceId',    // match by serviceId string
          as: 'service',
        },
      },
      { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          rateId: 1,
          serviceId: 1,
          serviceName: '$service.serviceName',
          rateType: 1,
          rateAmount: 1,
          effectiveFrom: 1,
          effectiveTo: 1,
          status: 1,
          doctorShare: 1,
          hospitalShare: 1,
        },
      },
      { $sort: { rateId: 1 } },
    ]);

    res.json(rates);
  } catch (err) {
    console.error('getAllRates error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch rates' });
  }
};

// POST /api/service-rates
exports.createRate = async (req, res) => {
  try {
    const {
      serviceId,
      rateType,
      rateAmount,
      effectiveFrom,
      effectiveTo,
      status = 'Active',
      doctorShare = null,
      hospitalShare = null,
    } = req.body;

    if (!serviceId || !rateType || rateAmount == null || !effectiveFrom) {
      return res.status(400).json({ error: 'serviceId, rateType, rateAmount, effectiveFrom are required' });
    }

    // Ensure service exists
    const svc = await ServiceMaster.findOne({ serviceId }).lean();
    if (!svc) return res.status(404).json({ error: 'Linked serviceId not found' });

    const rateId = await generateNextRateId();

    const doc = new ServiceRate({
      rateId,
      serviceId,
      rateType,
      rateAmount,
      effectiveFrom,
      effectiveTo: effectiveTo || null,
      status,
      doctorShare,
      hospitalShare,
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('createRate error:', err);
    res.status(500).json({ error: err.message || 'Failed to create rate' });
  }
};

// PUT /api/service-rates/:id
exports.updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    if (payload.rateId) delete payload.rateId; // prevent id change

    if (payload.serviceId) {
      const svc = await ServiceMaster.findOne({ serviceId: payload.serviceId }).lean();
      if (!svc) return res.status(404).json({ error: 'Linked serviceId not found' });
    }

    const updated = await ServiceRate.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: 'Rate not found' });
    res.json(updated);
  } catch (err) {
    console.error('updateRate error:', err);
    res.status(500).json({ error: err.message || 'Failed to update rate' });
  }
};

// DELETE /api/service-rates/:id
exports.deleteRate = async (req, res) => {
  try {
    const removed = await ServiceRate.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Rate not found' });
    res.json({ message: 'Rate deleted successfully' });
  } catch (err) {
    console.error('deleteRate error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete rate' });
  }
};

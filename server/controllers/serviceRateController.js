const ServiceRate = require('../models/ServiceRate');

// POST multiple rates
exports.saveServiceRates = async (req, res) => {
  try {
    await ServiceRate.insertMany(req.body);
    res.status(201).json({ message: 'Service rates saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all or search
exports.getServiceRates = async (req, res) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');

    const results = await ServiceRate.find({
      $or: [
        { serviceCode: regex },
        { departmentName: regex },
        { serviceName: regex }
      ]
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

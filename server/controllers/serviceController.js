const Service = require('../models/service');

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 }); // For code generation
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching services.' });
  }
};

// Create a new service
const createService = async (req, res) => {
  const { code, name, department } = req.body;

  try {
    const existing = await Service.findOne({ code });
    if (existing) {
      return res.status(400).json({ error: 'Service code already exists' });
    }

    const newService = new Service({ code, name, department });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: 'Server error while saving service.' });
  }
};

module.exports = {
  getAllServices,
  createService,
};

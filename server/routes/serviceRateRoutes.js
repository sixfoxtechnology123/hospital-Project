const express = require('express');
const router = express.Router();
const ServiceRate = require('../models/ServiceRate');

// POST: Add a new service rate
router.post('/', async (req, res) => {
  try {
    const serviceRate = new ServiceRate(req.body);
    await serviceRate.save();
    res.status(201).json({ message: 'Service rate saved successfully' });
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Failed to save service rate' });
  }
});

// GET: Search service rates by service code
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.serviceCode = { $regex: new RegExp(search, 'i') };
    }

    const results = await ServiceRate.find(query).sort({ effectiveFrom: -1 });
    res.json(results);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Failed to fetch service rates' });
  }
});

module.exports = router;

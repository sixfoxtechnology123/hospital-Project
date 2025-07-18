const express = require('express');
const router = express.Router();

const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const Plan = require('../models/Plan');
const Package = require('../models/Package');

// Department Master
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find(); 
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Doctor Master
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Plan Master
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Package Master
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

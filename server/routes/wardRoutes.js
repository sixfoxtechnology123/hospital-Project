// routes/wardRoutes.js
const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');
const DepartmentMaster = require('../models/Department'); // fixed path

// ✅ GET all wards (with department name from DepartmentMaster)
router.get('/', async (req, res) => {
  try {
    const wards = await Ward.find().sort({ wardId: 1 });
    res.json(wards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching wards' });
  }
});

// ✅ GET latest wardId
router.get('/latest', async (req, res) => {
  try {
    const allWards = await Ward.find();

    if (allWards.length === 0) {
      return res.json({ wardId: 'WARD0001' });
    }

    const maxWardNumber = Math.max(
      ...allWards.map(w => parseInt(w.wardId.replace('WARD', '')))
    );

    const nextWardId = `WARD${(maxWardNumber + 1).toString().padStart(4, '0')}`;
    res.json({ wardId: nextWardId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating next ward ID' });
  }
});

// ✅ CHECK if ward exists
router.get('/check/:wardId', async (req, res) => {
  try {
    const ward = await Ward.findOne({ wardId: req.params.wardId });
    res.json({ exists: !!ward });
  } catch (err) {
    res.status(500).json({ message: 'Error checking ward ID' });
  }
});

// ✅ DELETE Ward
router.delete('/:wardId', async (req, res) => {
  try {
    const ward = await Ward.findOneAndDelete({ wardId: req.params.wardId });
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    res.json({ message: 'Ward deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST new ward (store deptCode instead of _id)
router.post('/', async (req, res) => {
  try {
    const { wardId, name, departmentId, type, status } = req.body;

    // Find department by _id to get deptCode
    const department = await DepartmentMaster.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const newWard = new Ward({
      wardId,
      name,
      departmentCode: department.deptCode, // store deptCode here
      type,
      status
    });

    await newWard.save();
    res.status(201).json(newWard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving ward' });
  }
});

module.exports = router;

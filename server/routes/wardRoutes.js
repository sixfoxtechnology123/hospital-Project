// routes/wardRoutes.js
const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');
const DepartmentMaster = require('../models/Department');

// ✅ GET all wards with department names (aggregation join)
router.get('/', async (req, res) => {
  try {
    const wards = await Ward.aggregate([
      {
        $lookup: {
          from: 'departmentmasters', // collection name (lowercase plural)
          localField: 'departmentCode',
          foreignField: 'deptCode',
          as: 'department'
        }
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          wardId: 1,
          name: 1,
          type: 1,
          status: 1,
          departmentCode: 1,
          departmentName: { $ifNull: ['$department.deptName', 'N/A'] }
        }
      }
    ]);

    res.json(wards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET latest wardId
router.get('/latest', async (req, res) => {
  try {
    const allWards = await Ward.find();
    if (allWards.length === 0) return res.json({ wardId: 'WARD0001' });

    const maxWardNumber = Math.max(
      ...allWards.map(w => parseInt(String(w.wardId).replace('WARD', ''), 10))
    );

    const nextWardId = `WARD${(maxWardNumber + 1).toString().padStart(4, '0')}`;
    res.json({ wardId: nextWardId });
  } catch (err) {
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
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.json({ message: 'Ward deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT /api/wards/:id — map departmentId -> departmentCode (IMPORTANT)
router.put('/:id', async (req, res) => {
  try {
    const { wardId, name, type, status, departmentId } = req.body;

    const update = { wardId, name, type, status };

    if (departmentId) {
      const department = await DepartmentMaster.findById(departmentId);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
      update.departmentCode = department.deptCode;
    }

    const updatedWard = await Ward.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!updatedWard) return res.status(404).json({ message: 'Ward not found' });
    res.json(updatedWard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST new ward (store deptCode instead of _id)
router.post('/', async (req, res) => {
  try {
    const { wardId, name, departmentId, type, status } = req.body;

    const department = await DepartmentMaster.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const newWard = new Ward({
      wardId,
      name,
      departmentCode: department.deptCode, // store deptCode
      type,
      status
    });

    await newWard.save();
    res.status(201).json(newWard);
  } catch (err) {
    res.status(500).json({ message: 'Error saving ward' });
  }
});

module.exports = router;

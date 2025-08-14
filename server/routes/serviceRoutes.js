// routes/serviceRoutes.js
const express = require('express');
const ServiceMaster = require('../models/service');
const DepartmentMaster = require('../models/Department');
const router = express.Router();
const {
  createService,
  getAllServices,
  getLatestServiceId
} = require('../controllers/serviceController');

// GET all services with department name
router.get('/', async (req, res) => {
  try {
    const services = await ServiceMaster.aggregate([
      {
        $lookup: {
          from: 'departmentmasters',      // collection name in MongoDB
          localField: 'departmentCode',   // code stored in ServiceMaster
          foreignField: 'deptCode',       // code in DepartmentMaster
          as: 'department'
        }
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          serviceId: 1,
          serviceName: 1,
          serviceCategory: 1,
          departmentCode: 1,
          departmentName: { $ifNull: ['$department.deptName', 'N/A'] },
          description: 1,
          status: 1
        }
      }
    ]);

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching services', error: err.message });
  }
});
router.get('/latest', getLatestServiceId);

// CREATE
router.post('/', async (req, res) => {
  try {
    const { serviceId, serviceName, serviceCategory, departmentId, description, status } = req.body;

    // Find deptCode from departmentId
    const dept = await DepartmentMaster.findById(departmentId);
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    const newService = new ServiceMaster({
      serviceId,
      serviceName,
      serviceCategory,
      departmentCode: dept.deptCode, // store code
      description,
      status
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving service', error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { serviceId, serviceName, serviceCategory, departmentId, description, status } = req.body;

    const update = { serviceId, serviceName, serviceCategory, description, status };

    if (departmentId) {
      const dept = await DepartmentMaster.findById(departmentId);
      if (!dept) return res.status(404).json({ message: 'Department not found' });
      update.departmentCode = dept.deptCode; // store code
    }

    const updated = await ServiceMaster.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating service', error: err.message });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    const service = await ServiceMaster.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Delete service error:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

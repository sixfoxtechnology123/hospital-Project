// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { createDoctor, getDoctors } = require('../controllers/doctorController');

router.post('/', createDoctor);
router.get('/', getDoctors);

router.put('/:id', async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        doctorCode: req.body.doctorCode,
        doctorName: req.body.doctorName,
        qualification: req.body.qualification,
        registrationNo: req.body.registrationNo,
        departmentCode: req.body.departmentCode,   // keep deptCode string
      },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(updatedDoctor);
  } catch (err) {
    console.error('Update doctor error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error('Delete doctor error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

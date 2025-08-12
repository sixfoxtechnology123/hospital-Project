const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');  // <-- Import your Doctor model here
const { createDoctor, getDoctors } = require('../controllers/doctorController');

router.post('/', createDoctor);
router.get('/', getDoctors);

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

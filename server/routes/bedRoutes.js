const express = require('express');
const router = express.Router();
const Bed = require('../models/Bed');

const {
  getNextBedNumber,
  createBed,
  getBeds
} = require('../controllers/bedController');

// Get all beds
router.get('/', getBeds);

// Get next bed number for ward
router.get('/next/:wardName', getNextBedNumber);

// Create new bed
router.post('/', createBed);

router.delete('/:id', async (req, res) => {
  try {
    await Bed.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bed deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bed' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
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

module.exports = router;
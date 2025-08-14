// routes/serviceRateRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllRates,
  getLatestRateId,
  createRate,
  updateRate,
  deleteRate,
} = require('../controllers/serviceRateController');

router.get('/', getAllRates);
router.get('/latest', getLatestRateId);
router.post('/', createRate);
router.put('/:id', updateRate);
router.delete('/:id', deleteRate);

module.exports = router;

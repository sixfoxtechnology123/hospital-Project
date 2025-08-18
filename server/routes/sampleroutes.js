// routes/sampleRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllSamples,
  getLatestSampleId,
  createSample,
  updateSample,
  deleteSample,
} = require('../controllers/samplecontroller');

router.get('/', getAllSamples);
router.get('/latest', getLatestSampleId);
router.post('/', createSample);
router.put('/:id', updateSample);
router.delete('/:id', deleteSample);

module.exports = router;

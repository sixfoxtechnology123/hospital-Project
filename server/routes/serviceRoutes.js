// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getLatestServiceId
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.post('/', createService);
router.get('/latest', getLatestServiceId);

module.exports = router;

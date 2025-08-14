// routes/vendorRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  getLatestVendorId
} = require('../controllers/vendorController');

router.get('/', getAllVendors);
router.get('/latest', getLatestVendorId);
router.post('/', createVendor);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;

// routes/serviceRoutes.js
const express = require('express');
const ServiceMaster = require('../models/service');

const router = express.Router();
const {
  createService,
  getAllServices,
  getLatestServiceId
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.post('/', createService);
router.get('/latest', getLatestServiceId);
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

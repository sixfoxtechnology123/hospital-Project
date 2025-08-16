// routes/specialtyRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllSpecialties,
  getLatestSpecialtyId,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
} = require('../controllers/specialtyController');

router.get('/', getAllSpecialties);
router.get('/latest', getLatestSpecialtyId);
router.post('/', createSpecialty);
router.put('/:id', updateSpecialty);
router.delete('/:id', deleteSpecialty);

module.exports = router;

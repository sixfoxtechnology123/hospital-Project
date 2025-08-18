const express = require('express');
const router = express.Router();
const {
  getAllInvestigations,
  createInvestigation,
  updateInvestigation,
  deleteInvestigation,
  getLatestTestId
} = require('../controllers/investigationController');

router.get('/', getAllInvestigations);
router.get('/latest', getLatestTestId);
router.post('/', createInvestigation);
router.put('/:id', updateInvestigation);
router.delete('/:id', deleteInvestigation);

module.exports = router;

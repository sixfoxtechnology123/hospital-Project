const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getAllDepartments,
  getNextDeptCode,
} = require('../controllers/departmentController');

router.get('/next-code', getNextDeptCode); // For auto-generating
router.post('/', createDepartment);        // To save new department
router.get('/', getAllDepartments);        // To view all

module.exports = router;

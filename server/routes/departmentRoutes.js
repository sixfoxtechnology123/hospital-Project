const express = require('express');
const router = express.Router();
const Department = require('../models/Department');  // <-- Add this!

const {
  createDepartment,
  getAllDepartments,
  getNextDeptCode,
} = require('../controllers/departmentController');

router.get('/next-code', getNextDeptCode); // For auto-generating
router.post('/', createDepartment);        // To save new department
router.get('/', getAllDepartments);        // To view all

router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Delete department error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

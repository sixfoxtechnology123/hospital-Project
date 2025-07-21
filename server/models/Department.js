const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  deptCode: { type: String, required: true },
  deptName: { type: String, required: true }
});

module.exports = mongoose.model('DepartmentMaster', departmentSchema);

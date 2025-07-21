const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  deptCode: { type: String, required: true, unique: true },
  deptName: { type: String, required: true, unique:true }
});


module.exports = mongoose.model('DepartmentMaster', departmentSchema);

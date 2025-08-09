const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentMaster', required: true },
  // departmentCode: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'Active' }
});

module.exports = mongoose.model('WardMaster', wardSchema);

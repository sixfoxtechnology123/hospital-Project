const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  departmentCode: { type: String, required: true }, // store deptCode, not ObjectId
  type: { type: String, required: true },
  status: { type: String, default: 'Active' }
});

module.exports = mongoose.model('WardMaster', wardSchema);

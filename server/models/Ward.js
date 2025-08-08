const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  departmentId: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'Active' }
}, { timestamps: false });

module.exports = mongoose.model('Wardmaster', wardSchema);

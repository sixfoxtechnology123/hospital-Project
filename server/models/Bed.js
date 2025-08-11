const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  ward_name: { type: String, required: true },
  bed_number: { type: String, required: true, unique: true },
  bed_type: { type: String, required: true },
  status: { type: String, default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Bedmaster', bedSchema);

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  }
}, { timestamps: false });

module.exports = mongoose.model('ServiceMaster', serviceSchema);

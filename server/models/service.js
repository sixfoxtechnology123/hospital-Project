// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    serviceId: { type: String, required: true, unique: true },  // SRV0001
    serviceName: { type: String, required: true },
    serviceCategory: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { 
    timestamps: false,
    collection: 'servicemaster' 
  }
);

module.exports = mongoose.model('ServiceMaster', serviceSchema);

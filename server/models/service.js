// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    serviceId: { type: String, required: true, unique: true },  // SRV0001
    serviceName: { type: String, required: true },
    serviceCategory: { type: String, required: true },
    departmentCode: { type: String, required: true }, // store code, not ObjectId
    description: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { 
    timestamps: false,
    collection: 'servicemaster' 
  }
);

module.exports = mongoose.model('ServiceMaster', serviceSchema);

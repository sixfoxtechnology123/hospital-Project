// models/ServiceRate.js
const mongoose = require('mongoose');

const serviceRateSchema = new mongoose.Schema(
  {
    rateId: { type: String, required: true, unique: true }, // SERVRATE0001
    serviceId: { type: String, required: true },            // links to ServiceMaster.serviceId (string)
    rateType: { type: String, enum: ['General', 'Insurance', 'Corporate', 'Package'], required: true },
    rateAmount: { type: Number, required: true },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date }, // optional
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    doctorShare: { type: Number, default: null },
    hospitalShare: { type: Number, default: null },
  },
  {
    timestamps: false,
    collection: 'service_rate_master',
  }
);

module.exports = mongoose.model('ServiceRate', serviceRateSchema);

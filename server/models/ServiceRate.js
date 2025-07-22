const mongoose = require('mongoose');

const ServiceRateSchema = new mongoose.Schema({
  serviceCode: { type: String, required: true },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date, required: true },
  serviceRate: { type: Number, required: true },         
  doctorShare: { type: Number, required: true },         
  hospitalShare: { type: Number, required: true },       
  active: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
});

module.exports = mongoose.model('ServiceRateMaster', ServiceRateSchema);

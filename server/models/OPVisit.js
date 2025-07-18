const mongoose = require('mongoose');

const opVisitSchema = new mongoose.Schema({
  mrNumber: { type: String, required: true },
  department: { type: String, required: true },
  consultant: { type: String, required: true },
  sConsultant: { type: String },
  plan: { type: String, required: true },
  package: { type: String },
  referredBy: { type: String },
  pdx: { type: String },
  referralAgent: { type: String },
  billingStatus: { type: String, default: 'Open' },
  validTill: { type: Date, default: () => new Date(new Date().setFullYear(new Date().getFullYear() + 1)) },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OPVisit', opVisitSchema);

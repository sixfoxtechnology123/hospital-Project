const mongoose = require('mongoose');

const investigationSchema = new mongoose.Schema(
  {
    testId: { type: String, required: true, unique: true },  // INVT0001
    name: { type: String, required: true },
    departmentCode: { type: String, required: true },
    sampleType: { type: String, required: true },
    rate: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Discontinued'], default: 'Active' },
  },
  {
    timestamps: false,
    collection: 'investigation_tests'
  }
);

module.exports = mongoose.model('InvestigationTest', investigationSchema);

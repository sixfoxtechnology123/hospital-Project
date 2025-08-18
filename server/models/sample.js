// models/Sample.js
const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema(
  {
    sampleId: { type: String, required: true, unique: true }, // SAMPLE0001
    sampleName: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: false,
    collection: 'samplemaster',
  }
);

module.exports = mongoose.model('SampleMaster', sampleSchema);

// models/Specialty.js
const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema(
  {
    specialtyId: { type: String, required: true, unique: true }, // SP001
    name: { type: String, required: true }, // Cardiology, Neurology, etc.
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentMaster', required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: false,
    collection: 'specialtiesmaster'
  }
);

module.exports = mongoose.model('SpecialtyMaster', specialtySchema);

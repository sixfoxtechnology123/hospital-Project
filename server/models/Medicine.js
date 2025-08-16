const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    medicineId: { type: String, required: true, unique: true }, // MED0001
    name: { type: String, required: true },                     // brand/trade name
    genericName: { type: String, required: true },              // generic/ingredient
    unit: { type: String, required: true },                     // e.g. Tablet, Strip
    stock: { type: Number},                // available qty
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Discontinued', 'Out of Stock'],
      default: 'Active'
    }
  },
  {
    timestamps: false,
    collection: 'medicinemaster'
  }
);

module.exports = mongoose.model('Medicine', medicineSchema);

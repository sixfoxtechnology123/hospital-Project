// models/Vendor.js
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, unique: true }, // VEND0001
    vendorName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    gstNo: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  {
    timestamps: false,
    collection: 'vendormaster'
  }
);

module.exports = mongoose.model('VendorMaster', vendorSchema);

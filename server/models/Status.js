// models/Status.js
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema(
  {
    statusId: { type: String, required: true, unique: true },  // STATUS0001
    statusName: { type: String, required: true },              // Active, Inactive, etc
    description: { type: String }                              // Free text usage
  },
  {
    timestamps: false,
    collection: 'statusmaster'
  }
);

module.exports = mongoose.model('Status', statusSchema);

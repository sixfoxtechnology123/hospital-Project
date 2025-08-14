// models/InventoryItem.js
const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true },   // INVEN0001
    itemName: { type: String, required: true },
    itemCategory: {
      type: String,
      enum: ['Medical', 'Surgical', 'Pharmacy', 'Housekeeping'],
      required: true
    },
    unit: { type: String, required: true },        // e.g., box/strip/bottle
    unitPieces: { type: Number, default: 1, min: 1 }, // ✅ new numeric field
    reorderLevel: { type: Number, required: true, min: 0 },
    vendorId: { type: String, default: '' },       // optional FK (by vendorId string VEND0001)
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: false,
    collection: 'inventoryitemmaster'
  }
);

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);

// models/Charge.js
const mongoose = require("mongoose");

const chargeSchema = new mongoose.Schema(
  {
    chargeId: { type: String, required: true, unique: true }, // CHARG0001
    item_type: { type: String, required: true }, // Department, Doctor, etc
    item_id: { type: String, required: true },   // reference id from master
    description: { type: String, default: "" },
    rate: { type: Number, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { collection: "chargesmaster" }
);

module.exports = mongoose.model("ChargesMaster", chargeSchema);

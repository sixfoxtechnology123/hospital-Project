// models/InsuranceProvider.js
const mongoose = require("mongoose");

const insuranceProviderSchema = new mongoose.Schema(
  {
    providerId: { type: String, required: true, unique: true }, // INSPROV0001
    name: { type: String, required: true },
    contact_person: { type: String, required: true },
    contact_number: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive", "Blacklisted"], default: "Active" },
  },
  {
    collection: "insuranceproviders",
  }
);

module.exports = mongoose.model("InsuranceProvider", insuranceProviderSchema);

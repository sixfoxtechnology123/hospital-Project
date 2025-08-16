const mongoose = require("mongoose");

const genericMedicineSchema = new mongoose.Schema(
  {
    genericId: { type: String, required: true, unique: true }, // GENMED0001
    genericName: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  {
    timestamps: false,
    collection: "generic_medicines",
  }
);

module.exports = mongoose.model("Generic_Medicine", genericMedicineSchema);

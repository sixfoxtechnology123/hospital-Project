const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    unitId: { type: String, required: true, unique: true }, // UNIT0001
    unitName: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  {
    timestamps: false,
    collection: "unitMaster",
  }
);

module.exports = mongoose.model("UnitMaster", unitSchema);

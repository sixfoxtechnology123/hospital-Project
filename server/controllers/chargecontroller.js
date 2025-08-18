const mongoose = require("mongoose");
const Charge = require("../models/charge");

// Prefix for IDs
const PREFIX = "CHARG";
const PAD = 4;

// Generate next chargeId
async function generateNextChargeId() {
  const last = await Charge.findOne().sort({ chargeId:  - 1 }).lean();
  if (!last || !last.chargeId) return `${PREFIX}${String(1).padStart(PAD, "0")}`;
  const lastNum = parseInt(last.chargeId.replace(PREFIX, ""), 10) || 0;
  return `${PREFIX}${String(lastNum + 1).padStart(PAD, "0")}`;
}

//  GET latest ID
exports.getLatestChargeId = async (_req, res) => {
  try {
    const nextId = await generateNextChargeId();
    res.json({ chargeId: nextId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET all charges
exports.getAllCharges = async (_req, res) => {
  try {
    const charges = await Charge.find().lean();
    res.json(
      charges.map((c) => ({
        ...c,
        itemDisplay: `${c.item_id}`, 
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET items for dropdown (Department, Doctor, etc.)
exports.getItemsByType = async (req, res) => {
  try {
    const { type } = req.params;

    let collectionName;
    let mappingFn;

    switch (type) {
      case "Department":
        collectionName = "departmentmasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.deptCode} - ${i.deptName}`,
        });
        break;

      case "Doctor":
        collectionName = "doctormasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.doctorCode} - ${i.doctorName}`,
        });
        break;

      case "Service":
        collectionName = "servicemaster";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.serviceId} - ${i.serviceName}`,
        });
        break;

      case "Ward":
        collectionName = "wardmasters";
        mappingFn = (i) => ({
          _id: i._id,
            displayName: `${i.wardId} - ${i.name}`,
        });
        break;

      case "Bed":
        collectionName = "bedmasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.bed_number}`,
        });
        break;

      case "Unit":
        collectionName = "unitMaster";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.unitId} - ${i.unitName}`,
        });
        break;

      case "Vendor":
        collectionName = "vendormaster";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.vendorId} - ${i.vendorName}`,
        });
        break;

      case "InventoryItem":
        collectionName = "inventoryitemmaster";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.itemId} - ${i.itemName}`,
        });
        break;

      case "Speciality":
        collectionName = "specialitymasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.specialityId} - ${i.specialityName}`,
        });
        break;

      case "Medicine":
        collectionName = "medicinemasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.medicineId} - ${i.medicineName}`,
        });
        break;

      case "GenericMedicine":
        collectionName = "genericmedicinemasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.genericId} - ${i.genericName}`,
        });
        break;

      case "Status":
        collectionName = "statusmasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.statusId} - ${i.statusName}`,
        });
        break;

      case "SampleTest":
        collectionName = "sampletestmasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.sampleId} - ${i.sampleName}`,
        });
        break;

      case "InvestigationTest":
        collectionName = "investigationmasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.testId} - ${i.name}`,
        });
        break;

      case "InsuranceProvider":
        collectionName = "insuranceprovidermasters";
        mappingFn = (i) => ({
          _id: i._id,
          displayName: `${i.providerId} - ${i.providerName}`,
        });
        break;

      default:
        return res.json([]); // empty for unknown types
    }

    const items = await mongoose.connection.collection(collectionName).find({}).toArray();
    const mapped = items.map(mappingFn);

    return res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//  CREATE
exports.createCharge = async (req, res) => {
  try {
    const { item_type, item_id, description, rate, status } = req.body;
    const chargeId = await generateNextChargeId();
    const doc = new Charge({ chargeId, item_type, item_id, description, rate, status });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  UPDATE
exports.updateCharge = async (req, res) => {
  try {
    const updated = await Charge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Charge not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteCharge = async (req, res) => {
  try {
    const deleted = await Charge.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Charge not found" });
    res.json({ message: "Charge deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

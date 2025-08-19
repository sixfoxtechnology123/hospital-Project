const mongoose = require("mongoose");
const Charge = require("../models/charge");

// Prefix for IDs
const PREFIX = "CHARG";
const PAD = 4;

// Generate next chargeId
async function generateNextChargeId() {
  const last = await Charge.findOne().sort({ chargeId: -1 }).lean();
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
    res.json(charges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET items for dropdown
exports.getItemsByType = async (req, res) => {
  try {
    const { type } = req.params;

    let collectionName;
    let mappingFn;

    switch (type) {
      case "Department":
        collectionName = "departmentmasters";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.deptCode} - ${i.deptName}` });
        break;
      case "Doctor":
        collectionName = "doctormasters";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.doctorCode} - ${i.doctorName}` });
        break;
      case "Service":
        collectionName = "servicemaster";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.serviceId} - ${i.serviceName}` });
        break;
      case "ServiceRate":
        collectionName = "service_rate_master";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.rateId} - ${i.rateType}` });
        break;
      case "Ward":
        collectionName = "wardmasters";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.wardId} - ${i.name}` });
        break;
      case "Bed":
        collectionName = "bedmasters";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.bed_number}` });
        break;
      case "Unit":
        collectionName = "unitMaster";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.unitId} - ${i.unitName}` });
        break;
      case "Vendor":
        collectionName = "vendormaster";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.vendorId} - ${i.vendorName}` });
        break;
      case "InventoryItem":
        collectionName = "inventoryitemmaster";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.itemId} - ${i.itemName}` });
        break;
      case "Speciality":
        collectionName = "specialtiesmaster";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.specialtyId} - ${i.name}` });
        break;
      case "Medicine":
        collectionName = "medicinemaster";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.medicineId} - ${i.name}` });
        break;
      case "GenericMedicine":
        collectionName = "generic_medicines";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.genericId} - ${i.genericName}` });
        break;
      case "Status":
        collectionName = "statusmaster";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.statusId} - ${i.statusName}` });
        break;
      case "SampleTest":
        collectionName = "samplemaster";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.sampleId} - ${i.sampleName}` });
        break;
      case "InvestigationTest":
        collectionName = "investigation_tests";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.testId} - ${i.name}` });
        break;
      case "InsuranceProvider":
        collectionName = "insuranceproviders";
        mappingFn = (i) => ({ _id: i._id, displayName: `${i.providerId} - ${i.name}` });
        break;
      default:
        return res.json([]);
    }

    const items = await mongoose.connection.collection(collectionName).find({}).toArray();
    const mapped = items.map(mappingFn);
    return res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  CREATE
// CREATE
exports.createCharge = async (req, res) => {
  try {
    const { item_type, item_id, description, rate, status } = req.body;

    let item_display = req.body.item_display || "";

    // Lookup by _id if item_display not provided
    if (!item_display) {
      const collMap = {
        Department: { collection: "departmentmasters", map: (i) => `${i.deptCode} - ${i.deptName}` },
        Doctor: { collection: "doctormasters", map: (i) => `${i.doctorCode} - ${i.doctorName}` },
        Service: { collection: "servicemaster", map: (i) => `${i.serviceId} - ${i.serviceName}` },
        ServiceRate: { collection: "service_rate_master", map: (i) => `${i.rateId} - ${i.rateType}` },
        Ward: { collection: "wardmasters", map: (i) => `${i.wardId} - ${i.name}` },
        Bed: { collection: "bedmasters", map: (i) => `${i.bed_number}` },
        Unit: { collection: "unitMaster", map: (i) => `${i.unitId} - ${i.unitName}` },
        Vendor: { collection: "vendormaster", map: (i) => `${i.vendorId} - ${i.vendorName}` },
        InventoryItem: { collection: "inventoryitemmaster", map: (i) => `${i.itemId} - ${i.itemName}` },
        Speciality: { collection: "specialtiesmaster", map: (i) => `${i.specialtyId} - ${i.name}` },
        Medicine: { collection: "medicinemaster", map: (i) => `${i.medicineId} - ${i.name}` },
        GenericMedicine: { collection: "generic_medicines", map: (i) => `${i.genericId} - ${i.genericName}` },
        Status: { collection: "statusmaster", map: (i) => `${i.statusId} - ${i.statusName}` },
        SampleTest: { collection: "samplemaster", map: (i) => `${i.sampleId} - ${i.sampleName}` },
        InvestigationTest: { collection: "investigation_tests", map: (i) => `${i.testId} - ${i.name}` },
        InsuranceProvider: { collection: "insuranceproviders", map: (i) => `${i.providerId} - ${i.name}` },
      };

      const config = collMap[item_type];
      if (config) {
        const item = await mongoose.connection
          .collection(config.collection)
          .findOne({ _id: new mongoose.Types.ObjectId(item_id) });

        if (item) {
          item_display = config.map(item);
        }
      }
    }

    const chargeId = await generateNextChargeId();
    const doc = new Charge({
      chargeId,
      item_type,
      item_id,
      item_display,
      description,
      rate,
      status,
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("createCharge error:", err);
    res.status(500).json({ error: err.message });
  }
};


//  UPDATE
exports.updateCharge = async (req, res) => {
  try {
    const { item_type, item_id } = req.body;
    let item_display = req.body.item_display || item_id;

    if (!req.body.item_display) {
      // repeat lookup like in createCharge
    }

    const updated = await Charge.findByIdAndUpdate(
      req.params.id,
      { ...req.body, item_display },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Charge not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateCharge error:", err);
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

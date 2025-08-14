const InventoryItem = require('../models/InventoryItem');

// ID prefix/padding like you did elsewhere
const PREFIX = 'INVEN';
const PAD = 4;

async function generateNextInventoryId() {
  const last = await InventoryItem.findOne().sort({ itemId: -1 }).lean();
  if (!last || !last.itemId) return `${PREFIX}${String(1).padStart(PAD, '0')}`;
  const lastNum = parseInt(last.itemId.replace(PREFIX, ''), 10) || 0;
  return `${PREFIX}${String(lastNum + 1).padStart(PAD, '0')}`;
}

exports.getLatestInventoryId = async (_req, res) => {
  try {
    const itemId = await generateNextInventoryId();
    res.json({ itemId });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get next inventory id' });
  }
};

exports.getAllItems = async (_req, res) => {
  try {
    // Optional join to VendorMaster by vendorId string (if collection exists)
    const items = await InventoryItem.aggregate([
      {
        $lookup: {
          from: 'vendormaster',   // make sure your Vendor model uses this collection name
          localField: 'vendorId',
          foreignField: 'vendorId',
          as: 'vendor'
        }
      },
      { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          itemId: 1,
          itemName: 1,
          itemCategory: 1,
          unit: 1,
          unitPieces: 1,
          reorderLevel: 1,
          vendorId: 1,
          vendorName: { $ifNull: ['$vendor.vendorName', ''] },
          status: 1
        }
      },
      { $sort: { itemId: 1 } }
    ]);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch items' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      itemName, itemCategory, unit, unitPieces = 1,
      reorderLevel, vendorId = '', status = 'Active'
    } = req.body;

    if (!itemName || !itemCategory || !unit || reorderLevel === undefined) {
      return res.status(400).json({ error: 'itemName, itemCategory, unit, reorderLevel are required' });
    }

    const itemId = await generateNextInventoryId();

    const doc = new InventoryItem({
      itemId, itemName, itemCategory, unit,
      unitPieces: Number(unitPieces) || 1,
      reorderLevel: Number(reorderLevel) || 0,
      vendorId, status
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    if (payload.itemId) delete payload.itemId; // don't allow changing the code
    if (payload.unitPieces !== undefined) payload.unitPieces = Number(payload.unitPieces) || 1;
    if (payload.reorderLevel !== undefined) payload.reorderLevel = Number(payload.reorderLevel) || 0;

    const updated = await InventoryItem.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const removed = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete item' });
  }
};

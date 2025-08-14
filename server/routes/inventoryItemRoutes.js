// routes/inventoryItemRoutes.js
const express = require('express');
const router = express.Router();
const {
  getLatestInventoryId,
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/inventoryItemController');

router.get('/latest', getLatestInventoryId);
router.get('/', getAllItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;

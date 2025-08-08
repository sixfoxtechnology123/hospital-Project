const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');

router.get('/latest', async (req, res) => {
  try {
    const allWards = await Ward.find();

    if (allWards.length === 0) {
      return res.json({ wardId: 'WARD0001' });
    }

    const maxWardNumber = Math.max(
      ...allWards.map(w => parseInt(w.wardId.replace('WARD', '')))
    );

    const nextWardId = `WARD${(maxWardNumber + 1).toString().padStart(4, '0')}`;

    res.json({ wardId: nextWardId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating next ward ID' });
  }
});

// ✅ CHECK if ward exists (optional, for duplicate warning)
router.get('/check/:wardId', async (req, res) => {
  try {
    const ward = await Ward.findOne({ wardId: req.params.wardId });
    res.json({ exists: !!ward });
  } catch (err) {
    res.status(500).json({ message: 'Error checking ward ID' });
  }
});

// ✅ POST new ward
router.post('/', async (req, res) => {
  try {
    const newWard = new Ward(req.body);
    await newWard.save();
    res.status(201).json(newWard);
  } catch (err) {
    res.status(500).json({ message: 'Error saving ward' });
  }
});

module.exports = router;

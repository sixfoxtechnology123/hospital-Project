const express = require('express');
const router = express.Router();
const OPVisit = require('../models/OPVisit');

router.post('/register-op', async (req, res) => {
  try {
    const newOPVisit = new OPVisit(req.body);
    await newOPVisit.save();
    res.status(201).json({ message: 'OP Registration Successful', opVisit: newOPVisit });
  } catch (err) {
    res.status(500).json({ message: 'OP Registration Failed', error: err.message });
  }
});

module.exports = router;

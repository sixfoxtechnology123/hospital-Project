const OpVisit = require('../models/OPVisit');

exports.registerOpVisit = async (req, res) => {
  try {
    const opVisit = new OpVisit(req.body);
    await opVisit.save();
    res.status(201).json({ message: 'OP Visit registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
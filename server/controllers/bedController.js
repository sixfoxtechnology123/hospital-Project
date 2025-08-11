const Bed = require('../models/Bed');

// GET /api/beds/next/:wardName
const getNextBedNumber = async (req, res) => {
  try {
    const wardName = (req.params.wardName || '').trim();
    if (!wardName) return res.status(400).json({ message: 'Ward name required' });

    const abbr = wardName.charAt(0).toUpperCase() + 'W'; // e.g. OW, GW

    // Find all beds for this ward that start with the prefix, then get the max numeric suffix
    const beds = await Bed.find({
      ward_name: wardName,
      bed_number: { $regex: `^${abbr}` }
    }).select('bed_number');

    let max = 0;
    beds.forEach(b => {
      const numPart = b.bed_number.slice(abbr.length);
      const n = parseInt(numPart, 10);
      if (!isNaN(n) && n > max) max = n;
    });

    const nextNum = String(max + 1).padStart(2, '0');
    return res.json({ nextBedNumber: `${abbr}${nextNum}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error generating bed number', error: err.message });
  }
};

// POST /api/beds
const createBed = async (req, res) => {
  try {
    const { ward_name, bed_number: clientBedNumber, bed_type, status } = req.body;
    if (!ward_name || !bed_type) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // If client didn't send bed_number (or sent empty), generate again server-side
    let bed_number = clientBedNumber;
    if (!bed_number) {
      const abbr = ward_name.charAt(0).toUpperCase() + 'W';
      const beds = await Bed.find({
        ward_name,
        bed_number: { $regex: `^${abbr}` }
      }).select('bed_number');

      let max = 0;
      beds.forEach(b => {
        const numPart = b.bed_number.slice(abbr.length);
        const n = parseInt(numPart, 10);
        if (!isNaN(n) && n > max) max = n;
      });

      bed_number = `${abbr}${String(max + 1).padStart(2, '0')}`;
    }

    const bed = new Bed({ ward_name, bed_number, bed_type, status: status || 'Available' });
    await bed.save();
    return res.status(201).json({ message: 'Bed created successfully', bed });
  } catch (err) {
    // unique index violation
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Bed number already exists. Retry.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Error creating bed', error: err.message });
  }
};

// GET /api/beds
const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find().sort({ createdAt: -1 });
    res.json(beds);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching beds', error: err.message });
  }
};

module.exports = {
  getNextBedNumber,
  createBed,
  getBeds
};

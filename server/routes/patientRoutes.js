const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Helper to generate MR Number
const generateMRNumber = async () => {
  const today = new Date();
  const yyyyMMdd = today.toISOString().split('T')[0].replace(/-/g, '');

  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  let count = await Patient.countDocuments({
    registrationDate: { $gte: startOfDay, $lte: endOfDay }
  });

  let mrNumber;
  let isDuplicate = true;

  while (isDuplicate) {
    count++;
    const serial = count.toString().padStart(4, '0');
    mrNumber = `MR${yyyyMMdd}${serial}`;

    const existing = await Patient.findOne({ mrNumber });
    if (!existing) isDuplicate = false;
  }

  return mrNumber;
};


router.post('/register', async (req, res) => {
  try {
    const mrNumber = await generateMRNumber();

    // DOB-Age sync
    const formData = { ...req.body, mrNumber };

    const today = new Date();
    if (formData.dob && !formData.age) {
      const dob = new Date(formData.dob);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      formData.age = age.toString();
    }

    if (formData.age && !formData.dob) {
      const ageInt = parseInt(formData.age);
      const approxDOB = new Date(today.getFullYear() - ageInt, today.getMonth(), today.getDate());
      formData.dob = approxDOB.toISOString().split("T")[0];
    }

    const patient = new Patient(formData);
    await patient.save();

    res.json({ message: "Patient Registered", mrNumber });
  } catch (err) {
    console.error("Error Registering Patient:", err);
    res.status(500).json({ message: "Registration Failed" });
  }
});

module.exports = router;

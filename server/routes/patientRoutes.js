const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Helper to generate unique MR Number
const generateMRNumber = async () => {
  const today = new Date();
  const yyyyMMdd = today.toISOString().split('T')[0].replace(/-/g, '');

  // Find the last MR Number for today
  const lastPatient = await Patient.findOne({ mrNumber: { $regex: `^MR${yyyyMMdd}` } })
    .sort({ mrNumber: -1 });

  let serial = 1;
  if (lastPatient && lastPatient.mrNumber) {
    serial = parseInt(lastPatient.mrNumber.slice(-4)) + 1; // last 4 digits + 1
  }

  const mrNumber = `MR${yyyyMMdd}${serial.toString().padStart(4, '0')}`;
  return mrNumber;
};

// Register patient
router.post('/register', async (req, res) => {
  try {
    const mrNumber = await generateMRNumber();
    const today = new Date();

    const formData = { ...req.body, mrNumber };

    // DOB -> Age
    if (formData.dob && !formData.age) {
      const dob = new Date(formData.dob);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      formData.age = age.toString();
    }

    // Age -> DOB
    if (formData.age && !formData.dob) {
      const ageInt = parseInt(formData.age);
      const approxDOB = new Date(today.getFullYear() - ageInt, today.getMonth(), today.getDate());
      formData.dob = approxDOB.toISOString().split("T")[0];
    }

    const patient = new Patient(formData);
    await patient.save();
    res.json({ message: "Patient Registered", mrNumber, patientId: patient._id });
 
  } catch (err) {
    console.error("Error Registering Patient:", err);
    res.status(500).json({ message: "Registration Failed" });
  }
});
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});
// GET single patient by ID
router.get("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//  Delete patient
router.delete('/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted" });
  } catch (err) {
    console.error("Error deleting patient:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Patient = require('./PatientsData');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


// Admin Login

app.post('/api/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'sixfox' && password === 'sixfox123') {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Generate Auto IDs

app.get('/api/generate-ids', async (req, res) => {
  try {
    const today = new Date();
    const yymmdd = today.toISOString().slice(2, 10).replace(/-/g, '');
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const countToday = await Patient.countDocuments({ date: dateStr });
    const paddedCount = String(countToday).padStart(3, '0');   // 000, 001, ...
    const paddedReg = String(countToday + 1).padStart(4, '0'); // 0001, 0002, ...

    const reportNo = `LRN${yymmdd}${paddedCount}`;
    const bookingNo = `L${yymmdd}${paddedCount}`;
    const registrationNo = `IP${yymmdd}${paddedReg}`;

    res.json({ reportNo, bookingNo, registrationNo });
  } catch (err) {
    console.error('ID generation failed:', err);
    res.status(500).json({ message: 'Failed to generate IDs' });
  }
});

// Register Patient

app.post('/api/register', async (req, res) => {
  try {
    const data = req.body;

    // Attach today's date as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    data.date = today;

    const newPatient = new Patient(data);
    await newPatient.save();

    res.json({ success: true, message: 'Patient registered successfully' });
  } catch (err) {
    console.error('Error saving patient:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});


// Get All Patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patients' });
  }
});


// Get One Patient by ID 

app.get('/api/patient/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient' });
  }
});


// Delete Patient

app.delete('/api/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});


// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

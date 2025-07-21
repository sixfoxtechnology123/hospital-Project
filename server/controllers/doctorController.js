const Doctor = require('../models/Doctor');

exports.createDoctor = async (req, res) => {
  try {
    const { doctorId, doctorName, degree, departmentId } = req.body;
    const doctor = new Doctor({ doctorId, doctorName, degree, departmentId });
    await doctor.save();
    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

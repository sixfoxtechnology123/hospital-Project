const Doctor = require('../models/Doctor');

// Utility to generate next Doctor Code
const generateNextDoctorCode = async () => {
  const lastDoctor = await Doctor.findOne().sort({ _id: -1 });
  let next = 1;
  if (lastDoctor && lastDoctor.doctorCode) {
    const match = lastDoctor.doctorCode.match(/DOC(\d+)/);
    if (match) {
      next = parseInt(match[1], 10) + 1;
    }
  }
  return `DOC${String(next).padStart(4, '0')}`;
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, qualification, registrationNo, deptCode } = req.body;

    const doctorCode = await generateNextDoctorCode();

    const doctor = new Doctor({
      doctorCode,
      doctorName: name,
      qualification,
      departmentCode: deptCode, // Save code not name
      registrationNo
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ _id: 1 });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

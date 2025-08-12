const Doctor = require('../models/Doctor');

// Utility to generate next Doctor Code
const generateNextDoctorCode = async () => {
  try {
    const lastDoctor = await Doctor.findOne().sort({ _id: -1 });
    let next = 1;
    if (lastDoctor && lastDoctor.doctorCode) {
      const match = lastDoctor.doctorCode.match(/DOC(\d+)/);
      if (match) {
        next = parseInt(match[1], 10) + 1;
      }
    }
    return `DOC${String(next).padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating doctor code:', error);
    return 'DOC0001'; // fallback code
  }
};

exports.createDoctor = async (req, res) => {
  try {
    console.log('Create Doctor request body:', req.body);

    const { doctorCode, doctorName, qualification, registrationNo, departmentCode } = req.body;

    if (!doctorName || !registrationNo || !departmentCode) {
      return res.status(400).json({ error: 'DoctorName, RegistrationNo and DepartmentCode are required' });
    }

    const codeToUse = doctorCode || await generateNextDoctorCode();

    const doctor = new Doctor({
      doctorCode: codeToUse,
      doctorName,
      qualification,
      departmentCode,
      registrationNo,
    });

    await doctor.save();

    console.log('Doctor saved:', doctor);

    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    console.error('Create doctor error:', error);
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

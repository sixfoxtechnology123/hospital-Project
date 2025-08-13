// controllers/doctorController.js
const Doctor = require('../models/Doctor');

// Utility to generate next Doctor Code
const generateNextDoctorCode = async () => {
  try {
    const lastDoctor = await Doctor.findOne().sort({ _id: -1 });
    let next = 1;
    if (lastDoctor && lastDoctor.doctorCode) {
      const match = lastDoctor.doctorCode.match(/DOC(\d+)/);
      if (match) next = parseInt(match[1], 10) + 1;
    }
    return `DOC${String(next).padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating doctor code:', error);
    return 'DOC0001';
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { doctorCode, doctorName, qualification, registrationNo, departmentCode } = req.body;

    if (!doctorName || !registrationNo || !departmentCode) {
      return res.status(400).json({ error: 'DoctorName, RegistrationNo and DepartmentCode are required' });
    }

    const codeToUse = doctorCode || await generateNextDoctorCode();

    const doctor = new Doctor({
      doctorCode: codeToUse,
      doctorName,
      qualification,
      departmentCode,    // store deptCode string (e.g. "CARD")
      registrationNo,
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Return doctors WITH departmentName by joining Department collection
exports.getDoctors = async (req, res) => {
  try {
    const docs = await Doctor.aggregate([
      {
        $lookup: {
          from: 'departmentmasters',             // collection name created by model('DepartmentMaster', ...)
          localField: 'departmentCode',          // "CARD"
          foreignField: 'deptCode',              // also "CARD"
          as: 'department'
        }
      },
      {
        $unwind: { path: '$department', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          doctorCode: 1,
          doctorName: 1,
          qualification: 1,
          registrationNo: 1,
          departmentCode: 1,
          departmentName: { $ifNull: ['$department.deptName', ''] } // e.g. "Cardiology"
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(docs);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: error.message });
  }
};

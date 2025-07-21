const Department = require('../models/Department');

const generateDeptCode = async () => {
  const lastDept = await Department.findOne().sort({ deptCode: -1 });

  console.log('Last dept:', lastDept);

  let nextNumber = 1;
  if (lastDept && lastDept.deptCode) {
    const match = lastDept.deptCode.match(/DEPT(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  const newCode = `DEPT${String(nextNumber).padStart(4, '0')}`;
  console.log('Generated code:', newCode);
  return newCode;
};


// Generate next department code
exports.getNextDeptCode = async (req, res) => {
  try {
    const code = await generateDeptCode();
    res.json({ deptCode: code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate code' });
  }
};

// Create new department
exports.createDepartment = async (req, res) => {
  try {
    const { deptCode, deptName } = req.body;
    console.log('Saving:', deptCode, deptName);

    const department = new Department({ deptCode, deptName });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    console.error('Save error:', err.message); // Very important!
    res.status(500).json({ error: err.message });
  }
};


// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

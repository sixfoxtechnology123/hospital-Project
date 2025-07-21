const Department = require('../models/Department');

const generateDeptCode = async () => {
  const lastDept = await Department.findOne().sort({ _id: -1 });

  let nextNumber = 1;
  if (lastDept && lastDept.deptCode) {
    const match = lastDept.deptCode.match(/DEPT(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `DEPT${String(nextNumber).padStart(4, '0')}`;
};

exports.getNextDeptCode = async (req, res) => {
  try {
    const code = await generateDeptCode();
    res.json({ deptCode: code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate code' });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { deptCode, deptName } = req.body;
    const department = new Department({ deptCode, deptName });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create department' });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

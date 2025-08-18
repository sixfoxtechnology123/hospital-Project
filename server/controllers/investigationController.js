const mongoose = require('mongoose');
const Investigation = require('../models/investigationModel');
const Department = require('../models/Department');

const PREFIX = 'INVT';
const PAD = 4;

async function generateNextTestId() {
  const last = await Investigation.findOne().sort({ testId: -1 }).lean();
  if (!last || !last.testId) return `${PREFIX}${String(1).padStart(PAD, '0')}`;

  const lastNum = parseInt(last.testId.replace(PREFIX, ''), 10) || 0;
  return `${PREFIX}${String(lastNum + 1).padStart(PAD, '0')}`;
}

exports.getLatestTestId = async (_req, res) => {
  try {
    const nextId = await generateNextTestId();
    res.json({ testId: nextId });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to get next test ID' });
  }
};

exports.getAllInvestigations = async (_req, res) => {
  try {
    const tests = await Investigation.aggregate([
      {
        $lookup: {
          from: 'departmentmasters',
          localField: 'departmentCode',
          foreignField: 'deptCode',
          as: 'department'
        }
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          testId: 1,
          name: 1,
          sampleType: 1,
          rate: 1,
          status: 1,
          departmentCode: 1,
          departmentName: { $ifNull: ['$department.deptName', 'N/A'] },
        }
      }
    ]);
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch tests' });
  }
};

exports.createInvestigation = async (req, res) => {
  try {
    const { name, departmentId, sampleType, rate, status } = req.body;

    if (!name || !departmentId || !sampleType || !rate) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const dept = await Department.findById(departmentId);
    if (!dept) return res.status(404).json({ error: 'Department not found' });

    const testId = await generateNextTestId();

    const newTest = new Investigation({
      testId,
      name,
      departmentCode: dept.deptCode,
      sampleType,
      rate,
      status
    });

    await newTest.save();
    res.status(201).json(newTest);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create investigation test' });
  }
};

exports.updateInvestigation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, departmentId, sampleType, rate, status } = req.body;

    const update = { name, sampleType, rate, status };
    if (departmentId) {
      const dept = await Department.findById(departmentId);
      if (!dept) return res.status(404).json({ error: 'Department not found' });
      update.departmentCode = dept.deptCode;
    }

    const updated = await Investigation.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Investigation not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update investigation test' });
  }
};

exports.deleteInvestigation = async (req, res) => {
  try {
    const test = await Investigation.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json({ message: 'Investigation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete investigation test' });
  }
};

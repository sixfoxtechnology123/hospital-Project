import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';

const DepartmentMaster = () => {
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDeptCode();
    fetchDepartments();
  }, []);

  const fetchDeptCode = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments/next-code');
      setDeptCode(res.data.deptCode); 
    } catch (err) {
      console.error('Failed to fetch department code:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const handleSave = async () => {
    const duplicate = departments.find(
      (dept) => dept.deptName.toLowerCase().trim() === deptName.toLowerCase().trim()
    );

    if (duplicate) {
      alert('Department name already exists!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/departments', {
        deptCode,
        deptName,
      });
      alert('Department saved successfully');
      setDeptName('');
      fetchDeptCode(); // Regenerate code
      fetchDepartments(); // Refresh department list
    } catch (err) {
      console.error('Error saving department:', err); 
      alert('Failed to save department');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Department Master</h2>

        <div className="mb-4">
          <label className="block text-black mb-1">Department Code</label>
          <input
            type="text"
            value={deptCode}
            readOnly
            className="w-full p-1 border rounded cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black mb-1">Department Name</label>
          <input
            type="text"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            className="w-full p-1 border rounded"
            placeholder="Enter Department Name"
          />
        </div>

        <div className="flex justify-between">
          <BackButton />
          <button
            onClick={handleSave}
           className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMaster;

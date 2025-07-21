import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DepartmentMaster = () => {
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');

  // Fetch the next department code on component mount
  useEffect(() => {
    fetchDeptCode();
  }, []);

  const fetchDeptCode = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments/next-code');
      setDeptCode(res.data.deptCode); // must match backend response field
    } catch (err) {
      console.error('Failed to fetch department code:', err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/api/departments', {
        deptCode,
        deptName,
      });
      alert('Department saved successfully');
      setDeptName('');
      fetchDeptCode(); // Regenerate dept code after save
    } catch (err) {
      console.error('Error saving department:', err); 
      alert('Failed to save department');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">Department Master</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Department Code</label>
          <input
            type="text"
            value={deptCode}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Department Name</label>
          <input
            type="text"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter Department Name"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DepartmentMaster;

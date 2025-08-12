import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';

const DepartmentMaster = () => {
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [departments, setDepartments] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();

    if (location.state?.department) {
      // EDIT mode: fill form with department data
      const dept = location.state.department;
      setDeptCode(dept.deptCode);
      setDeptName(dept.deptName);
      setEditId(dept._id);
      setIsEditMode(true);
    } else if (location.state?.fromUpdate) {
      // After update, reset form fully but DON'T generate new code yet
      resetUpdateForm();
    } else {
      // Normal add mode: reset form and generate new dept code
      resetAddForm();
    }
  }, [location.state]);

  const fetchDeptCode = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments/next-code');
      setDeptCode(res.data.deptCode);
    } catch (err) {
      console.error('Failed to fetch department code:', err);
      setDeptCode('');
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

  // Full reset after update (no code generated)
  const resetUpdateForm = () => {
    setDeptCode('');
    setDeptName('');
    setIsEditMode(false);
    setEditId(null);
  };

  // Reset after adding: clear name and generate new dept code
  const resetAddForm = () => {
    setDeptName('');
    setIsEditMode(false);
    setEditId(null);
    fetchDeptCode();
  };

  const handleSaveOrUpdate = async () => {
    if (!deptName.trim()) {
      alert('Department name is required');
      return;
    }

    // Check duplicate ignoring current edited dept
    const duplicate = departments.find(
      (dept) =>
        dept.deptName.toLowerCase().trim() === deptName.toLowerCase().trim() &&
        dept._id !== editId
    );

    if (duplicate) {
      alert('Department name already exists!');
      return;
    }

    try {
      if (isEditMode) {
        // Update existing department
        await axios.put(`http://localhost:5000/api/departments/${editId}`, {
          deptCode,
          deptName,
        });
        alert('Department updated successfully');
        resetUpdateForm();
        fetchDepartments();

        // Navigate with flag so useEffect skips code generation
        navigate('/departmentMaster', { replace: true, state: { fromUpdate: true } });
      } else {
        // Add new department
        await axios.post('http://localhost:5000/api/departments', {
          deptCode,
          deptName,
        });
        alert('Department saved successfully');
        resetAddForm();
        fetchDepartments();

        // Navigate without flag to generate new code
        navigate('/departmentMaster', { replace: true, state: {} });
      }
    } catch (err) {
      console.error('Error saving/updating department:', err);
      alert('Failed to save/update department');
    }
  };

  // Back button handler
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          {isEditMode ? 'Update Department' : 'Department Master'}
        </h2>

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
          <button
          >
           <BackButton/>
          </button>

          <button
            onClick={handleSaveOrUpdate}
            className={`px-4 py-1 rounded text-white ${
              isEditMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isEditMode ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMaster;

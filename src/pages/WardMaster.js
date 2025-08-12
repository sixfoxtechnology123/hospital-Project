import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation } from "react-router-dom";

const WardMaster = () => {
  const [wards, setWards] = useState({
    wardId: '',
    name: '',
    departmentId: '',
    type: '',
    status: 'Active',
  });
  const [departments, setDepartments] = useState([]);
  

  const location = useLocation();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/departments');
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    fetchDepartments();
    const fetchNextWardId = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/wards/latest');
        const nextWardId = response.data?.wardId || 'WARD0001';
        setWards((prev) => ({ ...prev, wardId: nextWardId }));
      } catch (err) {
        console.error('Error getting ward ID:', err);
      }
    };

    // Step 1: Always fetch departments first
    fetchDepartments().then(() => {
      if (location.state?.ward) {
        // Edit mode - set ward data after departments are loaded
        setWards(location.state.ward);
      } else {
        // Add mode
        fetchNextWardId();
      }
    });
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWards({ ...wards, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/wards', wards);
      alert('Ward saved successfully!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving ward');
    }
  };
  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Ward Master</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
        {/* Ward ID (readonly) */}
        <div className="col-span-1">
          <label className="block font-medium">Ward ID</label>
          <input
            type="text"
            name="wardId"
            value={wards.wardId}
            readOnly
            className="w-full border border-gray-300 p-1 rounded bg-gray-100"
          />
        </div>

        {/* Name */}
        <div className="col-span-1">
          <label className="block font-medium">Ward Name</label>
          <input
            type="text"
            name="name"
            value={wards.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-1 rounded"
            required
          />
        </div>

        {/* Department */}
        <div className="col-span-1">
          <label className="block font-medium">Department</label>
        <select
        name="departmentId"
        value={wards.departmentId}
        onChange={handleChange}
        className="w-full border border-gray-300 p-1 rounded"
        required
      >
        <option value="">--Select--</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept._id}>
            {dept.deptName}
          </option>
        ))}
      </select>


        </div>

    {/* Type */}
        <div className="col-span-1">
          <label className="block font-medium">Type</label>
          <select
            name="type"
            value={wards.type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-1 rounded" required>
            <option value="">----Select----</option>
            <option value="General">General</option>
            <option value="Semi-Private">Semi-Private</option>
            <option value="Private">Private</option>
            <option value="Deluxe / VIP">Deluxe / VIP</option>
            <option value="ICU">ICU</option>
            <option value="NICU">NICU</option>
            <option value="PICU">PICU</option>
            <option value="SICU">SICU</option>
            <option value="CCU">CCU</option>
            <option value="Burn Unit">Burn Unit</option>
            <option value="Isolation Ward">Isolation Ward</option>
            <option value="Day Care">Day Care</option>
            <option value="Maternity Ward">Maternity Ward</option>
            <option value="Emergency / Casualty">Emergency / Casualty</option>
          </select>
        </div>
        {/* Status */}
        <div className="col-span-1">
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={wards.status}
            onChange={handleChange}
            className="w-full border border-gray-300 p-1 rounded"
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-between">
            <BackButton/>
            <button
              type="handleSubmit"
              className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700"
            >
              Save
            </button>
          </div>
      </form>
    </div>
  </div>
  );
};

export default WardMaster;

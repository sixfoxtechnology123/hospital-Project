import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from "react-router-dom";

const WardMaster = () => {
  const [wards, setWards] = useState({
    wardId: '',
    name: '',
    departmentId: '',
    type: '',
    status: 'Active',
  });

  const [departments, setDepartments] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomingWard, setIncomingWard] = useState(null); // ward from list (has departmentCode)

  const location = useLocation();
  const navigate = useNavigate();

  // Load departments + decide create vs edit
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

    const fetchNextWardId = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/wards/latest');
        const nextWardId = response.data?.wardId || 'WARD0001';
        setWards((prev) => ({ ...prev, wardId: nextWardId }));
      } catch (err) {
        console.error('Error getting ward ID:', err);
      }
    };

    fetchDepartments();

    if (location.state?.ward) {
      setIncomingWard(location.state.ward);
      setIsEditMode(true);
      // Set the non-department fields immediately
      const w = location.state.ward;
      setWards(prev => ({
        ...prev,
        _id: w._id,
        wardId: w.wardId || '',
        name: w.name || '',
        type: w.type || '',
        status: w.status || 'Active',
      }));
    } else {
      fetchNextWardId();
      setIsEditMode(false);
    }
  }, [location.state]);

  // After departments are loaded, map departmentCode -> departmentId (for dropdown)
  useEffect(() => {
    if (!isEditMode || !incomingWard || departments.length === 0) return;

    // Support both old shape (departmentId) and new shape (departmentCode)
    let deptId = '';
    if (incomingWard.departmentId) {
      deptId =
        typeof incomingWard.departmentId === 'object'
          ? incomingWard.departmentId._id
          : incomingWard.departmentId;
    } else if (incomingWard.departmentCode) {
      const match = departments.find(d => d.deptCode === incomingWard.departmentCode);
      if (match) deptId = match._id;
    }

    setWards(prev => ({ ...prev, departmentId: deptId }));
  }, [isEditMode, incomingWard, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWards({ ...wards, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // PUT accepts departmentId; backend maps to departmentCode
        await axios.put(`http://localhost:5000/api/wards/${wards._id}`, wards);
        alert('Ward updated successfully!');
        navigate('/wardlist', { replace: true });
      } else {
        await axios.post('http://localhost:5000/api/wards', wards);
        alert('Ward saved successfully!');
        const response = await axios.get('http://localhost:5000/api/wards/latest');
        const nextWardId = response.data?.wardId || 'WARD0001';
        setWards({
          wardId: nextWardId,
          name: '',
          departmentId: '',
          type: '',
          status: 'Active',
        });
        navigate('/wardList', { replace: true }); 
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving ward');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Ward" : "Ward"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Ward ID</label>
            <input
              type="text"
              name="wardId"
              value={wards.wardId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
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

          <div>
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

          <div>
            <label className="block font-medium">Type</label>
            <select
              name="type"
              value={wards.type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
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

          <div>
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

          <div className="flex justify-between">
            <BackButton />
            <button
              type="submit"
              className={`px-4 py-1 rounded text-white ${
                isEditMode
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WardMaster;

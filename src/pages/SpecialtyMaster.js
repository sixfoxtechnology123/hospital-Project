import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from "react-router-dom";

const SpecialtyMaster = () => {
  const [specialty, setSpecialty] = useState({
    specialtyId: '',
    name: '',
    departmentId: '',
    status: 'Active',
  });

  const [departments, setDepartments] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomingSpecialty, setIncomingSpecialty] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Load departments + decide create vs edit
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data || []);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    const fetchNextSpecialtyId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/specialties/latest');
        const nextId = res.data?.specialtyId || 'SP001';
        setSpecialty(prev => ({ ...prev, specialtyId: nextId }));
      } catch (err) {
        console.error('Error getting specialty ID:', err);
      }
    };

    fetchDepartments();

    if (location.state?.specialty) {
      const s = location.state.specialty;
      setIncomingSpecialty(s);
      setIsEditMode(true);

      // If departmentId came populated, normalize it to an _id string now
      const depId =
        typeof s.departmentId === 'object'
          ? s.departmentId?._id
          : s.departmentId || '';

      setSpecialty(prev => ({
        ...prev,
        _id: s._id,
        specialtyId: s.specialtyId || '',
        name: s.name || '',
        departmentId: depId, // may still be blank; we will map code/name below
        status: s.status || 'Active',
      }));
    } else {
      fetchNextSpecialtyId();
      setIsEditMode(false);
    }
  }, [location.state]);

  // Map department from whatever we have (id / code / name) → _id for the dropdown
  useEffect(() => {
    if (!isEditMode || !incomingSpecialty || departments.length === 0) return;

    let deptId = '';

    // 1) If departmentId exists (object or string), use it
    if (incomingSpecialty.departmentId) {
      deptId =
        typeof incomingSpecialty.departmentId === 'object'
          ? incomingSpecialty.departmentId._id
          : incomingSpecialty.departmentId;
    }

    // 2) Else if we only have departmentCode in the specialty, map via deptCode
    if (!deptId && incomingSpecialty.departmentCode) {
      const matchByCode = departments.find(d => d.deptCode === incomingSpecialty.departmentCode);
      if (matchByCode) deptId = matchByCode._id;
    }

    // 3) Else if we only have departmentName in the specialty, map via deptName
    if (!deptId && incomingSpecialty.departmentName) {
      const matchByName = departments.find(d => d.deptName === incomingSpecialty.departmentName);
      if (matchByName) deptId = matchByName._id;
    }

    if (deptId) {
      setSpecialty(prev => ({ ...prev, departmentId: String(deptId) }));
    }
  }, [isEditMode, incomingSpecialty, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpecialty({ ...specialty, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/specialties/${specialty._id}`, specialty);
        alert('Specialty updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/specialties', specialty);
        alert('Specialty saved successfully!');
      }
      navigate('/specialtylist', { replace: true });
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving specialty');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Specialty" : "Specialty"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Specialty ID</label>
            <input
              type="text"
              name="specialtyId"
              value={specialty.specialtyId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={specialty.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Department</label>
            <select
              name="departmentId"
              value={specialty.departmentId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">--Select--</option>
              {departments.map((dept) => (
                <option key={dept._id} value={String(dept._id)}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={specialty.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
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
                isEditMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialtyMaster;

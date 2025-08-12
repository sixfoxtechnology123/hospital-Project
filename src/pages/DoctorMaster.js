import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';

const DoctorMaster = () => {
  const [doctorCode, setDoctorCode] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [qualification, setQualification] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDeptCode, setSelectedDeptCode] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch doctors and departments on mount or location.state change
  useEffect(() => {
    fetchDepartments();
    fetchDoctors();

    if (location.state?.doctor) {
      // Edit mode: fill form with doctor data
      const doc = location.state.doctor;
      setDoctorCode(doc.doctorCode || doc.code);
      setDoctorName(doc.doctorName || doc.name);
      setQualification(doc.qualification || '');
      setRegistrationNo(doc.registrationNo || doc.regNo || '');
      setSelectedDeptCode(doc.deptCode || '');
      setEditId(doc._id);
      setIsEditMode(true);
    } else if (location.state?.fromUpdate) {
      resetUpdateForm();
    } else {
      resetAddForm();
    }
  }, [location.state]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(res.data);

      if (!isEditMode) {
        // Generate next doctor code
        let next = 1;
        if (res.data.length > 0) {
          const lastDoctor = res.data[res.data.length - 1];
          const match = (lastDoctor.doctorCode || lastDoctor.code)?.match(/DOC(\d+)/);
          if (match) {
            next = parseInt(match[1], 10) + 1;
          }
        }
        setDoctorCode(`DOC${String(next).padStart(4, '0')}`);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      if (!isEditMode) setDoctorCode('DOC0001');
    }
  };

  const resetUpdateForm = () => {
    setDoctorCode('');
    setDoctorName('');
    setQualification('');
    setRegistrationNo('');
    setSelectedDeptCode('');
    setIsEditMode(false);
    setEditId(null);
  };

  const resetAddForm = () => {
    setDoctorName('');
    setQualification('');
    setRegistrationNo('');
    setSelectedDeptCode('');
    setIsEditMode(false);
    setEditId(null);
    fetchDoctors(); // regenerates code
  };

  const handleSaveOrUpdate = async () => {
    if (!doctorName.trim()) {
      alert('Doctor name is required');
      return;
    }
    if (!selectedDeptCode) {
      alert('Please select a department');
      return;
    }
    if (!registrationNo.trim()) {
      alert('Registration number is required');
      return;
    }

    // Duplicate name check ignoring current edited doctor
    const duplicate = doctors.find(
      (doc) =>
        doc.doctorName.toLowerCase().trim() === doctorName.toLowerCase().trim() &&
        doc._id !== editId
    );
    if (duplicate) {
      alert('Doctor name already exists!');
      return;
    }

 try {
  if (isEditMode) {
    await axios.put(`http://localhost:5000/api/doctors/${editId}`, {
      doctorCode,
      doctorName,
      qualification,
      registrationNo,
      departmentCode: selectedDeptCode,  // <--- change here
    });
    alert('Doctor updated successfully');
    resetUpdateForm();
    fetchDoctors();
    navigate('/doctorList', { replace: true });
  } else {
    await axios.post('http://localhost:5000/api/doctors', {
      doctorCode,
      doctorName,
      qualification,
      registrationNo,
      departmentCode: selectedDeptCode,  // <--- change here
    });
    alert('Doctor saved successfully');
    resetAddForm();
    fetchDoctors();
    navigate('/doctorList', { replace: true });
  }
} catch (err) {
  console.error('Error saving/updating doctor:', err);
  alert('Failed to save/update doctor');
}

  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          {isEditMode ? 'Update Doctor' : 'Doctor Master'}
        </h2>

        <div className="mb-4">
          <label className="block text-black mb-1">Doctor Code</label>
          <input
            type="text"
            value={doctorCode}
            readOnly
            className="w-full p-1 border rounded cursor-not-allowed bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black mb-1">Doctor Name</label>
          <input
            type="text"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-full p-1 border rounded"
            placeholder="Enter Doctor Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black mb-1">Select Department</label>
          <select
            value={selectedDeptCode}
            onChange={(e) => setSelectedDeptCode(e.target.value)}
            className="w-full p-1 border rounded"
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.deptCode} value={dept.deptCode}>
                {dept.deptName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-black mb-1">Qualification</label>
          <input
            type="text"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full p-1 border rounded"
            placeholder="Enter Qualification"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black mb-1">Registration No</label>
          <input
            type="text"
            value={registrationNo}
            onChange={(e) => setRegistrationNo(e.target.value)}
            className="w-full p-1 border rounded"
            placeholder="Enter Registration Number"
          />
        </div>

        <div className="flex justify-between">
          <button onClick={handleBack}>
            <BackButton />
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

export default DoctorMaster;

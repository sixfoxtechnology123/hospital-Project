// DoctorMaster.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';

const DoctorMaster = () => {
  const [doctorCode, setDoctorCode] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [qualification, setQualification] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');

  const [departments, setDepartments] = useState([]);     // [{deptCode, deptName}]
  const [selectedDeptCode, setSelectedDeptCode] = useState(''); // "CARD"

  const [doctors, setDoctors] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // fetch deps + docs; then decide add/edit
  useEffect(() => {
    const fetchDeps = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data || []);
      } catch (e) {
        console.error('Failed to fetch departments', e);
      }
    };

    const fetchDocs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data || []);
        // generate next code only for Add mode
        if (!location.state?.doctor) {
          let nextNum = 1;
          if (res.data?.length) {
            const last = res.data[res.data.length - 1];
            const m = (last.doctorCode || '').match(/DOC(\d+)/);
            if (m) nextNum = parseInt(m[1], 10) + 1;
          }
          setDoctorCode(`DOC${String(nextNum).padStart(4, '0')}`);
        }
      } catch (e) {
        console.error('Failed to fetch doctors', e);
        if (!location.state?.doctor) setDoctorCode('DOC0001');
      }
    };

    fetchDeps();
    fetchDocs();

    // handle edit prefill
    if (location.state?.doctor) {
      const doc = location.state.doctor;
      setIsEditMode(true);
      setEditId(doc._id);
      setDoctorCode(doc.doctorCode || doc.code || '');
      setDoctorName(doc.doctorName || doc.name || '');
      setQualification(doc.qualification || '');
      setRegistrationNo(doc.registrationNo || doc.regNo || '');
      // ✅ prefer departmentCode; fallback to deptCode if your old data has that key
      setSelectedDeptCode(doc.departmentCode || doc.deptCode || '');
    } else {
      // add mode
      setIsEditMode(false);
      setEditId(null);
      setDoctorName('');
      setQualification('');
      setRegistrationNo('');
      setSelectedDeptCode('');
    }
  }, [location.state]);

  const handleSaveOrUpdate = async () => {
    if (!doctorName.trim()) return alert('Doctor name is required');
    if (!selectedDeptCode) return alert('Please select a department');
    if (!registrationNo.trim()) return alert('Registration number is required');

    // prevent duplicate names (ignore self on edit)
    const dup = doctors.find(
      (d) =>
        (d.doctorName || '').toLowerCase().trim() === doctorName.toLowerCase().trim() &&
        d._id !== editId
    );
    if (dup) return alert('Doctor name already exists');

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/doctors/${editId}`, {
          doctorCode,
          doctorName,
          qualification,
          registrationNo,
          departmentCode: selectedDeptCode,
        });
        alert('Doctor updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/doctors', {
          doctorCode,
          doctorName,
          qualification,
          registrationNo,
          departmentCode: selectedDeptCode,
        });
        alert('Doctor saved successfully');
      }
      navigate('/doctorList', { replace: true });
    } catch (err) {
      console.error('Save/Update doctor failed:', err);
      alert('Failed to save/update doctor');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          {isEditMode ? 'Update Doctor' : 'Doctor Master'}
        </h2>

        {/* Doctor Code */}
        <div className="mb-4">
          <label className="block text-black mb-1">Doctor Code</label>
          <input
            type="text"
            value={doctorCode}
            readOnly
            className="w-full p-1 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Doctor Name */}
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

        {/* Department */}
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

        {/* Qualification */}
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

        {/* Registration No */}
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
          <button onClick={() => navigate(-1)}>
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorMaster = () => {
  const [doctorName, setDoctorName] = useState('');
  const [qualification, setQualification] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDeptCode, setSelectedDeptCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [lastCodeNumber, setLastCodeNumber] = useState(0); // Track last code

const fetchDoctors = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/doctors');

    const doctors = res.data;

    let next = 1;

    if (doctors.length > 0) {
      const lastDoctor = doctors[doctors.length - 1];
      const match = lastDoctor.doctorCode?.match(/DOC(\d+)/);

      if (match) {
        next = parseInt(match[1], 10) + 1;
      }
    }

    setLastCodeNumber(next);
    setGeneratedCode(`DOC${String(next).padStart(4, '0')}`);
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    setGeneratedCode('DOC0001');
  }
};

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    };

    fetchDepartments();
    fetchDoctors(); // initial fetch
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentCode = `DOC${String(lastCodeNumber).padStart(4, '0')}`;

      await axios.post('http://localhost:5000/api/doctors', {
        code: currentCode,
        name: doctorName,
        deptCode: selectedDeptCode,
        qualification,
        registrationNo,
      });

      alert('Successfully doctor added');

      // Reset form
      setDoctorName('');
      setQualification('');
      setRegistrationNo('');
      setSelectedDeptCode('');

      // Increment code manually without re-fetching
      const nextCode = lastCodeNumber + 1;
      setLastCodeNumber(nextCode);
      setGeneratedCode(`DOC${String(nextCode).padStart(4, '0')}`);
    } catch (error) {
      console.error('Error saving doctor:', error.response?.data || error.message);
      alert('Failed to add doctor');
    }
  };


  return (
    <div className="min-h-screen bg-zinc-300 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Doctor Master</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Doctor Code</label>
            <input
              type="text"
              value={generatedCode}
              readOnly
              className="w-full p-2 bg-gray-100 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Doctor Name</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Select Department</label>
            <select
              value={selectedDeptCode}
              onChange={(e) => setSelectedDeptCode(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept.deptCode} value={dept.deptCode}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Qualification</label>
            <input
              type="text"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block mb-1 font-medium">Registration No</label>
            <input
              type="text"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorMaster;

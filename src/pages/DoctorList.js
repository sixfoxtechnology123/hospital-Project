// DoctorList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(res.data || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const deleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Failed to delete doctor:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Header */}
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Doctor Master</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/doctorMaster')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Doctor Code</th>
            <th className="border border-green-500 px-2 py-1">Doctor Name</th>
            <th className="border border-green-500 px-2 py-1">Department</th>
            <th className="border border-green-500 px-2 py-1">Qualification</th>
            <th className="border border-green-500 px-2 py-1">Registration No</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {doctors.length ? (
            doctors.map((doc) => (
              <tr key={doc._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{doc.doctorCode}</td>
                <td className="border border-green-500 px-2 py-1">{doc.doctorName}</td>
                <td className="border border-green-500 px-2 py-1">
                  {doc.departmentName || doc.departmentCode /* fallback */}
                </td>
                <td className="border border-green-500 px-2 py-1">{doc.qualification}</td>
                <td className="border border-green-500 px-2 py-1">{doc.registrationNo}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => navigate('/doctorMaster', { state: { doctor: doc } })}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Edit Doctor"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteDoctor(doc._id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete Doctor"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No doctors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const PatientsList = ({ setIsAdminLoggedIn, setShowForm }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('https://hospitalpatientsreg.onrender.com/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this patient?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://hospitalpatientsreg.onrender.com/api/patients/${id}`);
      setPatients(patients.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete patient', err);
      alert('Failed to delete patient');
    }
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-white text-center pb-1 pt-1 rounded-sm bg-teal-600">Registered Patients</h2>
      <div className="overflow-auto">
        <table className="min-w-full border-2 border-gray-400 text-sm border-collapse">
          <thead className=" text-black">
            <tr>
              <th className="border-2 border-gray-400 px-2 py-1">SL</th>
              <th className="border-2 border-gray-400 px-2 py-1">Report No.</th>
              <th className="border-2 border-gray-400 px-2 py-1">Entry Date</th>
              <th className="border-2 border-gray-400 px-2 py-1">Booking No.</th>
              <th className="border-2 border-gray-400 px-2 py-1">Registration No.</th>
              <th className="border-2 border-gray-400 px-2 py-1">Patient Name</th>
              <th className="border-2 border-gray-400 px-2 py-1">Test Group</th>
              <th className="border-2 border-gray-400 px-2 py-1">Investigation</th>
              <th className="border-2 border-gray-400 px-2 py-1">Signatory</th>
              <th className="border-2 border-gray-400 px-2 py-1">Status</th>
              <th className="border-2 border-gray-400 px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={p._id} className="bg-gray-100 text-center border-gray-400">
                <td className="border-2 border-gray-400 px-2 py-1">{i + 1}</td>
                <td className="border-2 border-gray-400 px-2 py-1">{p.reportNo}</td>
                <td className="border-2 border-gray-400 px-2 py-1">{p.date}</td>
                <td className="border-2 border-gray-400 px-2 py-1">{p.bookingNo}</td>
                <td className="border-2 border-gray-400 px-2 py-1">{p.registrationNo}</td>
                <td className="border-2 border-gray-400 px-2 py-1">{p.prefix} {p.name}</td>
                <td className="border-2 border-gray-400 px-2 py-1">{p.testGroup}</td>
                <td className="border-2 border-gray-400 px-2 py-1">{p.investigation}</td>
                <td className="border-2 border-gray-400 px-2 py-1">{p.signatory}</td>
                <td className="border-2 border-gray-400 px-2 text-blue-700 py-1">{p.status}</td>
                <td className="border-2 border-gray-400 px-2 py-1 text-center">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-600 cursor-pointer"
                    title="Delete"
                    onClick={() => handleDelete(p._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <button
          className="bg-green-700 text-white text-sm font-semibold py-1 px-2 rounded-md"
          onClick={() => {
            setIsAdminLoggedIn(false);
            setShowForm(false);
          }}
        >
          Go To Login Page
        </button>
        <button
          className="bg-green-700 text-white text-sm font-semibold px-2 rounded-md"
          onClick={() => {
            setIsAdminLoggedIn(false);
            setShowForm(true);
          }}
        >
          Go To New Registration
        </button>
      </div>
    </div>
  );
};

export default PatientsList;

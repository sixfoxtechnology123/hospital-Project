import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const InvestigationList = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/investigations');
      setTests(res.data || []);
    } catch (e) {
      console.error('Failed to fetch tests:', e);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [location.key]);

  const deleteTest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investigation test?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/investigations/${id}`);
      setTests(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete test:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Investigation Tests</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/InvestigationMaster')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Test
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Test ID</th>
            <th className="border border-green-500 px-2 py-1">Name</th>
            <th className="border border-green-500 px-2 py-1">Department</th>
            <th className="border border-green-500 px-2 py-1">Sample Type</th>
            <th className="border border-green-500 px-2 py-1">Rate</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {tests.length > 0 ? (
            tests.map((t) => (
              <tr key={t._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{t.testId}</td>
                <td className="border border-green-500 px-2 py-1">{t.name}</td>
                <td className="border border-green-500 px-2 py-1">{t.departmentName}</td>
                <td className="border border-green-500 px-2 py-1">{t.sampleType}</td>
                <td className="border border-green-500 px-2 py-1">{t.rate}</td>
                <td className="border border-green-500 px-2 py-1">{t.status}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => navigate('/investigationMaster', { state: { test: t } })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteTest(t._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No tests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvestigationList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const WardList = () => {
  const [wardData, setWardData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchWards = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/wards');
      setWardData(res.data);
    } catch (err) {
      console.error('Error fetching wards:', err);
    }
  };

  useEffect(() => {
    fetchWards();
  }, [location.key]);

  const deleteWard = async (wardId) => {
    if (!window.confirm(`Are you sure you want to delete ${wardId}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/wards/${wardId}`);
      setWardData(prev => prev.filter((ward) => ward.wardId !== wardId));
    } catch (err) {
      console.error('Error deleting ward:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Ward Master</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/wards')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Ward
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Ward ID</th>
            <th className="border border-green-500 px-2 py-1">Name</th>
            <th className="border border-green-500 px-2 py-1">Department</th>
            <th className="border border-green-500 px-2 py-1">Type</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {wardData.map((ward, index) => (
            <tr key={index} className="hover:bg-gray-100 transition">
              <td className="border border-green-500 px-2 py-1">{ward.wardId}</td>
              <td className="border border-green-500 px-2 py-1">{ward.name}</td>
              <td className="border border-green-500 px-2 py-1">{ward.departmentName}</td>
              <td className="border border-green-500 px-2 py-1">{ward.type}</td>
              <td className="border border-green-500 px-2 py-1">{ward.status}</td>
              <td className="border border-green-500 px-2 py-1 text-center">
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => navigate("/wards", { state: { ward } })}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteWard(ward.wardId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WardList;

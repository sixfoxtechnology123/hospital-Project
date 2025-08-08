import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WardList = () => {
  const [wardData, setWardData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/wards')
      .then((res) => setWardData(res.data))
      .catch((err) => console.error('Error fetching wards:', err));
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
    <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
    <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-800"> Ward Master</h2>
        <button
        onClick={() => navigate('/wards')}
        className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow transition-transform duration-200"
        >
        Add Ward
        </button>
    </div>
    </div>


      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border px-2 py-1">Ward ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Department</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {wardData.map((ward, index) => (
            <tr key={index} className="hover:bg-gray-100 transition">
              <td className="border px-2 py-1 text-center">{ward.wardId}</td>
              <td className="border px-2 py-1">{ward.name}</td>
              <td className="border px-2 py-1">{ward.departmentId}</td>
              <td className="border px-2 py-1">{ward.type}</td>
              <td className="border px-2 py-1 text-center">{ward.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WardList;

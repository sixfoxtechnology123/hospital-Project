import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const BedList = () => {
  const [bedData, setBedData] = useState([]);
  const navigate = useNavigate();

  const fetchBeds = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/beds');
      setBedData(res.data);
    } catch (err) {
      console.error('Error fetching beds:', err);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const deleteBed = async (bedId) => {
    if (!window.confirm(`Are you sure you want to delete bed ${bedId}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/beds/${bedId}`);
      setBedData(bedData.filter((bed) => bed.bed_id !== bedId));
    } catch (err) {
      console.error('Error deleting bed:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Header */}
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Bed Master</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/Bedmaster')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Bed
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Ward Name</th>
            <th className="border border-green-500 px-2 py-1">Bed Number</th>
            <th className="border border-green-500 px-2 py-1">Bed Type</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {bedData.map((bed, index) => (
            <tr key={index} className="hover:bg-gray-100 transition">
              <td className="border border-green-500 px-2 py-1">{bed.bed_id}</td>
              <td className="border border-green-500 px-2 py-1">{bed.ward_name}</td>
              <td className="border border-green-500 px-2 py-1">{bed.bed_number}</td>
              <td className="border border-green-500 px-2 py-1">{bed.bed_type}</td>
              <td className="border border-green-500 px-2 py-1">{bed.status}</td>
              <td className="border border-green-500 px-2 py-1 text-center">
                <button
                  onClick={() => deleteBed(bed.bed_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BedList;

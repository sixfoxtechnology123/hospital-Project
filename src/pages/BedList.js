import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
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
    if (!window.confirm(`Are you sure you want to delete this bed?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/beds/${bedId}`);
      setBedData(bedData.filter((bed) => bed._id !== bedId));
    } catch (err) {
      console.error('Error deleting bed:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
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
          {bedData.length > 0 ? (
            bedData.map((bed, index) => (
              <tr key={index} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{bed.ward_name}</td>
                <td className="border border-green-500 px-2 py-1">{bed.bed_number}</td>
                <td className="border border-green-500 px-2 py-1">{bed.bed_type}</td>
                <td className="border border-green-500 px-2 py-1">{bed.status}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => navigate('/Bedmaster', { state: { bed } })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteBed(bed._id)}
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
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No beds found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BedList;

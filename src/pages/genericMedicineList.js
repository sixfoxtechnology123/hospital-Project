import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const GenericMedicineList = () => {
  const [generics, setGenerics] = useState([]);
  const navigate = useNavigate();

  // Fetch generics from backend
  useEffect(() => {
    const fetchGenerics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/generic-medicines');
        console.log('Fetched generics:', res.data); // debug
        setGenerics(res.data || []);
      } catch (e) {
        console.error('Failed to fetch generics:', e);
      }
    };
    fetchGenerics();
  }, []);

  // Delete generic medicine
  const deleteGeneric = async (id) => {
    if (!window.confirm('Are you sure you want to delete this generic medicine?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/generic-medicines/${id}`);
      setGenerics(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error('Failed to delete generic:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Generic Medicines</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/GenericMedicineMaster')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Generic
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Generic ID</th>
            <th className="border border-green-500 px-2 py-1">Generic Name</th>
            <th className="border border-green-500 px-2 py-1">Description</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {generics.length > 0 ? (
            generics.map((g) => (
              <tr key={g._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{g.genericId}</td>
                <td className="border border-green-500 px-2 py-1">{g.genericName}</td>
                <td className="border border-green-500 px-2 py-1">{g.description}</td>
                <td className="border border-green-500 px-2 py-1">{g.status}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() =>
                        navigate('/GenericMedicineMaster', { state: { generic: g } })
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteGeneric(g._id)}
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
                No generic medicines found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GenericMedicineList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const ServiceRateList = () => {
  const [rates, setRates] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchRates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/service-rates');
      setRates(res.data || []);
    } catch (e) {
      console.error('Failed to fetch rates:', e);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [location.key]);

  const deleteRate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rate?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/service-rates/${id}`);
      setRates(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to delete rate:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Service Rates</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/serviceRateMaster')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Rate
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-green-500">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="border border-green-500 px-2 py-1">Rate ID</th>
              <th className="border border-green-500 px-2 py-1">Service</th>
              <th className="border border-green-500 px-2 py-1">Rate Type</th>
              <th className="border border-green-500 px-2 py-1">Amount (₹)</th>
              <th className="border border-green-500 px-2 py-1">Effective From</th>
              <th className="border border-green-500 px-2 py-1">Effective To</th>
              <th className="border border-green-500 px-2 py-1">Doctor Share</th>
              <th className="border border-green-500 px-2 py-1">Hospital Share</th>
              <th className="border border-green-500 px-2 py-1">Status</th>
              <th className="border border-green-500 px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {rates.length > 0 ? (
              rates.map((r) => (
                <tr key={r._id} className="hover:bg-gray-100 transition">
                  <td className="border border-green-500 px-2 py-1">{r.rateId}</td>
                  <td className="border border-green-500 px-2 py-1">
                    {r.serviceName || 'N/A'}
                  </td>
                  <td className="border border-green-500 px-2 py-1">{r.rateType}</td>
                  <td className="border border-green-500 px-2 py-1">{Number(r.rateAmount).toFixed(2)}</td>
                  <td className="border border-green-500 px-2 py-1">
                    {r.effectiveFrom ? new Date(r.effectiveFrom).toLocaleDateString('en-GB') : ''}
                  </td>
                  <td className="border border-green-500 px-2 py-1">
                    {r.effectiveTo ? new Date(r.effectiveTo).toLocaleDateString('en-GB') : ''}
                  </td>

                  <td className="border border-green-500 px-2 py-1">
                    {r.doctorShare != null ? Number(r.doctorShare).toFixed(2) : ''}
                  </td>
                  <td className="border border-green-500 px-2 py-1">
                    {r.hospitalShare != null ? Number(r.hospitalShare).toFixed(2) : ''}
                  </td>
                  <td className="border border-green-500 px-2 py-1">{r.status}</td>
                  <td className="border border-green-500 px-2 py-1 text-center">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => navigate('/serviceRateMaster', { state: { rate: r } })}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteRate(r._id)}
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
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No service rates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRateList;

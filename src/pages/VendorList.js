// pages/vendorList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchVendors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vendors');
      setVendors(res.data || []);
    } catch (e) {
      console.error('Failed to fetch vendors:', e);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [location.key]);

  const deleteVendor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/vendors/${id}`);
      setVendors(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      console.error('Failed to delete vendor:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Vendors</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/vendormaster')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Vendor
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Vendor ID</th>
            <th className="border border-green-500 px-2 py-1">Vendor Name</th>
            <th className="border border-green-500 px-2 py-1">Contact Person</th>
            <th className="border border-green-500 px-2 py-1">Mobile Number</th>
            <th className="border border-green-500 px-2 py-1">GST No</th>
            <th className="border border-green-500 px-2 py-1">Email</th>
            <th className="border border-green-500 px-2 py-1">Address</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {vendors.length > 0 ? (
            vendors.map((v) => (
              <tr key={v._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{v.vendorId}</td>
                <td className="border border-green-500 px-2 py-1">{v.vendorName}</td>
                <td className="border border-green-500 px-2 py-1">{v.contactPerson}</td>
                <td className="border border-green-500 px-2 py-1">{v.mobileNumber}</td>
                <td className="border border-green-500 px-2 py-1">{v.gstNo}</td>
                <td className="border border-green-500 px-2 py-1">{v.email}</td>
                <td className="border border-green-500 px-2 py-1">{v.address}</td>
                <td className="border border-green-500 px-2 py-1">
                  <div className="flex justify-center items-center gap-4">
                    <button onClick={() => navigate('/vendorMaster', { state: { vendor: v } })} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => deleteVendor(v._id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No vendors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorList;

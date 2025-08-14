// pages/vendorMaster.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from "react-router-dom";

const VendorMaster = () => {
  const [vendor, setVendor] = useState({
    vendorId: '',
    vendorName: '',
    contactPerson: '',
    mobileNumber: '',
    gstNo: '',
    email: '',
    address: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNextVendorId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vendors/latest');
        setVendor(prev => ({ ...prev, vendorId: res.data?.vendorId || 'VEND0001' }));
      } catch (err) {
        console.error('Error getting vendor ID:', err);
      }
    };

    if (location.state?.vendor) {
      setVendor(location.state.vendor);
      setIsEditMode(true);
    } else {
      fetchNextVendorId();
      setIsEditMode(false);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/vendors/${vendor._id}`, vendor);
        alert('Vendor updated successfully!');
        navigate('/vendorlist', { replace: true });
      } else {
        await axios.post('http://localhost:5000/api/vendors', vendor);
        alert('Vendor saved successfully!');
        const res = await axios.get('http://localhost:5000/api/vendors/latest');
        setVendor({
          vendorId: res.data?.vendorId || 'VEND0001',
          vendorName: '',
          contactPerson: '',
          mobileNumber: '',
          gstNo: '',
          email: '',
          address: '',
        });
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving vendor');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Vendor" : "Vendor Master"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Vendor ID</label>
            <input type="text" name="vendorId" value={vendor.vendorId} readOnly className="w-full border border-gray-300 p-1 rounded bg-gray-100" />
          </div>

          <div>
            <label className="block font-medium">Supplier Name</label>
            <input type="text" name="vendorName" value={vendor.vendorName} onChange={handleChange} required className="w-full border border-gray-300 p-1 rounded" />
          </div>

          <div>
            <label className="block font-medium">Contact Person</label>
            <input type="text" name="contactPerson" value={vendor.contactPerson} onChange={handleChange} required className="w-full border border-gray-300 p-1 rounded" />
          </div>

          <div>
            <label className="block font-medium">Mobile Number</label>
            <input type="text" name="mobileNumber" value={vendor.mobileNumber} onChange={handleChange} required className="w-full border border-gray-300 p-1 rounded" />
          </div>

          <div>
            <label className="block font-medium">GST No</label>
            <input type="text" name="gstNo" value={vendor.gstNo} onChange={handleChange} required className="w-full border border-gray-300 p-1 rounded" />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input type="email" name="email" value={vendor.email} onChange={handleChange} required className="w-full border border-gray-300 p-1 rounded" />
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <textarea name="address" value={vendor.address} onChange={handleChange} required className="w-full border border-gray-300 p-1 rounded" rows="2"></textarea>
          </div>

          <div className="flex justify-between">
            <BackButton />
            <button type="submit" className={`px-4 py-1 rounded text-white ${isEditMode ? "bg-yellow-500 hover:bg-yellow-600" : "bg-teal-600 hover:bg-teal-700"}`}>
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorMaster;

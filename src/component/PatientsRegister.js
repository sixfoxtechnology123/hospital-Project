import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientsRegister = () => {
  const [formData, setFormData] = useState({
    reportNo: '',
    date: new Date().toISOString().split('T')[0],
    bookingNo: '',
    registrationNo: '',
    prefix: '',
    name: '',
    testGroup: '',
    investigation: '',
    signatory: '',
    status: '',
  });

  // Fetch auto-generated IDs from backend
  const fetchIds = async () => {
    try {
      const res = await axios.get('https://hospitalpatientsreg.onrender.com/api/generate-ids');
      setFormData(prev => ({
        ...prev,
        reportNo: res.data.reportNo,
        bookingNo: res.data.bookingNo,
        registrationNo: res.data.registrationNo
      }));
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchIds();
  }, []);

  const reset = () => {
    setFormData({
      reportNo: '',
      date: new Date().toISOString().split('T')[0],
      bookingNo: '',
      registrationNo: '',
      prefix: '',
      name: '',
      testGroup: '',
      investigation: '',
      signatory: '',
      status: '',
    });
    fetchIds(); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://hospitalpatientsreg.onrender.com/api/register', formData);
      alert('Patient Registered');
      reset();
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 max-w-7xl mx-auto border border-gray-300 shadow-lg text-sm">

      <div className="mt-2 text-white bg-green-600 text-xl flex justify-between p-2 font-bold">
        <span className='ml-3'>Registration Form</span>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Registration Date</span>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2" />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Report No</span>
          <input name="reportNo" value={formData.reportNo} readOnly className="border p-2 bg-gray-100" />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Booking No</span>
          <input name="bookingNo" value={formData.bookingNo} readOnly className="border p-2 bg-gray-100" />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Registration No</span>
          <input name="registrationNo" value={formData.registrationNo} readOnly className="border p-2 bg-gray-100" />
        </label>
      </div>

      <h3 className="mt-6 text-white bg-teal-500 text-xl p-2 font-bold">Patient Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Name<span className="text-red-500">*</span></span>
          <div className='flex gap-2'>
            <select name="prefix" value={formData.prefix} onChange={handleChange} required className="border p-2 w-2/4">
              <option value="">Prefix</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
            </select>
            <input name="name" placeholder='TYPE YOUR NAME' value={formData.name} onChange={handleChange} required className="border p-2 w-full" />
          </div>
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Test Group<span className="text-red-500">*</span></span>
          <select name="testGroup" value={formData.testGroup} onChange={handleChange} required className="border p-2">
            <option value="">Select</option>
            <option value="BIOCHEMISTRY">BIOCHEMISTRY</option>
            <option value="HEAMATOLOGY">HEAMATOLOGY</option>
            <option value="VIROLOGY">VIROLOGY</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Investigation</span>
          <input name="investigation" placeholder='e.g: CRP,RBS, SERUM UREA etc.' value={formData.investigation} onChange={handleChange} className="border p-2" />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Signatory<span className="text-red-500">*</span></span>
          <select name="signatory" value={formData.signatory} onChange={handleChange} required className="border p-2">
            <option value="">Select</option>
            <option value="DR. BANIBRATA BERA">DR. BANIBRATA BERA</option>
            <option value="DR. N.A. WASIM">DR. N.A. WASIM</option>
            <option value="DR. B.P. BARMAN">DR. B.P. BARMAN</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Status<span className="text-red-500">*</span></span>
          <select name="status" value={formData.status} onChange={handleChange} required className="border p-2">
            <option value="">Select</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="NON VERIFIED">NON VERIFIED</option>
          </select>
        </label>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded">Submit</button>
        <button type="button" onClick={reset} className="bg-zinc-800 text-white px-6 py-2 rounded">Reset</button>
      </div>
    </form>
  );
};

export default PatientsRegister;

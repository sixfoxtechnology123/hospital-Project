import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const IPRegistration = () => {
  const location = useLocation();
  const { mrNumber, patientData } = location.state || {};

  const [formData, setFormData] = useState({
    department: '',
    consultant: '',
    secondaryConsultant: '',
    plan: '',
    package: '',
    ward: '',
    bed: '',
    bedRate: '',
    pdx: '',
    referredBy: '',
    referralAgent: '',
    billingStatus: 'Open',
    fromDate: new Date().toISOString().split('T')[0]
  });

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [plans, setPlans] = useState([]);
  const [packages, setPackages] = useState([]);
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);

  // Mock data fetching - replace with real API calls
  useEffect(() => {
    setDepartments(['GENERAL MEDICINE', 'EYE SURGERY']);
    setDoctors(['Dr. A Kumar', 'Dr. B Mehta', 'Dr. C Singh']);
    setPlans(['GENERAL', 'CORPORATE', 'SCHEME']);
    setPackages(['CATARACT PACKAGE', 'EYE SURGERY PACKAGE']);
    setWards(['MALE WARD 1', 'FEMALE WARD 2']);
  }, []);

  useEffect(() => {
    if (formData.ward) {
      // Simulate bed list based on ward
      const wardBeds = {
        'MALE WARD 1': ['101A', '101B'],
        'FEMALE WARD 2': ['202A', '202B']
      };
      setBeds(wardBeds[formData.ward] || []);
    }
  }, [formData.ward]);

  useEffect(() => {
    if (formData.bed) {
      // Simulate bed rate based on bed selected
      const rates = {
        '101A': 1200,
        '101B': 1500,
        '202A': 1400,
        '202B': 1600
      };
      setFormData(prev => ({ ...prev, bedRate: rates[formData.bed] || 0 }));
    }
  }, [formData.bed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      mrNumber,
      ...formData
    };
    console.log('Submitted IP Registration Data:', payload);
    alert('IP Registration Submitted Successfully!');
    // TODO: Send data to backend
  };

  return (
     <form onClick={handleSubmit} className="bg-white pt-1 px-2 mt-1  w-screen mx-auto border border-gray-300 shadow text-sm">
      <div className=" text-white bg-teal-700 text-base flex justify-between p-1 font-semibold">
        <span className="ml-2">IP Registration Form</span>
      </div>
      <div className="md:grid grid-cols-5 gap-2 mb-2">
        <label className="flex flex-col col-span-1">
          <span className="text-black font-medium cursor-not-allowed">MR Number</span>
          
          <input
            type="text"
            value={mrNumber}
            readOnly
            className="border-2 p-1"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-black font-medium cursor-not-allowed">Patient Name</span>
        <input
          type="text"
          value={patientData?.name || ''}
          readOnly
          className="border-2 p-1"
          />
        </label>
        {/* Department */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Department</span>
        <select name="department" className="border-2 p-1" onChange={handleChange}>
            <option value="">Select</option>
            {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select>
        </label>

        {/* Consultant */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Consultant (Primary Doctor)</span>
        <select name="consultant" className="border-2 p-1" onChange={handleChange}>
            <option value="">Select</option>
            {doctors.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
       </label>
        {/* Secondary Consultant */}
       <label className="flex flex-col">
        <span className="text-black font-medium">S. Consultant (Optional)</span>
        <select name="secondaryConsultant" className="border-2 p-1" onChange={handleChange}>
            <option value="">Select</option>
            {doctors.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </label>

          {/* Plan */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Plan</span>
        <select name="plan" className="border-2 p-1" onChange={handleChange}>
            <option value="">Select</option>
            {plans.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
        </label>

         {/* Package */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Package (Optional)</span>
        <select name="package" className="border-2 p-1" onChange={handleChange}>
            <option value="">Select</option>
            {packages.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
        </label>
        
        {/* Ward */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Ward</span>
        <select name="ward" className="border-2 p-1" onChange={handleChange}>
            <option value="">Select</option>
            {wards.map((w, i) => <option key={i} value={w}>{w}</option>)}
          </select>
        </label>

        {/* Bed */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Bed No</span>
        <select name="bed" className="border-2 p-1" onChange={handleChange}>
            <option value="">Select</option>
            {beds.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        </label>
        
         {/* Bed Rate */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Bed Rate</span>
        <input name="bedRate" className="border-2 p-1 bg-gray-100" value={formData.bedRate} readOnly />
        </label>

        {/* PDX */}
        <label className="flex flex-col">
        <span className="text-black font-medium">PDx (Provisional Diagnosis)</span>
         <input name="pdx" className="border-2 p-1" onChange={handleChange} />
        </label>

          {/* Referral */}
         <label className="flex flex-col">
        <span className="text-black font-medium">Referred By</span>
         <input name="referredBy" className="border-2 p-1" onChange={handleChange} />
        </label>

        {/* Referral Agent */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Referral Agent</span>
        <input name="referralAgent" className="border-2 p-1" onChange={handleChange} />
        </label>

         {/* From Date */}
        <label className="flex flex-col">
        <span className="text-black font-medium">From Date</span>
        <input
            type="date"
            name="fromDate"
            className="border-2 p-1"
            value={formData.fromDate}
            onChange={handleChange}
          />
        </label>

        {/* billing status */}
        <label className="flex flex-col">
        <span className="text-black font-medium">Billing status</span>  
         <select
            name="billingStatus"
            className="border-2 p-1"
            value={formData.billingStatus}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
         </select>
        </label>

      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-green-600 font-semibold hover:bg-green-700 text-white px-4 py-2 mb-2 rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default IPRegistration;

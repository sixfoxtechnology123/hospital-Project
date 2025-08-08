import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const IPRegistration = () => {
 const location = useLocation();
const {mrNumber,patientData: passedPatientData } = location.state || {};
const [patientData, setPatientData] = useState(passedPatientData || null);


  const [formData, setFormData] = useState({
    mrno: '',
    ipNumber: '',
    admissionDate: '',
    admissionTime: '',
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
    fromDate: new Date().toISOString().split('T')[0],
    fatherOrSpouse: '',
    address1: '',
    address2: '',
    location: '',
    city: '',
    state: '',
    country: 'India',
    mobile: '',
    abhaId: '',
    aadhar: '',
    ageSex: '',
    maritalStatus: '',
    dob: '',
    bloodGroup: '',
    email: '',
    religion: '',
    occupation: '',
    name: ''
  });

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [plans, setPlans] = useState([]);
  const [packages, setPackages] = useState([]);
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);

  // 🔁 Optionally fetch full data from backend if not passed from router
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`/api/patients/${mrNumber}`);
        const data = await response.json();
        setPatientData(data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
      }
    };

    if (!patientData && mrNumber) {
      fetchPatientDetails();
    }
  }, [mrNumber, patientData]);

  // 🧠 Auto-fill form when patientData is ready
  useEffect(() => {
    if (!patientData) return;

    const now = new Date();
    const date = now.toLocaleDateString('en-GB'); // e.g., 07/08/2025
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, '');
    const counter = '0001'; // Replace with dynamic value later
    const ipNumber = `IP${formattedDate}${counter}`;

    setFormData(prev => ({
      ...prev,
      admissionDate: date,
      admissionTime: time,
      ipNumber,
      name: patientData?.name || '',
      ageSex: patientData?.ageSex || '',
      fatherOrSpouse: patientData?.fatherOrSpouse || '',
      dob: patientData?.dob || '',
      mobile: patientData?.mobile || '',
      address1: patientData?.address1 || '',
      address2: patientData?.address2 || '',
      location: patientData?.location || '',
      city: patientData?.city || '',
      state: patientData?.state || '',
      maritalStatus: patientData?.maritalStatus || '',
      religion: patientData?.religion || '',
      email: patientData?.email || '',
      bloodGroup: patientData?.bloodGroup || '',
      occupation: patientData?.occupation || '',
      aadhar: patientData?.aadhar || '',
      abhaId: patientData?.abhaId || ''
    }));
  }, [patientData]);
console.log('MR Number:', mrNumber); 
  // Dropdown options
  useEffect(() => {
    setDepartments(['GENERAL MEDICINE', 'EYE SURGERY']);
    setDoctors(['Dr. A Kumar', 'Dr. B Mehta', 'Dr. C Singh']);
    setPlans(['GENERAL', 'CORPORATE', 'SCHEME']);
    setPackages(['CATARACT PACKAGE', 'EYE SURGERY PACKAGE']);
    setWards(['MALE WARD 1', 'FEMALE WARD 2']);
  }, []);

  // Auto-update beds when ward changes
  useEffect(() => {
    const wardBeds = {
      'MALE WARD 1': ['101A', '101B'],
      'FEMALE WARD 2': ['202A', '202B']
    };
    setBeds(wardBeds[formData.ward] || []);
  }, [formData.ward]);

  // Auto-update bed rate
  useEffect(() => {
    const rates = {
      '101A': 1200,
      '101B': 1500,
      '202A': 1400,
      '202B': 1600
    };
    setFormData(prev => ({ ...prev, bedRate: rates[formData.bed] || '' }));
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
    // TODO: Send payload to backend here
  };

  return (
     <form onSubmit={handleSubmit} className="bg-white pt-1 px-2 mt-1 text-black  w-screen mx-auto border border-gray-300 shadow text-sm">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Admission Date & Time */}
        <div>
          <label className="block font-semibold">Admission Date & Time</label>
          <input
            type="text"
            value={`${formData.admissionDate} ${formData.admissionTime}`}
            readOnly
            className="w-full border-2 p-0 rounded"
          />
        </div>
        {/* IP Number */}
        <div>
          <label className="block font-semibold">IP Number</label>
          <input
            type="text"
            value={formData.ipNumber}
            readOnly
            className="w-full border-2 p-0 rounded"
          />
        </div>
        {/* MR Number */}
        <div>
          <label className="block font-semibold">MR Number</label>
          <input
            type="text"
            value={mrNumber}
            readOnly
            className="w-full border-2 p-0 rounded"
          />
        </div>
      </div>

      <div className=" text-white bg-teal-700 text-base flex justify-between p-0 font-semibold">
        <span className="ml-2">Patient Details</span>
      </div>
      <div className="md:grid grid-cols-5 gap-2 mb-2">
        <label className="flex flex-col">
          <span className="font-medium cursor-not-allowed">Name</span>
            <input
              type="text"
              value={formData.name}
              readOnly
              className="w-full border px-2 py-1 rounded"
            />

        </label>
        {/* Age / Sex */}
        <label className="flex flex-col">
          <span className="font-medium">Age/Sex</span>
          <input name="ageSex" value={formData.ageSex} readOnly className="border-2 p-0" onChange={handleChange} placeholder="e.g. 2/F" />
        </label>

        {/* DOB */}
        <label className="flex flex-col">
          <span className="font-medium">DOB</span>
          <input type="date" name="dob" value={formData.dob} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Father's / Spouse's Name */}
        <label className="flex flex-col">
          <span className="font-medium">Father/Spouse</span>
          <input name="fatherOrSpouse" value={formData.fatherOrSpouse} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>
        
        {/* Marital Status */}
        <label className="flex flex-col">
          <span className="font-medium">Marital Status</span>
          <input name="maritalStatus" value={formData.maritalStatus} readOnly className="border-2 p-0" onChange={handleChange}/>
          
        </label>

          {/* Blood Group */}
        <label className="flex flex-col">
          <span className="font-medium">Blood Group</span>
          <input name="bloodGroup" value={formData.bloodGroup} readOnly className="border-2 p-0" onChange={handleChange}/>
          
        </label>

        {/* Address 1 */}
        <label className="flex flex-col col-span-2">
          <span className="font-medium">Address 1</span>
          <input name="address1" value={formData.address1} readOnly  className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Address 2 */}
        <label className="flex flex-col col-span-2">
          <span className="font-medium">Address 2</span>
          <input name="address2" value={formData.address2} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Location */}
        <label className="flex flex-col">
          <span className="font-medium">Location</span>
          <input name="location" value={formData.location} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* City */}
        <label className="flex flex-col">
          <span className="font-medium">City</span>
          <input name="city" value={formData.city} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* State */}
        <label className="flex flex-col">
          <span className="font-medium">State</span>
          <input name="state" value={formData.state} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Country */}
        <label className="flex flex-col">
          <span className="font-medium">Country</span>
          <input name="country" value={formData.country} readOnly className="border-2 p-0" defaultValue="India" onChange={handleChange} />
        </label>

        {/* Mobile Number */}
        <label className="flex flex-col">
          <span className="font-medium">Mobile No</span>
          <input name="mobile" value={formData.mobile} className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Email */}
        <label className="flex flex-col">
          <span className="font-medium">Email ID</span>
          <input name="email" type="email" value={formData.email} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Religion */}
        <label className="flex flex-col">
          <span className="font-medium">Religion</span>
          <input name="religion" value={formData.religion} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Occupation */}
        <label className="flex flex-col">
          <span className="font-medium">Occupation</span>
          <input name="occupation" value={formData.occupation} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* ABHA ID */}
        <label className="flex flex-col">
          <span className="font-medium">ABHA ID</span>
          <input name="abhaId" value={formData.abhaId} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Aadhaar No */}
        <label className="flex flex-col">
          <span className="font-medium">Aadhar No</span>
          <input name="aadhar" value={formData.aadhar} readOnly className="border-2 p-0" onChange={handleChange} />
        </label>
      </div>


        <div className=" text-white bg-teal-700 text-base flex justify-between p-0 font-semibold">
        <span className="ml-2">Hospital Details</span>
      </div>
      <div className="md:grid grid-cols-5 gap-2 mb-2">
        {/*Department */}
        <label className="flex flex-col">
        <span className="font-medium">Department</span>
        <select name="department" className="border-2 p-0" onChange={handleChange}>
            <option value="">Select</option>
            {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select>
        </label>

        {/* Consultant */}
        <label className="flex flex-col">
        <span className="font-medium">Consultant (Primary Doctor)</span>
        <select name="consultant" className="border-2 p-0" onChange={handleChange}>
            <option value="">Select</option>
            {doctors.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
       </label>
        {/* Secondary Consultant */}
       <label className="flex flex-col">
        <span className="font-medium">S. Consultant (Optional)</span>
        <select name="secondaryConsultant" className="border-2 p-0" onChange={handleChange}>
            <option value="">Select</option>
            {doctors.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </label>

          {/* Plan */}
        <label className="flex flex-col">
        <span className="font-medium">Plan</span>
        <select name="plan" className="border-2 p-0" onChange={handleChange}>
            <option value="">Select</option>
            {plans.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
        </label>

         {/* Package */}
        <label className="flex flex-col">
        <span className="font-medium">Package (Optional)</span>
        <select name="package" className="border-2 p-0" onChange={handleChange}>
            <option value="">Select</option>
            {packages.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
        </label>
        
        {/* Ward */}
        <label className="flex flex-col">
        <span className="font-medium">Ward</span>
        <select name="ward" className="border-2 p-0" onChange={handleChange}>
            <option value="">Select</option>
            {wards.map((w, i) => <option key={i} value={w}>{w}</option>)}
          </select>
        </label>

        {/* Bed */}
        <label className="flex flex-col">
        <span className="font-medium">Bed No</span>
        <select name="bed" className="border-2 p-0" onChange={handleChange}>
            <option value="">Select</option>
            {beds.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        </label>
        
         {/* Bed Rate */}
        {/* <label className="flex flex-col">
        <span className="font-medium">Bed Rate</span>
        <input name="bedRate" className="border-2 p-0 bg-gray-100" value={formData.bedRate} readOnly />
        </label> */}

        {/* PDX */}
        <label className="flex flex-col">
        <span className="font-medium">PDx (Provisional Diagnosis)</span>
         <input name="pdx" className="border-2 p-0" onChange={handleChange} />
        </label>

          {/* Referral */}
         <label className="flex flex-col">
        <span className="font-medium">Referred By</span>
         <input name="referredBy" className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* Referral Agent */}
        <label className="flex flex-col">
        <span className="font-medium">Referral Agent</span>
        <input name="referralAgent" className="border-2 p-0" onChange={handleChange} />
        </label>

        {/* billing status */}
        <label className="flex flex-col">
        <span className="font-medium">Billing</span>  
         <select
            name="billingStatus"
            className="border-2 p-0"
            value={formData.billingStatus}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
         </select>
        </label>

        {/* From Date */}
        <label className="flex flex-col">
        <span className="font-medium">From</span>
        <input
            type="date"
            name="fromDate"
            className="border-2 p-0"
            value={formData.fromDate}
            onChange={handleChange}
          />
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
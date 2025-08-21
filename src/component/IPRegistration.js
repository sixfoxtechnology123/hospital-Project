// IPRegistration.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BackButton from './BackButton';
import Sidebar from './Sidebar';

const IPRegistration = () => {
  const location = useLocation();
  const { mrNumber, patientData: passedPatientData, wardName: selectedWardName } = location.state || {};

  // Fallback to localStorage if location.state is undefined
  const [patientData, setPatientData] = useState(() => {
    try {
      return passedPatientData || JSON.parse(localStorage.getItem('patientFormData')) || null;
    } catch {
      return null;
    }
  });

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
    name: '',
  });

  const [doctorName, setDoctorName] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [packages, setPackages] = useState([]);
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);

  // Store patientData in localStorage whenever it updates
  useEffect(() => {
    if (patientData) localStorage.setItem('patientFormData', JSON.stringify(patientData));
  }, [patientData]);

  // Fetch patient details if not available
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!mrNumber) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${mrNumber}`);
        setPatientData(response.data);
      } catch (err) {
        console.error('Error fetching patient data:', err);
      }
    };
    if (!patientData && mrNumber) fetchPatientDetails();
  }, [mrNumber, patientData]);

  useEffect(() => {
  if (!patientData) return;

  // Current date & time
  const now = new Date();
  const admissionDate = now.toLocaleDateString('en-GB'); // dd/mm/yyyy
  const admissionTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // IP Number generation: IP + YYYYMMDD + counter
  const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const counter = '0001'; // You can later replace with dynamic counter
  const ipNumber = `IP${formattedDate}${counter}`;

  // Construct age/sex if separate fields exist
  let ageSex = '';
  if (patientData.age && patientData.sex) {
    ageSex = `${patientData.age}/${patientData.sex}`;
  } else if (patientData.ageSex) {
    ageSex = patientData.ageSex;
  }

  // Update formData
  setFormData(prev => ({
    ...prev,
    admissionDate,
    admissionTime,
    ipNumber,
    mrno: patientData.mrNumber || mrNumber || '', // fallback
    name: patientData.name || '',
    ageSex,
    fatherOrSpouse: patientData.fatherOrSpouse || '',
    dob: patientData.dob || '',
    mobile: patientData.mobile || '',
    address1: patientData.address1 || '',
    address2: patientData.address2 || '',
    location: patientData.location || '',
    city: patientData.city || '',
    state: patientData.state || '',
    country: patientData.country || 'India',
    maritalStatus: patientData.maritalStatus || '',
    religion: patientData.religion || '',
    email: patientData.email || '',
    bloodGroup: patientData.bloodGroup || '',
    occupation: patientData.occupation || '',
    aadhar: patientData.aadhar || '',
    abhaId: patientData.abhaId || '',
  }));
}, [patientData, mrNumber]);


  // Fetch dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [deptRes, docRes, wardsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/departments'),
          axios.get('http://localhost:5000/api/doctors'),
          axios.get('http://localhost:5000/api/wards'),
        ]);

        setDepartments(deptRes.data.map(d => d.deptName || d.deptCode));
        setDoctorName(docRes.data.map(d => d.doctorName));
        setWards(wardsRes.data.map(w => w.name));
      } catch (err) {
        console.error('Error fetching dropdowns:', err);
      }
    };
    fetchDropdowns();
  }, []);

  // Pre-fill ward if selectedWardName passed
  useEffect(() => {
    if (selectedWardName) setFormData(prev => ({ ...prev, ward: selectedWardName }));
  }, [selectedWardName]);

  // Update beds when ward changes
  useEffect(() => {
    const wardBeds = { 'MALE WARD 1': ['101A', '101B'], 'FEMALE WARD 2': ['202A', '202B'] };
    setBeds(wardBeds[formData.ward] || []);
  }, [formData.ward]);

  // Update bed rate when bed changes
  useEffect(() => {
    const rates = { '101A': 1200, '101B': 1500, '202A': 1400, '202B': 1600 };
    setFormData(prev => ({ ...prev, bedRate: rates[formData.bed] || '' }));
  }, [formData.bed]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = { mrNumber, ...formData };
    console.log('Submitted IP Registration Data:', payload);
    alert('IP Registration Submitted Successfully!');
    // TODO: send payload to backend
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="bg-white p-3 w-full mx-auto border-2 border-gray-300 shadow text-sm md:text-sm">
          {/* Admission Date, IP Number, MR Number */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-semibold">Admission Date & Time</label>
              <input type="text" value={`${formData.admissionDate} ${formData.admissionTime}`} readOnly className="w-full border-2 p-0 rounded" />
            </div>
            <div>
              <label className="block font-semibold">IP Number</label>
              <input type="text" value={formData.ipNumber} readOnly className="w-full border-2 p-0 rounded" />
            </div>
            <div>
              <label className="block font-semibold">MR Number</label>
              <input type="text" value={formData.mrno} readOnly className="w-full border-2 p-0 rounded" />
            </div>
          </div>

          {/* Patient Details Section */}
          <div className="text-white bg-teal-700 text-sm flex justify-between p-0 font-semibold">
            <span className="ml-2">Patient Details</span>
          </div>
          <div className="md:grid grid-cols-5 gap-2 mb-2">
            <label className="flex flex-col">
              <span className="font-medium cursor-not-allowed">Name</span>
              <input type="text" value={formData.name} readOnly className="w-full border px-2 py-1 rounded" />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Age/Sex</span>
              <input name="ageSex" value={formData.ageSex} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">DOB</span>
              <input type="date" name="dob" value={formData.dob} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Father/Spouse</span>
              <input name="fatherOrSpouse" value={formData.fatherOrSpouse} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Marital Status</span>
              <input name="maritalStatus" value={formData.maritalStatus} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Blood Group</span>
              <input name="bloodGroup" value={formData.bloodGroup} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            {/* Address 1 & 2 */}
            <label className="flex flex-col col-span-2">
              <span className="font-medium">Address 1</span>
              <input name="address1" value={formData.address1} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col col-span-2">
              <span className="font-medium">Address 2</span>
              <input name="address2" value={formData.address2} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Location</span>
              <input name="location" value={formData.location} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">City</span>
              <input name="city" value={formData.city} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">State</span>
              <input name="state" value={formData.state} readOnly className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Country</span>
              <input name="country" value={formData.country} readOnly className="border-2 p-0" />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Mobile No</span>
              <input name="mobile" value={formData.mobile} className="border-2 p-0" onChange={handleChange} />
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Email ID</span>
              <input name="email" type="email" value={formData.email} readOnly className="border-2 p-0" />
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

          {/* Hospital Details Section */}
          <div className="text-white bg-teal-700 text-sm flex justify-between p-0 font-semibold">
            <span className="ml-2">Hospital Details</span>
          </div>
          <div className="md:grid grid-cols-5 gap-2 mb-2">
            <label className="flex flex-col">
              <span className="font-medium">Department</span>
              <select name="department" className="border-2 p-0" onChange={handleChange} value={formData.department}>
                <option value="">Select</option>
                {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Consultant (Primary Doctor)</span>
              <select name="consultant" className="border-2 p-0" onChange={handleChange} value={formData.consultant}>
                <option value="">Select</option>
                {doctorName.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </label>
             {/* Secondary Consultant */}
            <label className="flex flex-col">
              <span className="font-medium">S. Consultant (Optional)</span>
              <select
                name="consultant"
                className="border-2 p-0"
                onChange={handleChange}
                value={formData.consultant}
              >
                <option value="">Select</option>
                {doctorName.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
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

            <label className="flex flex-col">
              <span className="font-medium">Ward</span>
              <select name="ward" value={formData.ward} onChange={handleChange} className="border-2 p-0">
                <option value="">Select</option>
                {wards.map((w, i) => <option key={i} value={w}>{w}</option>)}
              </select>
            </label>
            <label className="flex flex-col">
              <span className="font-medium">Bed No</span>
              <select name="bed" value={formData.bed} onChange={handleChange} className="border-2 p-0">
                <option value="">Select</option>
                {beds.map((b, i) => <option key={i} value={b}>{b}</option>)}
              </select>
            </label>
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

          <div className="flex justify-end gap-2 mb-2">
            <BackButton />
            <button type="submit" className="bg-green-600 font-semibold hover:bg-green-700 text-white px-4 py-1 rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IPRegistration;

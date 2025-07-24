import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PatientsRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    prefix: '',
    fatherOrSpouse: '',
    sex: '',
    dob: '',
    age: '',
    maritalStatus: '',
    bloodGroup: '',
    address1: '',
    address2: '',
    location: '',
    city: '',
    pinCode: '',
    state: '',
    country: '',
    mobile: '',
    email: '',
    kinMobile: '',
    kinRelation: '',
    abhaId: '',
    aadhar: '',
    occupation: '',
    religion: '',
    source: '',
    pan: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mrNumber, setMrNumber] = useState('');
  const [manualAgeInput, setManualAgeInput] = useState(false);
  const [manualDOBInput, setManualDOBInput] = useState(false);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      setManualAgeInput(true);
      setManualDOBInput(false);
    } else if (name === "dob") {
      setManualDOBInput(true);
      setManualAgeInput(false);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Sync DOB and Age
  useEffect(() => {
    const today = new Date();

    if (manualDOBInput && formData.dob) {
      const birthDate = new Date(formData.dob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }

      if (calculatedAge !== parseInt(formData.age)) {
        setFormData(prev => ({ ...prev, age: calculatedAge.toString() }));
      }
    }

    if (manualAgeInput && formData.age) {
      const ageInt = parseInt(formData.age);
      if (!isNaN(ageInt)) {
        const approxDOB = new Date(today.getFullYear() - ageInt, today.getMonth(), today.getDate());
        const formattedDOB = approxDOB.toISOString().split("T")[0];
        setFormData(prev => ({ ...prev, dob: formattedDOB }));
      }
    }
  }, [formData.dob, formData.age, manualAgeInput, manualDOBInput]);

  // Reset form
  const reset = () => {
    setFormData({
      name: '',
      prefix: '',
      fatherOrSpouse: '',
      sex: '',
      dob: '',
      age: '',
      maritalStatus: '',
      bloodGroup: '',
      address1: '',
      address2: '',
      location: '',
      city: '',
      pinCode: '',
      state: '',
      country: '',
      mobile: '',
      email: '',
      kinMobile: '',
      kinRelation: '',
      abhaId: '',
      aadhar: '',
      occupation: '',
      religion: '',
      source: '',
      pan: ''
    });
  };

  // Validate required & optional fields
  const validateForm = () => {
    const { name, dob, mobile, email, aadhar } = formData;

    if (!name?.trim() || !dob?.trim() || !mobile?.trim()) {
      alert("Name, DOB, and Mobile Number are required.");
      return false;
    }

    if (email && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Invalid Email ID");
      return false;
    }

    if (aadhar && !/^\d{12}$/.test(aadhar)) {
      alert("Invalid Aadhar Number");
      return false;
    }

    return true;
  };

  // Submit patient form
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const res = await axios.post('http://localhost:5000/api/register', formData);

    const mr = res.data?.mrNumber || 'Unknown';

    setMrNumber(mr); // This must be correct
    setShowSuccessModal(true);


    reset();
  } catch (err) {
    alert('Registration Failed');
  }
};


  return (
    <form onSubmit={handleSubmit} className="bg-white pt-1 px-2  max-w-7xl mx-auto border-2 border-2-gray-300 shadow text-sm">

      {/* MR Success Message */}
      {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-green-100 bg-opacity-95 z-50">
            <div className="bg-white border-2 border-2-green-500 rounded-xl p-10 shadow-lg text-center max-w-md">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Patient Registered Successfully</h2>
              <p className="text-lg text-gray-800">
                MR Number is: <span className="font-semibold">{mrNumber}</span>
              </p>
              <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/select', {
                  
                  state: {
                    mrNumber: mrNumber,
                    patientData: formData,
                    
                  }
                });
              }}
              className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Continue
            </button>


            </div>
          </div>
        )}


      {/* Your existing form starts here (no styling changes done) */}
      <h3 className="text-white bg-teal-700 p-1 font-semibold mt-1">Basic Details</h3>
       <div className="grid grid-cols-5 gap-2">
         <label className="flex flex-col">
          <span className="text-black font-medium">Name<span className="text-red-500">*</span></span>
          <div className="flex gap-1">
            <select name="prefix" value={formData.prefix} onChange={handleChange} className="border-2 p-1 w-1/3">
              <option value="">Prefix</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
            </select>
            <input name="name" placeholder='TYPE YOUR NAME' value={formData.name} onChange={handleChange} className="border-2 p-1 w-full" />
          </div>
        </label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Father's / Spouse's Name</span>
          <input name="fatherOrSpouse" value={formData.fatherOrSpouse} onChange={handleChange} placeholder='TYPE YOUR FATHER/SPOUSE NAME' className="border-2 p-1" />
        </label>

        <label className="flex gap-1 w-full">
         <div className="flex flex-col w-2/4">
          <span className="text-black  font-medium">Age</span>
          <input type="number" name="age" value={formData.age} onChange={handleChange} className="border-2 p-1" /> 
          </div>

           <div className="flex flex-col w-2/4">
            <span className="text-black  font-medium">Date of Birth<span className="text-red-600">*</span></span>
           <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border-2 p-1" />
           </div>
        </label>
        
        <label className="flex gap-2 w-full">
           <div className="flex flex-col w-2/4">
           <span className="text-black  font-medium">Sex</span>
            <select name="sex" value={formData.sex} onChange={handleChange} className="border-2 p-1">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          </div>

          <div className="flex flex-col w-2/4">
          <span className="text-black  font-medium">Marital Status</span>
           <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="border-2 p-1">
            <option value="">Select</option>
            <option>Married</option>
            <option>Unmarried</option>
            <option>Widow</option>
          </select>
          </div>
        </label>
         <label className="flex flex-col">
          <span className="text-black  font-medium">Blood Group</span>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="border-2 p-1">
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                </select>
        </label>
        
      </div>

      {/* Contact & Address */}
      <h3 className="text-white bg-teal-700 p-1 font-semibold mt-2">Contact & Address</h3>
      <div className="grid grid-cols-4 gap-2">
        <label className="flex flex-col">
          <span className="text-black  font-medium">Address Line 1</span>
          <input name="address1" placeholder='FLAT/HOUSE NO, FLOOR, BUILDING' value={formData.address1} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Address Line 2</span>
          <input name="address2" placeholder='COLONY/SOCIETY, STREET,LOCALITY/AREA' value={formData.address2} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Location</span>
          <input name="location" placeholder='LOCALITY/AREA/TOWN' value={formData.location} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">City</span>
          <input name="city" value={formData.city} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">PIN Code</span>
          <input name="pinCode" value={formData.pinCode} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">State</span>
          <input name="state" value={formData.state} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Country</span>
          <input name="country" value={formData.country} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            <span className="text-black  font-medium">Mobile Number</span><span className="text-red-600">*</span></span>
          <input name="mobile" value={formData.mobile} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Email ID</span>
          <input name="email" value={formData.email} onChange={handleChange} className="border-2 p-1" /></label>
        <label className="flex flex-col">
          <span className="text-black  font-medium">Next of Kin Mobile No.</span>
          <input name="kinMobile" value={formData.kinMobile} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Relation with Next to Kin</span>
          <input name="kinRelation" value={formData.kinRelation} onChange={handleChange} className="border-2 p-1" /></label>
      </div>

      {/* Identification & Other Info */}
      <h3 className="text-white bg-teal-700 p-1 font-semibold mt-2">Identification & Other Info</h3>
      <div className="grid grid-cols-4 gap-2">
        <label className="flex flex-col">
          <span className="text-black  font-medium">ABHA ID</span>
          <input name="abhaId" value={formData.abhaId} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Aadhar Number</span>
         <input name="aadhar" value={formData.aadhar} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Occupation</span>
        <input name="occupation" value={formData.occupation} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">Religion</span>
        <input name="religion" value={formData.religion} onChange={handleChange} className="border-2 p-1" /></label>
        
        <label className="flex flex-col">
          <span className="text-black  font-medium">Source</span>
          <input name="source" value={formData.source} onChange={handleChange} className="border-2 p-1" /></label>

        <label className="flex flex-col">
          <span className="text-black  font-medium">PAN No.</span>
          <input name="pan" value={formData.pan} onChange={handleChange} className="border-2 p-1" /></label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6 mb-3">
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Register</button>
        <button type="button" onClick={reset} className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded">Reset</button>
      </div>
    </form>
  );
};

export default PatientsRegister;

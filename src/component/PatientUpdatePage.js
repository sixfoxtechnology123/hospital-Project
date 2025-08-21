import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import Sidebar from "./Sidebar";
import axios from "axios";

const UpdatePatientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Added navigate

  const [formData, setFormData] = useState({
    mrNumber: "",
    prefix: "",
    name: "",
    fatherOrSpouse: "",
    age: "",
    dob: "",
    sex: "",
    maritalStatus: "",
    bloodGroup: "",
    address1: "",
    address2: "",
    location: "",
    city: "",
    pinCode: "",
    state: "",
    country: "",
    mobile: "",
    email: "",
    kinMobile: "",
    kinRelation: "",
    abhaId: "",
    aadhar: "",
    occupation: "",
    religion: "",
    source: "",
    pan: "",
  });

  // Fetch patient details by ID
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/patients/${id}`)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("Error fetching patient:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/patients/${id}`, formData)
      .then(() => {
        alert("Patient updated successfully!");
        navigate(`/PatientUpdatePage/${id}`); // ✅ Fixed: use existing id
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  return (
      <div className="flex min-h-screen flex-col  md:flex-row">
        <Sidebar/>
      {/* Form Section */}
      <div className="flex-1 p-3  md:p-6 bg-gray-100 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white pt-2 px-3 w-full mx-auto border-2 border-gray-300 shadow text-sm md:text-base"
        >
          {/* MR Number */}
          <div className="w-full bg-green-600 text-white text-lg md:text-xl font-bold py-2 text-center rounded mb-3">
            MR Number: {formData.mrNumber}
          </div>

          {/* Basic Details */}
          <h3 className="text-white bg-teal-700 p-1 font-semibold mt-1">
            Basic Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-sm gap-2">
            {/* Name + Prefix */}
            <label className="flex flex-col">
              <span className="text-black font-medium">
                Name<span className="text-red-500">*</span>
              </span>
              <div className="flex gap-1">
                <select
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleChange}
                  className="border-2 p-1 w-1/3"
                >
                  <option value="">Prefix</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                </select>
                <input
                  name="name"
                  placeholder="TYPE YOUR NAME"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-2 p-1 w-full"
                />
              </div>
            </label>

            {/* Father's / Spouse's Name */}
            <label className="flex flex-col">
              <span className="text-black font-medium">
                Father's / Spouse's Name
              </span>
              <input
                name="fatherOrSpouse"
                placeholder="TYPE NAME"
                value={formData.fatherOrSpouse}
                onChange={handleChange}
                className="border-2 p-1"
              />
            </label>

            {/* Sex, Blood, Age */}
            <label className="flex gap-1 w-full">
              <div className="flex flex-col w-1/3">
                <span className="text-black font-medium">Sex</span>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="border-2 p-1"
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex flex-col w-1/3">
                <span className="text-black font-medium">Blood</span>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="border-2 p-1"
                >
                  <option value="">Select</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>
              <div className="flex flex-col w-1/3">
                <span className="text-black font-medium">Age</span>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="border-2 p-1"
                />
              </div>
            </label>

            {/* DOB + Marital Status */}
            <label className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="flex flex-col w-full">
                <span className="text-black font-medium">
                  Date of Birth<span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border-2 p-1"
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-black font-medium">Marital Status</span>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="border-2 p-1"
                >
                  <option value="">Select</option>
                  <option>Married</option>
                  <option>Unmarried</option>
                  <option>Widow</option>
                </select>
              </div>
            </label>
          </div>

         {/* ---------- Contact Details ---------- */}
        <h3 className="text-white bg-teal-700 p-1 font-semibold text-sm mt-4">Contact Details</h3>
        <div className="grid grid-cols-1 text-sm sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <label className="flex flex-col">
            <span className="text-black font-medium">Address Line 1</span>
            <input name="address1" value={formData.address1} onChange={handleChange} placeholder="Flat / House / Building" className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Address Line 2</span>
            <input name="address2" value={formData.address2} onChange={handleChange} placeholder="Colony / Street / Locality" className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Location</span>
            <input name="location" value={formData.location} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">City</span>
            <input name="city" value={formData.city} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">PIN Code</span>
            <input name="pinCode" value={formData.pinCode} onChange={handleChange} className="border-2 p-1" />
        </label>

         <label className="flex flex-col">
            <span className="text-black font-medium">State</span>
            <input name="state" value={formData.state} onChange={handleChange} className="border-2 p-1" />
         </label>

          <label className="flex flex-col">
            <span className="text-black font-medium">Country</span>
            <input name="country" value={formData.country} onChange={handleChange} className="border-2 p-1" />
          </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Mobile No<span className="text-red-500">*</span></span>
            <input name="mobile" value={formData.mobile} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Email</span>
            <input name="email" value={formData.email} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Next of Kin Mobile</span>
            <input name="kinMobile" value={formData.kinMobile} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Relation with Next of Kin</span>
            <input name="kinRelation" value={formData.kinRelation} onChange={handleChange} className="border-2 p-1" />
        </label>
        </div>

        {/* ---------- Identification ---------- */}
        <h3 className="text-white bg-teal-700 p-1 text-sm font-semibold mt-4">Identification</h3>
        <div className="grid grid-cols-1 text-sm sm:grid-cols-2 lg:grid-cols-6 gap-2">
        <label className="flex flex-col">
            <span className="text-black font-medium">ABHA ID</span>
            <input name="abhaId" value={formData.abhaId} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Aadhar</span>
            <input name="aadhar" value={formData.aadhar} onChange={handleChange} className="border-2 p-1" />
        </label>


        <label className="flex flex-col">
            <span className="text-black font-medium">Occupation</span>
            <input name="occupation" value={formData.occupation} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Religion</span>
            <input name="religion" value={formData.religion} onChange={handleChange} className="border-2 p-1" />
        </label>

        <label className="flex flex-col">
            <span className="text-black font-medium">Source</span>
            <input name="source" value={formData.source} onChange={handleChange} className="border-2 p-1" />
        </label>
         <label className="flex flex-col">
            <span className="text-black font-medium">PAN</span>
            <input name="pan" value={formData.pan} onChange={handleChange} className="border-2 p-1" />
        </label>
        </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 mb-3 gap-3">
            <BackButton />
            <button
              type="submit"
              className="bg-blue-600 font-semibold hover:bg-blue-700 text-white px-6 py-1 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default UpdatePatientPage;

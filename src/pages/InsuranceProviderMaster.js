// InsuranceProviderMaster.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../component/BackButton";
import { useLocation, useNavigate } from "react-router-dom";

const InsuranceProviderMaster = () => {
  const [provider, setProvider] = useState({
    providerId: "",
    name: "",
    contact_person: "",
    contact_number: "",
    email: "",
    status: "Active",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [incomingProvider, setIncomingProvider] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Load next ID or edit
  useEffect(() => {
    const fetchNextProviderId = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/insurance/latest");
        const nextId = res.data?.providerId || "INSPROV0001";
        setProvider((prev) => ({ ...prev, providerId: nextId }));
      } catch (err) {
        console.error("Error getting provider ID:", err);
      }
    };

    if (location.state?.provider) {
      const p = location.state.provider;
      setIncomingProvider(p);
      setIsEditMode(true);
      setProvider({
        _id: p._id,
        providerId: p.providerId || "",
        name: p.name || "",
        contact_person: p.contact_person || "",
        contact_number: p.contact_number || "",
        email: p.email || "",
        status: p.status || "Active",
      });
    } else {
      fetchNextProviderId();
      setIsEditMode(false);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProvider({ ...provider, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/insurance/${provider._id}`, provider);
        alert("Provider updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/insurance", provider);
        alert("Insurance Provider saved successfully!");
      }
      navigate("/insuranceProviderList", { replace: true });
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving provider");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Provider" : "Insurance Provider"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Provider ID</label>
            <input
              type="text"
              name="providerId"
              value={provider.providerId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Provider Name</label>
            <input
              type="text"
              name="name"
              value={provider.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Contact Person</label>
            <input
              type="text"
              name="contact_person"
              value={provider.contact_person}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Contact Number</label>
            <input
              type="tel"
              name="contact_number"
              value={provider.contact_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
              pattern="[0-9+ ]{7,15}"
              title="Phone number with country code if needed"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={provider.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={provider.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>

          <div className="flex justify-between">
            <BackButton />
            <button
              type="submit"
              className={`px-4 py-1 rounded text-white ${
                isEditMode
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsuranceProviderMaster;

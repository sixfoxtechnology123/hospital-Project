import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaEdit, FaArrowRight } from "react-icons/fa";
import BackButton from "./BackButton";

const PatientsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/patients");
      setPatients(res.data || []);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [location.key]);

  // Delete patient
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete patient:", err);
    }
  };

  // Filter patients
  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.mrNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
     {/* Header Section */}
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          
          {/* Left: Back Button */}
          <div className="flex-shrink-0">
            <BackButton />
          </div>

          {/* Center: Title */}
          <h2 className="text-xl font-bold text-green-800 text-center flex-1">
            Patients
          </h2>

          {/* Right: Search + New Register */}
          <div className="flex gap-3 items-center flex-shrink-0">
            <input
              type="text"
              placeholder="Search by Name, Email, MR Number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-green-400 rounded px-3 py-1 text-sm focus:outline-none"
            />
            <button
              onClick={() => navigate("/PatientsRegister")}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              New Register
            </button>
          </div>
        </div>
      </div>


      {/* Patients Table */}
      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Name</th>
            <th className="border border-green-500 px-2 py-1">Email</th>
            <th className="border border-green-500 px-2 py-1">MR Number</th>
            <th className="border border-green-500 px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((p) => (
              <tr key={p._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{p.name}</td>
                <td className="border border-green-500 px-2 py-1">{p.email}</td>
                <td className="border border-green-500 px-2 py-1">{p.mrNumber}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => navigate(`/select/${p._id}`)}
                      className="text-green-700 hover:text-green-900"
                      title="Continue"
                    >
                      <FaArrowRight />
                    </button>
                    <button
                      onClick={() => navigate(`/PatientsRegister/${p._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsList;

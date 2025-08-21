import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Header from "./Header";

const PatientsList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/patients");
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch patients. Check console for details.");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete patient. Check console.");
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.mrNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.mobile?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 bg-white shadow-md rounded-md">
      {/* Top bar – one line, sticky, scrollable on small screens */}
      <Header
        search={search}
        setSearch={setSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title="Registered Patients List" // pass page title dynamically
      />

      {/* Loading & Error */}
      {loading && <p className="text-center text-gray-500 py-4">Loading patients...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-green-500">
            <thead className="bg-green-100 text-sm">
              <tr>
                <th className="border border-green-500 px-2 py-1">MR Number</th>
                <th className="border border-green-500 px-2 py-1">Name</th>
                <th className="border border-green-500 px-2 py-1">Mobile</th>
                <th className="border border-green-500 px-2 py-1">Email</th>
                <th className="border border-green-500 px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-center">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-200 transition">
                    <td className="border border-green-500 px-2 py-1">{p.mrNumber}</td>
                    <td className="border border-green-500 px-2 py-1">{p.name}</td>
                    <td className="border border-green-500 px-2 py-1">{p.mobile}</td>
                    <td className="border border-green-500 px-2 py-1">{p.email}</td>
                    <td className="border border-green-500 px-2 py-1">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          onClick={() => navigate(`/PatientUpdatePage/${p._id}`)}
                          className="text-green-700 hover:text-green-900"
                          title="Continue"
                        >
                          <FaArrowRight />
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
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientsList;

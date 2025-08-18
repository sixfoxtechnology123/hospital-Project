// InsuranceProviderList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import BackButton from "../component/BackButton";

const InsuranceProviderList = () => {
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/insurance");
      setProviders(res.data || []);
    } catch (e) {
      console.error("Failed to fetch providers:", e);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [location.key]);

  const deleteProvider = async (id) => {
    if (!window.confirm("Are you sure you want to delete this provider?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/insurance/${id}`);
      setProviders((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete provider:", err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Insurance Providers</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate("/InsuranceProviderMaster")}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Provider
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Provider ID</th>
            <th className="border border-green-500 px-2 py-1">Name</th>
            <th className="border border-green-500 px-2 py-1">Contact Person</th>
            <th className="border border-green-500 px-2 py-1">Contact Number</th>
            <th className="border border-green-500 px-2 py-1">Email</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {providers.length > 0 ? (
            providers.map((prov) => (
              <tr key={prov._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{prov.providerId}</td>
                <td className="border border-green-500 px-2 py-1">{prov.name}</td>
                <td className="border border-green-500 px-2 py-1">{prov.contact_person}</td>
                <td className="border border-green-500 px-2 py-1">{prov.contact_number}</td>
                <td className="border border-green-500 px-2 py-1">{prov.email}</td>
                <td className="border border-green-500 px-2 py-1">{prov.status}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() =>
                        navigate("/insuranceProviderMaster", { state: { provider: prov } })
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteProvider(prov._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No providers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InsuranceProviderList;

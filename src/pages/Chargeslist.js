import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import BackButton from "../component/BackButton";

const ChargesList = () => {
  const [charges, setCharges] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCharges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/charges");
      setCharges(res.data || []);
    } catch (err) {
      console.error("Failed to fetch charges:", err);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, [location.key]);

  const deleteCharge = async (id) => {
    if (!window.confirm("Are you sure you want to delete this charge?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/charges/${id}`);
      setCharges((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete charge:", err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Charges</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate("/ChargesMaster")}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Charge
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Charge ID</th>
            <th className="border border-green-500 px-2 py-1">Item Type</th>
            <th className="border border-green-500 px-2 py-1">Item_ID_Name</th>
            <th className="border border-green-500 px-2 py-1">Description</th>
            <th className="border border-green-500 px-2 py-1">Rate</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {charges.length > 0 ? (
            charges.map((c) => (
              <tr key={c._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{c.chargeId}</td>
                <td className="border border-green-500 px-2 py-1">{c.item_type}</td>
                <td className="border border-green-500 px-2 py-1">{c.item_display}</td>
                <td className="border border-green-500 px-2 py-1">{c.description}</td>
                <td className="border border-green-500 px-2 py-1">{c.rate}</td>
                <td className="border border-green-500 px-2 py-1">{c.status}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => navigate("/chargesmaster", { state: { charge: c } })}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteCharge(c._id)}
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
                No charges found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChargesList;

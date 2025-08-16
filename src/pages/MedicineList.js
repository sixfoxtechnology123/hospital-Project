import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../component/BackButton";

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medicines");
      setMedicines(res.data || []);
    } catch (e) {
      console.error("Failed to fetch medicines:", e);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [location.key]);

  const deleteMedicine = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/medicines/${id}`);
      setMedicines((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Medicines</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate("/MedicineMaster")}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Medicine
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">ID</th>
            <th className="border border-green-500 px-2 py-1">Name</th>
            <th className="border border-green-500 px-2 py-1">Generic Name</th>
            <th className="border border-green-500 px-2 py-1">Unit</th>
            <th className="border border-green-500 px-2 py-1">Stock</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {medicines.length ? (
            medicines.map((med) => (
              <tr key={med._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{med.medicineId}</td>
                <td className="border border-green-500 px-2 py-1">{med.name}</td>
                <td className="border border-green-500 px-2 py-1">{med.genericName}</td>
                <td className="border border-green-500 px-2 py-1">{med.unit}</td>
                <td className="border border-green-500 px-2 py-1">{med.stock}</td>
                <td className="border border-green-500 px-2 py-1">{med.status}</td>
                <td className="border border-green-500 px-2 py-1">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() =>
                        navigate("/MedicineMaster", { state: { medicine: med } })
                      }
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteMedicine(med._id)}
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
                No medicines found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineList;

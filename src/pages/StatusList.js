import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import BackButton from "../component/BackButton";

const StatusList = () => {
  const [statusList, setStatusList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/status");
      setStatusList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  };

  const handleEdit = (statusData) => {
    navigate("/statusmaster", { state: { statusData } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this status?")) {
      try {
        await axios.delete(`http://localhost:5000/api/status/${id}`);

        // update state correctly
        setStatusList(statusList.filter((s) => s._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Error deleting status");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Header with Add + Back */}
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Status Master</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate("/statusmaster")}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Status
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Status ID</th>
            <th className="border border-green-500 px-2 py-1">Status Name</th>
            <th className="border border-green-500 px-2 py-1">Description</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {statusList.length > 0 ? (
            statusList.map((s) => (
              <tr key={s._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">
                  {s.statusId}
                </td>
                <td className="border border-green-500 px-2 py-1">
                  {s.statusName}
                </td>
                <td className="border border-green-500 px-2 py-1">
                  {s.description}
                </td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)} // ✅ fixed
                    >
                      <FaTrash className="text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No statuses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatusList;

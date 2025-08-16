import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../component/BackButton";
import { useLocation, useNavigate } from "react-router-dom";

const StatusMaster = () => {
  const [status, setStatus] = useState({
    _id: "",
    statusId: "",
    statusName: "",
    description: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.statusData) {
      // Editing existing record
      const s = location.state.statusData;
      setStatus({
        _id: s._id,
        statusId: s.statusId || "",
        statusName: s.statusName || "",
        description: s.description || "",
      });
      setIsEditMode(true);
    } else {
      // New record → fetch next ID
      const fetchNextStatusId = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/status/next-id");
          setStatus((prev) => ({
            ...prev,
            statusId: res.data.nextId,
          }));
        } catch (err) {
          console.error("Failed to fetch next statusId", err);
        }
      };
      fetchNextStatusId();
      setIsEditMode(false);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus({ ...status, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/status/${status._id}`, status);
        alert("Status updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/status", status);
        alert("Status saved successfully!");
      }
      navigate("/statuslist", { replace: true });
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving status");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Status" : "Status Master"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          {/* Status ID */}
          <div>
            <label className="block font-medium">Status ID</label>
            <input
              type="text"
              name="statusId"
              value={status.statusId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          {/* Status Name */}
          <div>
            <label className="block font-medium">Status Name</label>
            <input
              type="text"
              name="statusName"
              value={status.statusName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={status.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              rows="2"
            ></textarea>
          </div>

          {/* Buttons */}
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

export default StatusMaster;

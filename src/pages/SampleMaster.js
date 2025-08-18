import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../component/BackButton";
import { useLocation, useNavigate } from "react-router-dom";

const SampleMaster = () => {
  const [sample, setSample] = useState({
    sampleId: "",
    sampleName: "",
    description: "",
    status: "Active",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNextSampleId = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/samples/latest");
        setSample((prev) => ({ ...prev, sampleId: res.data?.sampleId || "SAMPLE0001" }));
      } catch (err) {
        console.error("Error getting sample ID:", err);
      }
    };

    if (location.state?.sample) {
      const s = location.state.sample;
      setSample({
        _id: s._id,
        sampleId: s.sampleId,
        sampleName: s.sampleName,
        description: s.description,
        status: s.status,
      });
      setIsEditMode(true);
    } else {
      fetchNextSampleId();
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSample({ ...sample, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/samples/${sample._id}`, sample);
        alert("Sample updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/samples", sample);
        alert("Sample saved successfully!");
      }
      navigate("/samplelist", { replace: true });
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving sample");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Sample" : "Sample"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Sample ID</label>
            <input
              type="text"
              name="sampleId"
              value={sample.sampleId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Sample Name</label>
            <input
              type="text"
              name="sampleName"
              value={sample.sampleName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={sample.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              rows="2"
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={sample.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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

export default SampleMaster;

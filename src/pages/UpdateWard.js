import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../component/BackButton";

const UpdateWard = () => {
  const { wardId } = useParams();
  const navigate = useNavigate();

  const [ward, setWard] = useState({
    wardId: "",
    name: "",
    departmentId: "",
    type: "",
    status: "Active",
  });

  const [departments, setDepartments] = useState([]);

    useEffect(() => {
    console.log("wardId from URL:", wardId);
    const fetchData = async () => {
        try {
        const deptRes = await axios.get("http://localhost:5000/api/departments");
        setDepartments(deptRes.data);

        const wardRes = await axios.get(`http://localhost:5000/api/wards/${wardId}`);
        console.log("Fetched ward data:", wardRes.data);
        setWard(wardRes.data);
        } catch (err) {
        console.error("Error fetching ward details:", err);
        }
    };

    fetchData();
    }, [wardId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setWard((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/wards/${wardId}`, ward);
      alert("Ward updated successfully!");
      navigate("/wards");
    } catch (err) {
      console.error("Error updating ward:", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Update Ward
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          {/* Ward ID */}
          <div className="col-span-1">
            <label className="block font-medium">Ward ID</label>
            <input
              type="text"
              name="wardId"
              value={ward.wardId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          {/* Name */}
          <div className="col-span-1">
            <label className="block font-medium">Ward Name</label>
            <input
              type="text"
              name="name"
              value={ward.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          {/* Department */}
          <div className="col-span-1">
            <label className="block font-medium">Department</label>
            <select
              name="departmentId"
              value={ward.departmentId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">Select</option>
              {departments.map((dept) => (
                <option
                  key={dept._id || dept.departmentId}
                  value={dept._id || dept.departmentId}
                >
                  {dept.deptName || dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="col-span-1">
            <label className="block font-medium">Type</label>
            <select
              name="type"
              value={ward.type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">----Select----</option>
              <option value="General">General</option>
              <option value="Semi-Private">Semi-Private</option>
              <option value="Private">Private</option>
              <option value="Deluxe / VIP">Deluxe / VIP</option>
              <option value="ICU">ICU</option>
              <option value="NICU">NICU</option>
              <option value="PICU">PICU</option>
              <option value="SICU">SICU</option>
              <option value="CCU">CCU</option>
              <option value="Burn Unit">Burn Unit</option>
              <option value="Isolation Ward">Isolation Ward</option>
              <option value="Day Care">Day Care</option>
              <option value="Maternity Ward">Maternity Ward</option>
              <option value="Emergency / Casualty">Emergency / Casualty</option>
            </select>
          </div>

          {/* Status */}
          <div className="col-span-1">
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={ward.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <BackButton />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateWard;

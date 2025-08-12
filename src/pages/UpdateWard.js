import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../component/BackButton";

const UpdateWard = () => {
  const { wardId } = useParams(); // This comes from the URL
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [ward, setWard] = useState({
    wardId: "",
    name: "",
    departmentId: "",
    type: "",
    status: ""
  });

  // Fetch all departments for dropdown
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // Fetch ward details to edit
  const fetchWardDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/wards/${wardId}`);

      // If backend sends { ward: {...} }
      const w = res.data.ward || res.data;

      setWard({
        wardId: w.wardId,
        name: w.name,
        departmentId: w.departmentId?._id || w.departmentId || "",
        type: w.type,
        status: w.status
      });
    } catch (err) {
      console.error("Error fetching ward details:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchWardDetails();
  }, [wardId]);

  // Handle input changes
  const handleChange = (e) => {
    setWard({
      ...ward,
      [e.target.name]: e.target.value
    });
  };

  // Update ward in backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/wards/${wardId}`, ward);
      navigate("/wardlist");
    } catch (err) {
      console.error("Error updating ward:", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md p-6 rounded">
        <BackButton />
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Update Ward
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ward ID (Read Only) */}
          <div>
            <label className="block mb-1 font-medium">Ward ID</label>
            <input
              type="text"
              name="wardId"
              value={ward.wardId}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Ward Name */}
          <div>
            <label className="block mb-1 font-medium">Ward Name</label>
            <input
              type="text"
              name="name"
              value={ward.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Department Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Department</label>
            <select
              name="departmentId"
              value={ward.departmentId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ward Type */}
          <div>
            <label className="block mb-1 font-medium">Ward Type</label>
            <input
              type="text"
              name="type"
              value={ward.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={ward.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              Update Ward
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateWard;

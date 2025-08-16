import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../component/BackButton";

const MedicineMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);

  const [medicine, setMedicine] = useState({
    _id: "",
    medicineId: "",
    name: "",
    genericName: "",
    unit: "",
    stock: 1,
    status: "Active"
  });

  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/units");
        setUnits(res.data || []);
      } catch {
        setUnits([]);
      }
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    const incoming = location.state?.medicine;
    if (incoming) {
      setIsEditMode(true);
      setMedicine({ ...incoming });
    } else {
      setIsEditMode(false);
      (async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/medicines/latest");
          setMedicine((p) => ({
            ...p,
            _id: "",
            medicineId: res.data?.medicineId || "MED0001",
            name: "",
            genericName: "",
            unit: "",
            stock: 1,
            status: "Active"
          }));
        } catch {
          setMedicine((p) => ({ ...p, medicineId: "MED0001" }));
        }
      })();
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "stock") {
      setMedicine((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
    } else {
      setMedicine((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode && medicine._id) {
        await axios.put(`http://localhost:5000/api/medicines/${medicine._id}`, medicine);
        alert("Medicine updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/medicines", medicine);
        alert("Medicine saved successfully!");
      }
      navigate("/MedicineList", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Error saving medicine");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-200 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Medicine" : "Add Medicine"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Medicine ID</label>
            <input type="text" value={medicine.medicineId} readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"/>
          </div>

          <div>
            <label className="block font-medium">Name</label>
            <input type="text" name="name" value={medicine.name}
              onChange={handleChange} required
              className="w-full border border-gray-300 p-1 rounded"/>
          </div>

          <div>
            <label className="block font-medium">Generic Name</label>
            <input type="text" name="genericName" value={medicine.genericName}
              onChange={handleChange} required
              className="w-full border border-gray-300 p-1 rounded"/>
          </div>

          <div>
            <label className="block font-medium">Unit</label>
            <select name="unit" value={medicine.unit}
              onChange={handleChange} required
              className="w-full border border-gray-300 p-1 rounded">
              <option value="">--Select--</option>
              {units.map((u) => (
                <option key={u._id || u.unitId} value={u.unitName}>
                  {u.unitName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Stock</label>
            <input type="number" name="stock" value={medicine.stock}
              onChange={handleChange} min="0"
              className="w-full border border-gray-300 p-1 rounded"/>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select name="status" value={medicine.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Discontinued">Discontinued</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-between mt-4">
            <BackButton />
            <button type="submit"
              className={`px-4 py-1 rounded text-white ${isEditMode ? "bg-yellow-500" : "bg-green-600"}`}>
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineMaster;

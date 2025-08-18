import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../component/BackButton";
import { useLocation, useNavigate } from "react-router-dom";

const ChargesMaster = () => {
  const [charge, setCharge] = useState({
    chargeId: "",
    item_type: "",
    item_id: "",
    description: "",
    rate: "",
    status: "Active",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [incomingCharge, setIncomingCharge] = useState(null);

  const [items, setItems] = useState([]); // list of items based on item_type

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch next chargeId
  useEffect(() => {
    const fetchNextChargeId = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/charges/latest");
        setCharge((prev) => ({ ...prev, chargeId: res.data?.chargeId || "CHARG0001" }));
      } catch (err) {
        console.error("Error fetching charge ID:", err);
      }
    };

    if (location.state?.charge) {
      const c = location.state.charge;
      setIncomingCharge(c);
      setIsEditMode(true);
      setCharge({
        _id: c._id,
        chargeId: c.chargeId,
        item_type: c.item_type,
        item_id: c.item_id,
        description: c.description,
        rate: c.rate,
        status: c.status,
      });
    } else {
      fetchNextChargeId();
      setIsEditMode(false);
    }
  }, [location.state]);

  // Load item list when item_type changes
  useEffect(() => {
    const fetchItems = async () => {
      if (!charge.item_type) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/charges/items/${charge.item_type}`);
        setItems(res.data || []);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };
    fetchItems();
  }, [charge.item_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharge({ ...charge, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/charges/${charge._id}`, charge);
        alert("Charge updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/charges", charge);
        alert("Charge saved successfully!");
      }
      navigate("/chargeslist", { replace: true });
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving charge");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Charge" : "Charges"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Charge ID</label>
            <input
              type="text"
              name="chargeId"
              value={charge.chargeId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Item Type</label>
            <select
              name="item_type"
              value={charge.item_type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">--Select--</option>
              {[
                "Department",
                "Doctor",
                "Service",
                "Service Rate",
                "Ward",
                "Bed",
                "Unit",
                "Vendor",
                "Inventory Item",
                "Speciality",
                "Medicine",
                "Generic Medicine",
                "Status",
                "Sample Test",
                "Investigation Test",
                "Insurance Provider",
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Item_ID</label>
            <select
              name="item_id"
              value={charge.item_id}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">--Select--</option>
              {items.map((it) => (
                <option key={it._id} value={it._id}>
                  {it.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={charge.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Rate</label>
            <input
              type="number"
              name="rate"
              value={charge.rate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={charge.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
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

export default ChargesMaster;

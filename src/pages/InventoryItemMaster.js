import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../component/BackButton";
import { useNavigate, useLocation } from "react-router-dom";

const InventoryItemMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [item, setItem] = useState({
    _id: "",
    itemId: "",
    itemName: "",
    itemCategory: "",
    unit: "",
    unitPieces: 1,
    reorderLevel: "",
    vendorId: "",
    status: "Active",
  });

  const [vendors, setVendors] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load vendors once
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vendors");
        setVendors(res.data || []);
      } catch {
        setVendors([]);
      }
    };
    fetchVendors();
  }, []);

  // Decide create vs edit + fetch next ID for create
  useEffect(() => {
    const incoming = location.state?.item;

    if (incoming) {
      // EDIT MODE
      setIsEditMode(true);
      setItem({
        _id: incoming._id || "",
        itemId: incoming.itemId || "",
        itemName: incoming.itemName || "",
        itemCategory: incoming.itemCategory || "",
        unit: incoming.unit || "",
        unitPieces:
          typeof incoming.unitPieces === "number"
            ? incoming.unitPieces
            : Number(incoming.unitPieces) || 1,
        reorderLevel:
          typeof incoming.reorderLevel === "number"
            ? incoming.reorderLevel
            : Number(incoming.reorderLevel) || 0,
        vendorId: incoming.vendorId || "",
        status: incoming.status || "Active",
      });
    } else {
      // CREATE MODE
      setIsEditMode(false);
      (async () => {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/inventory-items/latest"
          );
          setItem((prev) => ({
            ...prev,
            _id: "",
            itemId: res.data?.itemId || "INVEN0001",
            itemName: "",
            itemCategory: "",
            unit: "",
            unitPieces: 1,
            reorderLevel: "",
            vendorId: "",
            status: "Active",
          }));
        } catch (e) {
          console.error("Failed to fetch next inventory id", e);
          setItem((prev) => ({ ...prev, itemId: "INVEN0001" }));
        }
      })();
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // keep numerics as numbers
    if (name === "unitPieces" || name === "reorderLevel") {
      setItem((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
    } else {
      setItem((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode && item._id) {
        await axios.put(
          `http://localhost:5000/api/inventory-items/${item._id}`,
          item
        );
        alert("Item updated successfully!");
        navigate("/InventoryItemList", { replace: true });
      } else {
        await axios.post("http://localhost:5000/api/inventory-items", item);
        alert("Item saved successfully!");
        navigate("/InventoryItemList", { replace: true });
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving item");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Inventory Item" : "Inventory Item"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div>
            <label className="block font-medium">Item ID</label>
            <input
              type="text"
              name="itemId"
              value={item.itemId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={item.itemName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-1 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Item Category</label>
            <select
              name="itemCategory"
              value={item.itemCategory}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-1 rounded"
            >
              <option value="">--Select--</option>
              <option value="Medical">Medical</option>
              <option value="Surgical">Surgical</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Housekeeping">Housekeeping</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Unit</label>
            <select
              name="unit"
              value={item.unit}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-1 rounded"
            >
              <option value="">--Select--</option>
              <option value="Box">Box</option>
              <option value="Strip">Strip</option>
              <option value="Bottle">Bottle</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Unit Pieces</label>
            <input
              type="number"
              name="unitPieces"
              min="1"
              step="1"
              value={item.unitPieces}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              min="0"
              step="1"
              value={item.reorderLevel}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-1 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Vendor (optional)</label>
            <select
              name="vendorId"
              value={item.vendorId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
            >
              <option value="">--None--</option>
              {vendors.map((v) => (
                <option key={v._id || v.vendorId} value={v.vendorId}>
                  {v.vendorName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={item.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between mt-2">
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

export default InventoryItemMaster;

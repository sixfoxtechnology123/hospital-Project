import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../component/BackButton";

const InventoryItemList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inventory-items");
      setItems(res.data || []);
    } catch (e) {
      console.error("Failed to fetch items:", e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [location.key]);

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory-items/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Inventory Items</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate("/InventoryItemMaster")}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Item ID</th>
            <th className="border border-green-500 px-2 py-1">Name</th>
            <th className="border border-green-500 px-2 py-1">Category</th>
            <th className="border border-green-500 px-2 py-1">Unit</th>
            <th className="border border-green-500 px-2 py-1">Unit Pieces</th>
            <th className="border border-green-500 px-2 py-1">Reorder Level</th>
            <th className="border border-green-500 px-2 py-1">Vendor</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {items.length ? (
            items.map((it) => (
              <tr key={it._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{it.itemId}</td>
                <td className="border border-green-500 px-2 py-1">{it.itemName}</td>
                <td className="border border-green-500 px-2 py-1">{it.itemCategory}</td>
                <td className="border border-green-500 px-2 py-1">{it.unit}</td>
                <td className="border border-green-500 px-2 py-1">{it.unitPieces}</td>
                <td className="border border-green-500 px-2 py-1">{it.reorderLevel}</td>
                <td className="border border-green-500 px-2 py-1">
                  {it.vendorName || "—"}
                </td>
                <td className="border border-green-500 px-2 py-1">{it.status}</td>
                <td className="border border-green-500 px-2 py-1">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() =>
                        navigate("/InventoryItemMaster", { state: { item: it } }) // <-- fixed path casing
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteItem(it._id)}
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
              <td colSpan="9" className="text-center py-4 text-gray-500">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryItemList;

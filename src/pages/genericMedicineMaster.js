import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';

const GenericMedicineMaster = () => {
  const [generic, setGeneric] = useState({
    genericId: '',
    genericName: '',
    description: '',
    status: 'Active',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

 useEffect(() => {
  const fetchNextGenericId = async () => {
    try {
      // ✅ FIXED URL (must match backend mounting)
      const res = await axios.get("http://localhost:5000/api/generic-medicines/latest");
      setGeneric(prev => ({ ...prev, genericId: res.data?.genericId || "GENMED0001" }));
    } catch (err) {
      console.error("Error getting generic ID:", err);
    }
  };

  if (location.state?.generic) {
    const g = location.state.generic;
    setGeneric({
      _id: g._id,
      genericId: g.genericId || "",
      genericName: g.genericName || "",
      description: g.description || "",
      status: g.status || "Active",
    });
    setIsEditMode(true);
  } else {
    fetchNextGenericId();
    setIsEditMode(false);
  }
}, [location.state]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setGeneric({ ...generic, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/generic-medicines/${generic._id}`, generic);
        alert('Generic medicine updated successfully!');
      } else {
        await axios.post("http://localhost:5000/api/generic-medicines", generic);
        alert('Generic medicine saved successfully!');
      }
      navigate('/GenericMedicineList', { replace: true });
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving generic medicine');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? 'Update Generic Medicine' : 'Generic Medicine'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Generic ID</label>
            <input
              type="text"
              name="genericId"
              value={generic.genericId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Generic Name</label>
            <input
              type="text"
              name="genericName"
              value={generic.genericName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={generic.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={generic.status}
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
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericMedicineMaster;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';

const UnitMaster = () => {
  const [unit, setUnit] = useState({
    unitId: '',
    unitName: '',
    description: '',
    status: 'Active',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNextUnitId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/units/latest');
        setUnit(prev => ({ ...prev, unitId: res.data?.unitId || "UNIT0001" }));
      } catch (err) {
        console.error("Error getting unit ID:", err);
      }
    };

    if (location.state?.unit) {
      const u = location.state.unit;
      setUnit({
        _id: u._id,
        unitId: u.unitId || "",
        unitName: u.unitName || "",
        description: u.description || "",
        status: u.status || "Active",
      });
      setIsEditMode(true);
    } else {
      fetchNextUnitId();
      setIsEditMode(false);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnit({ ...unit, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/units/${unit._id}`, unit);
        alert('Unit updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/units', unit);
        alert('Unit saved successfully!');
      }
      navigate('/UnitList', { replace: true });
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving unit');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? 'Update Unit' : 'Unit Master'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Unit ID</label>
            <input
              type="text"
              name="unitId"
              value={unit.unitId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Unit Name</label>
            <input
              type="text"
              name="unitName"
              value={unit.unitName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={unit.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={unit.status}
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

export default UnitMaster;

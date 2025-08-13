import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';

const BedMaster = () => {
  const [bed, setBed] = useState({
    ward_name: '',
    bed_number: '',
    bed_type: '',
    status: 'Available',
  });

  const [wards, setWards] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch wards and check edit mode
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/wards');
        setWards(res.data);
      } catch (err) {
        console.error('Failed to fetch wards:', err);
      }
    };
    fetchWards();

    if (location.state?.bed) {
      setBed(location.state.bed);
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [location.state]);

  const handleWardChange = async (e) => {
    const wardName = e.target.value;
    setBed((prev) => ({ ...prev, ward_name: wardName }));

    if (!wardName) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/beds/next/${encodeURIComponent(wardName)}`
      );
      setBed((prev) => ({
        ...prev,
        bed_number: res.data.nextBedNumber
      }));
    } catch (err) {
      console.error('Failed to fetch next bed number:', err);
      setBed((prev) => ({ ...prev, bed_number: '' }));
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBed((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/beds/${bed._id}`, bed);
        alert('Bed updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/beds', bed);
        alert('Bed saved successfully!');
      }
      resetForm();
      navigate('/bedlist'); // go back to list page
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving bed');
    }
  };

  // Reset form
  const resetForm = () => {
    setBed({
      ward_name: '',
      bed_number: '',
      bed_type: '',
      status: 'Available',
    });
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Bed" : "Bed Master"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          {/* Ward Name */}
          <div>
            <label className="block font-medium">Ward Name</label>
            <select
              name="ward_name"
              value={bed.ward_name}
              onChange={handleWardChange}
              className="w-full border border-gray-300 p-1 rounded"
              required>
              <option value="">Select Ward</option>
              {wards.map((w) => (
                <option key={w._id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bed Number */}
          <div>
            <label className="block font-medium">Bed Number</label>
            <input
              type="text"
              name="bed_number"
              value={bed.bed_number}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          {/* Bed Type */}
          <div>
            <label className="block font-medium">Bed Type</label>
            <select
              name="bed_type"
              value={bed.bed_type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="General">General</option>
              <option value="Semi-Private">Semi-Private</option>
              <option value="Private">Private</option>
              <option value="ICU">ICU</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={bed.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
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

export default BedMaster;

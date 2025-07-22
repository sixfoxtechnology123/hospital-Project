import React, { useState} from 'react';
import axios from 'axios';

const ServiceRateMaster = () => {
  const [rows, setRows] = useState([
    {
      serviceCode: '',
      effectiveFrom: '',
      effectiveTo: '',
      serviceRate: '',
      doctorShare: '',
      hospitalShare: '',
      active: 'Yes',
    },
  ]);

  const [searchText, setSearchText] = useState('');

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    const newRow = {
      serviceCode: '',
      effectiveFrom: '',
      effectiveTo: '',
      serviceRate: '',
      doctorShare: '',
      hospitalShare: '',
      active: 'Yes',
    };
    setRows((prev) => [...prev, newRow]);
  };

const handleSave = async () => {
  try {
    for (let row of rows) {
      const payload = {
        ...row,
        serviceRate: Number(row.serviceRate),
        doctorShare: Number(row.doctorShare),
        hospitalShare: Number(row.hospitalShare),
      };

      // Remove _id if it exists
      delete payload._id;

      await axios.post('http://localhost:5000/api/service-rates', payload);
    }
    alert('Rates saved!');
  } catch (err) {
    console.error('Save error:', err);
    alert('Error saving rates.');
  }
};

  const handleSearch = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/service-rates?search=${searchText}`);

    if (res.data && Array.isArray(res.data)) {
      const formattedRows = res.data.map((row) => ({
        ...row,
        effectiveFrom: row.effectiveFrom ? row.effectiveFrom.split('T')[0] : '',
        effectiveTo: row.effectiveTo ? row.effectiveTo.split('T')[0] : '',
      }));

      setRows(formattedRows);
    }
  } catch (err) {
    console.error('Search error:', err);
  }
};


  return (
    <div className="p-6 bg-white shadow-lg rounded-md max-w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Service Rate Master</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by Service Code"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border px-2 py-1 rounded w-72"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-200 text-sm text-left">
            <th className="border px-2 py-1">Sl No.</th>
            <th className="border px-2 py-1">Service Code</th>
            <th className="border px-2 py-1">Effective From</th>
            <th className="border px-2 py-1">Effective To</th>
            <th className="border px-2 py-1">Service Rate</th>
            <th className="border px-2 py-1">Doctor Share</th>
            <th className="border px-2 py-1">Hospital Share</th>
            <th className="border px-2 py-1">Active (Yes/No)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="text-sm">
              <td className="border px-2 py-1">{idx + 1}</td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.serviceCode}
                  onChange={(e) => handleChange(idx, 'serviceCode', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="date"
                  value={row.effectiveFrom}
                  onChange={(e) => handleChange(idx, 'effectiveFrom', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="date"
                  value={row.effectiveTo}
                  onChange={(e) => handleChange(idx, 'effectiveTo', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.serviceRate}
                  onChange={(e) => handleChange(idx, 'serviceRate', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.doctorShare}
                  onChange={(e) => handleChange(idx, 'doctorShare', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.hospitalShare}
                  onChange={(e) => handleChange(idx, 'hospitalShare', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <select
                  value={row.active}
                  onChange={(e) => handleChange(idx, 'active', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-3">
        <button
          onClick={addRow}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Row
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ServiceRateMaster;

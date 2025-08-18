import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from "react-router-dom";

const InvestigationMaster = () => {
  const [test, setTest] = useState({
    testId: '',
    name: '',
    departmentId: '',
    sampleType: '',
    rate: '',
    status: 'Active',
  });

  const [departments, setDepartments] = useState([]);
  const [samples, setSamples] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomingTest, setIncomingTest] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
  const fetchSamples = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/samples");
      setSamples(res.data);
    } catch (err) {
      console.error("Failed to fetch samples:", err);
    }
  };

  fetchSamples();
}, []);
  // Load departments + check edit mode
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    const fetchNextTestId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/investigations/latest');
        const nextId = res.data?.testId || 'INVT0001';
        setTest(prev => ({ ...prev, testId: nextId }));
      } catch (err) {
        console.error('Error getting next Test ID:', err);
      }
    };

    fetchDepartments();

    if (location.state?.test) {
      const t = location.state.test;
      setIncomingTest(t);
      setIsEditMode(true);
      setTest(prev => ({
        ...prev,
        _id: t._id,
        testId: t.testId || '',
        name: t.name || '',
        departmentId: typeof t.departmentId === 'object' ? t.departmentId._id : t.departmentId || '',
        sampleType: t.sampleType || '',
        rate: t.rate || '',
        status: t.status || 'Active',
      }));
    } else {
      fetchNextTestId();
      setIsEditMode(false);
    }
  }, [location.state]);

  // 🔥 FIX: Remap departmentId after departments are loaded
  useEffect(() => {
    if (!isEditMode || !incomingTest || departments.length === 0) return;

    let deptId = '';
    if (incomingTest.departmentId) {
      deptId =
        typeof incomingTest.departmentId === 'object'
          ? incomingTest.departmentId._id
          : incomingTest.departmentId;
    } else if (incomingTest.departmentCode) {
      const match = departments.find(d => d.deptCode === incomingTest.departmentCode);
      if (match) deptId = match._id;
    }

    setTest(prev => ({ ...prev, departmentId: deptId }));
  }, [isEditMode, incomingTest, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTest({ ...test, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/investigations/${test._id}`, test);
        alert('Investigation updated successfully!');
        navigate('/investigationlist', { replace: true });
      } else {
        await axios.post('http://localhost:5000/api/investigations', test);
        alert('Investigation saved successfully!');
        navigate('/investigationlist', { replace: true });
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving investigation');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Investigation Test" : "Investigation Test"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Test ID</label>
            <input
              type="text"
              name="testId"
              value={test.testId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Test Name</label>
            <input
              type="text"
              name="name"
              value={test.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Department</label>
            <select
              name="departmentId"
              value={test.departmentId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">--Select--</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

      <div>
        <label className="block font-medium">Sample Type</label>
        <select
            name="sampleType"
            value={test.sampleType}
            onChange={handleChange}
            className="w-full border border-gray-300 p-1 rounded"
            required
        >
            <option value="">--Select--</option>
            {samples.map((sample) => (
            <option key={sample._id} value={sample.sampleName}>
                {sample.sampleName}
            </option>
            ))}
        </select>
        </div>


          <div>
            <label className="block font-medium">Rate</label>
            <input
              type="number"
              name="rate"
              value={test.rate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={test.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Discontinued">Discontinued</option>
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

export default InvestigationMaster;

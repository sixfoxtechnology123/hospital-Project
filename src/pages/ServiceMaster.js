import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from "react-router-dom";

const ServiceMaster = () => {
  const [service, setService] = useState({
    serviceId: '',
    serviceName: '',
    serviceCategory: '',
    departmentId: '',
    description: '',
    status: 'Active',
  });

  const [departments, setDepartments] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomingService, setIncomingService] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    const fetchNextServiceId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services/latest');
        const nextId = res.data?.serviceId || 'SRV0001';
        setService(prev => ({ ...prev, serviceId: nextId }));
      } catch (err) {
        console.error('Error getting service ID:', err);
      }
    };

    fetchDepartments();

    if (location.state?.service) {
      const s = location.state.service;
      setIncomingService(s);
      setIsEditMode(true);
      setService(prev => ({
        ...prev,
        _id: s._id,
        serviceId: s.serviceId || '',
        serviceName: s.serviceName || '',
        serviceCategory: s.serviceCategory || '',
        departmentId:
          typeof s.departmentId === 'object' ? s.departmentId._id : s.departmentId || '',
        description: s.description || '',
        status: s.status || 'Active',
      }));
    } else {
      fetchNextServiceId();
      setIsEditMode(false);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/services/${service._id}`, service);
        alert('Service updated successfully!');
        navigate('/servicelist', { replace: true });
      } else {
        await axios.post('http://localhost:5000/api/services', service);
        alert('Service saved successfully!');
        const res = await axios.get('http://localhost:5000/api/services/latest');
        setService({
          serviceId: res.data?.serviceId || 'SRV0001',
          serviceName: '',
          serviceCategory: '',
          departmentId: '',
          description: '',
          status: 'Active',
        });
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving service');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? "Update Service" : "Service Master"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Service ID</label>
            <input
              type="text"
              name="serviceId"
              value={service.serviceId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Service Name</label>
            <input
              type="text"
              name="serviceName"
              value={service.serviceName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Service Category</label>
            <select
              name="serviceCategory"
              value={service.serviceCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">--Select--</option>
              <option value="Lab">Lab</option>
              <option value="Procedure">Procedure</option>
              <option value="Surgery">Surgery</option>
              <option value="Imaging">Imaging</option>
              <option value="Consultation">Consultation</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Department</label>
            <select
              name="departmentId"
              value={service.departmentId}
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
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={service.status}
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

export default ServiceMaster;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data || []);
    } catch (e) {
      console.error('Failed to fetch services:', e);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Service</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/serviceMaster')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Service ID</th>
            <th className="border border-green-500 px-2 py-1">Service Name</th>
            <th className="border border-green-500 px-2 py-1">Category</th>
            <th className="border border-green-500 px-2 py-1">Department</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {services.length ? (
            services.map((svc) => (
              <tr key={svc._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{svc.serviceId}</td>
                <td className="border border-green-500 px-2 py-1">{svc.serviceName}</td>
                <td className="border border-green-500 px-2 py-1">{svc.serviceCategory}</td>
                <td className="border border-green-500 px-2 py-1">{svc.departmentName}</td>
                <td className="border border-green-500 px-2 py-1">{svc.status}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => navigate('/serviceMaster', { state: { service: svc } })}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Edit Service"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteService(svc._id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete Service"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No services found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;

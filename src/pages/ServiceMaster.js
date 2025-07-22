import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceMaster = () => {
  const [serviceCode, setServiceCode] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    generateServiceCode();
  }, []);

  const generateServiceCode = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      const services = res.data;

      let lastNumber = 0;

      if (services.length > 0) {
        const lastService = services[services.length - 1];
        const match = lastService.code.match(/SERV(\d+)/);
        if (match && match[1]) {
          lastNumber = parseInt(match[1]);
        }
      }

      const newNumber = lastNumber + 1;
      const newCode = `SERV${String(newNumber).padStart(4, '0')}`;
      setServiceCode(newCode);
    } catch (err) {
      console.error('Error generating code:', err);
      setServiceCode('SERV0001'); // default fallback
    }
  };

  const handleSave = async () => {
    const payload = {
      code: serviceCode,
      name: serviceName,
      department: departmentName,
    };

    try {
      await axios.post('http://localhost:5000/api/services', payload);
      alert('Service Saved');
      setServiceName('');
      setDepartmentName('');
      generateServiceCode();
    } catch (err) {
      alert('Failed to save service');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center  mb-6">Service Master</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Service Code</label>
          <input
            type="text"
            value={serviceCode}
            readOnly
            className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Service Name</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Service Department</label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ServiceMaster;

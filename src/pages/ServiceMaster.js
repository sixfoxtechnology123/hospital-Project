import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';

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
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Service Master</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Service Code</label>
          <input
            type="text"
            value={serviceCode}
            readOnly
            className="w-full p-1 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Service Name</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Service Department</label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>

        <div className="flex justify-between">
            <BackButton/>
            <button
              onClick={handleSave}
              className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700"
            >
              Save
            </button>
          </div>
      </div>
    </div>
  );
};

export default ServiceMaster;

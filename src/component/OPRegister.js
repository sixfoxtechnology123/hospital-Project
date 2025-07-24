import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const departments = [
  { name: 'Cardiology', code: 'CARD' },
  { name: 'Orthopedics', code: 'ORTHO' },
  { name: 'Neurology', code: 'NEURO' },
  { name: 'ENT', code: 'ENT' },
  { name: 'Dermatology', code: 'DERM' }
];

const OpRegister = () => {
  const location = useLocation();
  const { mrNumber, patientData } = location.state || {};  // ✅ Get mrNumber from route state

  const [opNumber, setOpNumber] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [validTill, setValidTill] = useState('');

  const formatDateTime = (dateObj) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return dateObj.toLocaleString('en-GB', options).replace(',', '');
  };

  // Generate OP number like OP0001
 let opCounter = 1;

const generateOpNumber = () => {
  const opNumber = `OP${String(opCounter).padStart(4, '0')}`;
  opCounter++;
  return opNumber;
};

  useEffect(() => {
    const now = new Date();
    setDateTime(formatDateTime(now));
    setValidTill(formatDateTime(now));
    setOpNumber(generateOpNumber());
  }, []);

  return (
      <form className="bg-white pt-1 px-2 mt-1  max-w-7xl mx-auto border border-gray-300 shadow text-sm">
      <div className=" text-white bg-teal-700 text-base flex justify-between p-1 font-semibold">
        <span className="ml-2">OP Registration Form</span>
      </div>

      <div className="md:grid grid-cols-4 gap-2 mb-2">
      <label className="flex flex-col col-span-1">
          <span className="text-black font-medium">MR Number</span>
          <input
            type="text"
            value={mrNumber}
            readOnly
            className="border-2 p-1"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-black font-medium">OP Number</span>
         <input
          type="text"
          value={opNumber}
          readOnly
          className="border-2 p-1"
          />
        </label>

         <label className="flex flex-col">
          <span className="text-black font-medium">OP Date & Time</span>
         <input
          type="text"
          value={dateTime}
          readOnly
          className="border-2 p-1"
          />
        </label> 

        <label className="flex flex-col">
          <span className="text-black font-medium">Payment Type</span>
        <select
          className="border-2 p-1"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Cash">Cash</option>
          <option value="Credit">Credit</option>
          <option value="Cheque">Cheque</option>
        </select>

        </label> <label className="flex flex-col">
          <span className="text-black font-medium">Category</span>
          <select
          className="border-2 p-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select</option>
          <option value="General">General</option>
          <option value="TPA">TPA</option>
          <option value="Insurance">Insurance</option>
        </select>
        </label>

        <label className="flex flex-col">
          <span className="text-black font-medium">Department</span>
          <select
          className="border-2 p-1"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select</option>
          {departments.map((dept) => (
            <option key={dept.code} value={dept.code}>
              {dept.name}
            </option>
          ))}
        </select>
        </label>

         <label className="flex flex-col">
          <span className="text-black font-medium">Visit Type</span>
          <input
          type="text"
          value="OP"
          readOnly
          className="border-2 p-1"
        />
        </label> 

         <label className="flex flex-col">
          <span className="text-black font-medium">Valid Till</span>
          <input
          type="text"
          value={validTill}
          readOnly
          className="border-2 p-1"
        />
        </label> 
        </div>
      </form>
    );
};
export default OpRegister;

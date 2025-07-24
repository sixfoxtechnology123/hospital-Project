import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

// install delete icon package
// npm install @heroicons/react

  // Generate OP number like OP0001
 let opCounter = 1;

const generateOpNumber = () => {
  const opNumber = `OP${String(opCounter).padStart(4, '0')}`;
  opCounter++;
  return opNumber;
};


const OpRegister = () => {
  const location = useLocation();
  const { mrNumber} = location.state || {};  //  Get mrNumber from route state
  const [departments, setDepartments] = useState([]);
  const [opNumber, setOpNumber] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [validTill, setValidTill] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [serviceList, setServicesList] = useState([]);



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
  const [services, setServices] = useState([
  {
    opNumber: opNumber,
    serviceCode: '',
    doctorCode: '',
    serviceCategory: '',
    unitPrice: 0,
    quantity: 1,
    discountPercent: 0,
    discountValue: 0,
    netAmount: 0
  }
]);

// Add Row
const addRow = () => {
  setServices([
    ...services,
    {
      opNumber: opNumber,
      serviceCode: '',
      doctorCode: '',
      serviceCategory: '',
      unitPrice: 0,
      quantity: 1,
      discountPercent: 0,
      discountValue: 0,
      netAmount: 0
    }
  ]);
};


// Handle field change
const handleServiceChange = (index, field, value) => {
  const updated = [...services];
  updated[index][field] = value;

  if (field === 'serviceCode') {
    const service = serviceList.find(s => s.code === value);
    updated[index].unitPrice = service ? service.price : 0;
  }

  const qty = parseFloat(updated[index].quantity || 0);
  const price = parseFloat(updated[index].unitPrice || 0);
  const discountPercent = parseFloat(updated[index].discountPercent || 0);
  const gross = qty * price;
  const discountValue = (gross * discountPercent) / 100;
  const net = gross - discountValue;

  updated[index].discountValue = discountValue;
  updated[index].netAmount = net;

  setServices(updated);
};

// Calculate totals
const grossTotal = services.reduce((sum, row) => sum + row.unitPrice * row.quantity, 0);
const discountTotal = services.reduce((sum, row) => sum + row.discountValue, 0);
const netTotal = services.reduce((sum, row) => sum + row.netAmount, 0);



    useEffect(() => {
      const now = new Date();
      const generatedOp = generateOpNumber();
      setOpNumber(generatedOp);
      setDateTime(formatDateTime(now));
      setValidTill(formatDateTime(now));

      // Now set initial services row with generated OP Number
      setServices([
        {
          opNumber: generatedOp,
          serviceCode: '',
          doctorCode: '',
          serviceCategory: '',
          unitPrice: 0,
          quantity: 1,
          discountPercent: 0,
          discountValue: 0,
          netAmount: 0,
        }
      ]);
    }, []);

    const deleteRow = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };
  

  useEffect(() => {
  const fetchDoctorsAndServices = async () => {
    try {
      const doctorRes = await axios.get("http://localhost:5000/api/doctors");
      const serviceRes = await axios.get("http://localhost:5000/api/services");
      setDoctors(doctorRes.data);
      setServicesList(serviceRes.data);
    } catch (error) {
      console.error("Failed to fetch doctors/services:", error);
    }
  };

  fetchDoctorsAndServices();
}, []);

  useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data); // Assuming response has [{ deptCode, deptName }]
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  fetchDepartments();
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
          <option value="Credit">Creit</option>
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
              <option key={dept.deptCode} value={dept.deptCode}>
                {dept.deptName}
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

    <div className=" text-white bg-teal-700 text-base flex justify-between p-1 font-semibold mt-3">
      <span className="ml-2">Service Table</span>
      </div>
      <table className="table-auto w-full border text-center mt-2 text-sm">
      <thead className="bg-teal-400">
        <tr>
          <th className="border p-1">OP Number</th>
          <th className="border p-1 w-36">Service Code</th>
          <th className="border p-1">Doctor/Service Name</th>
          <th className="border p-1">Service Category</th>
          <th className="border p-1">Unit Price</th>
          <th className="border p-1 w-20">Quantity</th>
          <th className="border p-1 w-24">Discount %</th>
          <th className="border p-1">Disc Value</th>
          <th className="border p-1">Net value</th>
          <th className="border p-1">Action</th>

        </tr>
      </thead>
      <tbody>
        {services.map((row, idx) => (
          <tr key={idx}>
            <td className="border p-1">{row.opNumber}</td>
            <td className="border p-1">
              <select
                className="w-full border"
                value={row.serviceCode}
                onChange={(e) => handleServiceChange(idx, 'serviceCode', e.target.value)}
              >
                <option value="">Select</option>
                {serviceList.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </td>
            <td className="border p-1">
              <select
                className="w-full border"
                value={row.doctorCode}
                onChange={(e) => handleServiceChange(idx, 'doctorCode', e.target.value)}
              >
                <option value="">Select</option>
                {doctors.map((d) => (
                  <option key={d.code} value={d.code}>{d.doctorName}</option>
                ))}
              </select>
            </td>
            <td className="border p-1">
              <input
                type="text"
                className="w-full border"
                value={row.serviceCategory}
                onChange={(e) => handleServiceChange(idx, 'serviceCategory', e.target.value)}
              />
            </td>
            {/* <td className="border p-1">{row.unitPrice}</td> */}
           <td className="border p-1">
            <input
              type="number"
              value={row.unitPrice}
              onChange={(e) => handleServiceChange(idx, 'unitPrice', e.target.value)}
              className="w-full px-1 border rounded"
            />
          </td>


            <td className="border p-1">
              <input
                type="number"
                value={row.quantity}
                className="w-full border"
                onChange={(e) => handleServiceChange(idx, 'quantity', e.target.value)}
              />
            </td>
            <td className="border p-1">
              <input
                type="number"
                value={row.discountPercent}
                className="w-full border"
                onChange={(e) => handleServiceChange(idx, 'discountPercent', e.target.value)}
              />
            </td>
            <td className="border p-1">{row.discountValue.toFixed(2)}</td>
            <td className="border p-1">{row.netAmount.toFixed(2)}</td>
            <td className="border p-1 text-center">
            <button
              type="button"
              onClick={() => deleteRow(idx)}
              title="Delete"
            >
              <TrashIcon className="h-5 w-5 text-red-600 inline" />
            </button>
          </td>

          </tr>
        ))}
          </tbody>
        </table>

      <div className="mt-4 flex justify-end">
        <div className="flex flex-col gap-2 text-sm w-64">
          <div className="border rounded-md px-4 py-2 bg-gray-50 shadow flex justify-between">
            <span className="text-gray-600">Gross Value:</span>
            <span className="font-semibold">₹ {grossTotal.toFixed(2)}</span>
          </div>

          <div className="border rounded-md px-4 py-2 bg-gray-50 shadow flex justify-between">
            <span className="text-gray-600">Discount:</span>
            <span className="font-semibold">₹ {discountTotal.toFixed(2)}</span>
          </div>

          <div className="border rounded-md px-4 py-2 bg-green-50 shadow flex justify-between">
            <span className="text-gray-600">Net Amount:</span>
            <span className="font-semibold text-green-700">₹ {netTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
        <div className="mt-4 mb-2 flex justify-between items-center">
          <button
            type="button"
            onClick={addRow}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Services
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Payment
          </button>
        </div>


      </form>
    );
};
export default OpRegister;

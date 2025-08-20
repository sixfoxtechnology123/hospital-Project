import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import BackButton from './BackButton';
import Sidebar from './Sidebar';

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
  const { mrNumber, patientData } = location.state || {}; //  Get mrNumber from route state
  const [departments, setDepartments] = useState([]);
  const [opNumber, setOpNumber] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [validTill, setValidTill] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [serviceList, setServicesList] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [netTotals, setNetTotal] = useState(0);
  

const toggleSection = (section) => {
  setActiveSection((prevSection) => (prevSection === section ? '' : section));
};
console.log(netTotals)

useEffect(() => {
  if (patientData) {
    setName(patientData.name || '');
    setMobile(patientData.mobile || '');
    setAddress(patientData.address || '');
  }
}, [patientData]);

 const [rows, setRows] = useState([
    {
      opNumber: "OP0001",
      paymentType: "Cash",
      paymentMode: "Cash",
      amount: "",
      cardNo: "",
      bank: "",
      cardValidDate: "",
    },
  ]);

  const handleAddRow = (e) => {
    e.preventDefault();
    setRows([
      ...rows,
      {
        opNumber: "OP0001",
        paymentType: "Cash",
        paymentMode: "Cash",
        amount: "",
        cardNo: "",
        bank: "",
        cardValidDate: "",
      }
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  const net = Number(netTotal);

  const totalPayment = rows.reduce((sum, row) => {
    const amt = Number(row.amount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  if (net === totalPayment) {
    try {
      const formData = {
        mrNumber,
        opNumber,
        dateTime,
        category,
        paymentType,
        department,
        validTill,
        name,
        mobile,
        address,
        services,
        payments: rows,
        grossTotal,
        discountTotal,
        netTotal
      };

      await axios.post('http://localhost:5000/api/op/register', formData);
      alert('Submitted successfully!');

      // Reset
      setServices([
        {
          opNumber: opNumber,
          serviceCode: '',
          doctorCode: '',
          serviceCategory: '',
          unitPrice: '',
          quantity: 1,
          discountPercent: '',
          discountValue: 0,
          netAmount: 0
        }
      ]);
      setRows([
        {
          opNumber: opNumber,
          paymentType: 'Cash',
          paymentMode: 'Cash',
          amount: '',
          cardNo: '',
          bank: '',
          cardValidDate: ''
        }
      ]);
      setNetTotal(0);

    } catch (err) {
      console.error("Error saving OP data:", err);
      alert("Failed to submit. Check console for details.");
    }

  } else {
    alert(`Mismatch. Net Amount: ₹${net}, Payment Amount: ₹${totalPayment}`);
  }
};


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
    unitPrice: '',
    quantity: 1,
    discountPercent: '',
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
      unitPrice: '',
      quantity: 1,
      discountPercent: '',
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
  const gross = qty * price;

  let discountPercent = parseFloat(updated[index].discountPercent || 0);
  let discountValue = parseFloat(updated[index].discountValue || 0);

  if (field === 'discountPercent') {
    discountValue = (gross * discountPercent) / 100;
    updated[index].discountValue = discountValue;
  } else if (field === 'discountValue') {
    discountPercent = gross ? (discountValue / gross) * 100 : 0;
    updated[index].discountPercent = discountPercent;
  }

  const net = gross - discountValue;

  updated[index].netAmount = net;
  setServices(updated);
};


// Calculate totals
const grossTotal = services.reduce((sum, row) => sum + row.unitPrice * row.quantity, 0);
const discountTotal = services.reduce(
  (sum, row) => sum + Number(row.discountValue || 0),
  0
);

const netTotal = services.reduce((sum, row) => sum + row.netAmount, 0);

useEffect(() => {
    if (category === 'General') {
      setPaymentType('Cash');
    } else if (category === 'TPA' || category === 'Insurance') {
      setPaymentType('Credit');
    } else {
      setPaymentType('');
    }
  }, [category]);

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
          unitPrice: '',
          quantity: 1,
          discountPercent: '',
          discountValue: 0,
          netAmount: 0,
        }
      ]);
    }, []);

    //delete services
    const deleteRow = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  //delete payment
  const deletePaymentRow = (index) => {
  const updatedRows = [...rows];
  updatedRows.splice(index, 1);
  setRows(updatedRows);
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
    <div className="flex min-h-screen flex-col  md:flex-row">
      <Sidebar/>
       <div className="flex-1 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white pt-2 px-3 w-full  mx-auto border-2 border-gray-300 shadow text-sm md:text-sm">
      <div className=" text-white bg-teal-700 text-base flex justify-between p-1 font-semibold">
        <span className="ml-2">OP Registration Form</span>
      </div>

      <div className="md:grid grid-cols-5 gap-2 mb-2">
      <label className="flex flex-col col-span-1">
          <span className="text-black font-medium cursor-not-allowed">MR Number</span>
          
          <input
            type="text"
            value={mrNumber}
            readOnly
            className="border-2 p-1"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-black font-medium cursor-not-allowed">OP Number</span>
         <input
          type="text"
          value={opNumber}
          readOnly
          className="border-2 p-1"
          />
        </label>

         <label className="flex flex-col">
          <span className="text-black font-medium cursor-not-allowed">OP Date & Time</span>
         <input
          type="text"
          value={dateTime}
          readOnly
          className="border-2 p-1"
          />
        </label>

     
       <label className="flex gap-1 w-full">
         <div className="flex flex-col w-2/4">
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
      </div>

      <div className="flex flex-col w-2/4">
        <span className="text-black font-medium">Payment Type</span>
        <select
          className="border-2 p-1 cursor-not-allowed" disabled 
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Cash">CASH</option>
          <option value="Credit">CREDIT</option>
        </select>
        </div>
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
          <span className="text-black font-medium cursor-not-allowed">Visit Type</span>
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
        <label className="flex flex-col col-span-1">
          <span className="text-black font-medium cursor-not-allowed">Name</span>
          <input
            type="text"
            value={name}
            readOnly
            className="border-2 p-1"
          />
        </label>

        <label className="flex flex-col col-span-1">
          <span className="text-black font-medium cursor-not-allowed">Mobile No.</span>
          <input
            type="text"
            value={mobile}
            readOnly
            className="border-2 p-1"
          />
        </label>

        <label className="flex flex-col col-span-1">
          <span className="text-black font-medium cursor-not-allowed">Address</span>
          <input
            type="text"
            value={address}
            readOnly
            className="border-2 p-1"
          />
        </label>

      </div>
       <div className="flex gap-4 my-4">
        <button
          type="button"
          onClick={() => toggleSection('service')}
          className={`px-4 py-1 rounded font-medium transition-colors duration-300 ${
            activeSection === 'service'
              ? 'bg-teal-700 text-white'
              : 'bg-gray-200 text-black hover:bg-teal-100'
          }`}
        >
          Service
        </button>

        <button
          type="button"
          onClick={() => toggleSection('payment')}
          className={`px-4 py-1 rounded font-medium transition-colors duration-300 ${
            activeSection === 'payment'
              ? 'bg-green-700 text-white'
              : 'bg-gray-200 text-black hover:bg-green-100'
          }`}
        >
          Payment
        </button>
        <BackButton/>
      </div>

        {activeSection === 'service' && (
        <>
      {/* <div className=" text-white bg-teal-700 text-base flex justify-between p-1 font-semibold mt-3">
      <span className="ml-2">Service</span>
      </div> */}
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
          <th className="border p-1 w-28">Disc Value</th>
          <th className="border p-1 w-40">Net value</th>
          <th className="border p-1">Action</th>

        </tr>
      </thead>
      <tbody>
        {services.map((row, idx) => (
          <tr key={idx}>
            <td className="border p-1"></td>
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
                <td className="border p-1">
                  <input
                    type="number"
                    step="0.01"
                    value={row.discountValue || ''}
                    onChange={(e) => handleServiceChange(idx, 'discountValue', e.target.value)}
                    className="w-full px-1 border border-gray-300 rounded"
                  />
                </td>
            <td className="border p-1">{Number(row.netAmount || 0).toFixed(2)}</td>
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
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">
            Add Services
          </button>

          <button
            type="submit"
             onClick={() => setActiveSection('payment')}
            className="px-4 py-2 bg-green-600 text-white rounded font-semibold">
            Go To Payment
          </button>
        </div>
        </>
      )}


      {activeSection === 'payment' && (
        <>
        <div className="overflow-x-auto">
       {/* <div className=" text-white bg-teal-700 text-base flex justify-between p-1 font-semibold mt-3">
      <span className="ml-2">Payment</span>
      </div> */}
        <table className="min-w-full mt-2 bg-gray-900 text-white border border-gray-700">
          <thead>
            <tr className="text-left">
              <th className="p-2 border-b border-gray-700">OPNumber</th>
              <th className="p-2 border-b border-gray-700">Payment Type</th>
              <th className="p-2 border-b border-gray-700">Payment Mode</th>
              <th className="p-2 border-b border-gray-700">Amount</th>
              <th className="p-2 border-b border-gray-700">Card No</th>
              <th className="p-2 border-b border-gray-700">Bank</th>
              <th className="p-2 border-b border-gray-700">Card Valid Date</th>
              <th className="p-2 border-b border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isCard = row.paymentMode === "Card";
              return (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-2"></td>  
                  {/* {row.opNumber} */}
                  <td className="p-2">
                    <select
                      value={row.paymentType}
                      onChange={(e) =>
                        handleInputChange(index, "paymentType", e.target.value)
                      }
                      className="bg-gray-800 text-white p-1 border border-gray-600"
                    >
                      <option value="Cash">Cash</option>
                      <option value="TPA">Other</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      value={row.paymentMode}
                      onChange={(e) =>
                        handleInputChange(index, "paymentMode", e.target.value)
                      }
                      className="bg-gray-800 text-white p-1 border border-gray-600"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.amount}
                      onChange={(e) =>
                        handleInputChange(index, "amount", e.target.value)
                      }
                      className="bg-gray-800 text-white p-1 border border-gray-600"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.cardNo}
                      onChange={(e) =>
                        handleInputChange(index, "cardNo", e.target.value)
                      }
                      className="bg-gray-800 text-white p-1 border border-gray-600"
                      disabled={!isCard}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.bank}
                      onChange={(e) =>
                        handleInputChange(index, "bank", e.target.value)
                      }
                      className="bg-gray-800 text-white p-1 border border-gray-600"
                      disabled={!isCard}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="month"
                      value={row.cardValidDate}
                      onChange={(e) =>
                        handleInputChange(index, "cardValidDate", e.target.value)
                      }
                      className="bg-gray-800 text-white p-1 border border-gray-600"
                      disabled={!isCard}
                    />
                  </td>
                   <td key={index} className='text-center'>
                      <button
                        type="button"
                        onClick={() => deletePaymentRow(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
          <div className="mt-4 mb-2 flex justify-between items-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 font-semibold text-white px-4 py-2 rounded"
          onClick={handleAddRow}
        >
          Add Payment
        </button>
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          className="border p-1"
        />

        <button
          type="submit"
          className="bg-green-600 font-semibold hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
        </>
      )}
      </form>
      </div>
      </div>
    );
};
export default OpRegister;

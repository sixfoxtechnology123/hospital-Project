import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientsPage = () => {
  const navigate = useNavigate();
  const [showTransactionMenu, setShowTransactionMenu] = useState(false);
  const transactionRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (transactionRef.current && !transactionRef.current.contains(event.target)) {
        setShowTransactionMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-300">
      {/* Top Navbar */}
      <header className="bg-teal-600 text-white p-4 shadow-md flex items-center justify-between relative">

        <nav className="space-x-6 text-xl relative flex items-center">
          <button onClick={() => navigate('/')} className="hover:underline">Home</button>
          
          {/* Transaction with Dropdown */}
          <div className="inline-block relative" ref={transactionRef}>
            <button
              onClick={() => setShowTransactionMenu(!showTransactionMenu)}
              className="hover:underline"
            >
              Master
            </button>

            {showTransactionMenu && (
              <div className="absolute left-full transform -translate-x-1/2 mt-2 bg-white text-black shadow-lg rounded-md z-50 w-44">
                <ul className="flex flex-col text-base">
                  <li className="hover:bg-teal-100 px-4 py-2 rounded cursor-pointer" onClick={() => navigate('/PatientsRegister')}>Register</li>
                  <li className="hover:bg-teal-100 px-4 py-2 rounded cursor-pointer" onClick={() => navigate('/departmentMaster')}>Department Master</li>
                  <li className="hover:bg-teal-100 px-4 py-2 rounded cursor-pointer" onClick={() => navigate('/doctorMaster')}>Doctor Master</li>
                  <li className="hover:bg-teal-100 px-4 py-2 rounded cursor-pointer" onClick={() => navigate('/serviceMaster')}>Service Master</li>
                  <li className="hover:bg-teal-100 px-4 py-2 rounded cursor-pointer" onClick={() => navigate('/serviceRateMaster')}>Service Rate Master</li>
                </ul>
              </div>
            )}
          </div>

          {/* Transaction  */}
          <button onClick={() => navigate('')} className="hover:underline">Transaction</button>

          {/* report section */}
          <button onClick={() => navigate('')} className="hover:underline">Report</button>
        </nav>
        <h1 className="text-2xl font-bold">Hospital</h1>
      </header>
    </div>
  );
};

export default PatientsPage;

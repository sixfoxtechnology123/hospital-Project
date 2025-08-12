import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHospitalAlt, FaBed, FaBuilding } from 'react-icons/fa';  // added FaBuilding for department
import BackButton from '../component/BackButton';

const WardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8"> {/* changed to 3 columns */}
        {/* Ward Master */}
        <div
          onClick={() => navigate('/wardList')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaHospitalAlt size={60} className="text-teal-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Ward Master
          </h2>
        </div>

        {/* Bed Master */}
        <div
          onClick={() => navigate('/Bedlist')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaBed size={60} className="text-purple-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Bed Master
          </h2>
        </div>

        {/* Department Master */}
        <div
          onClick={() => navigate('/departmentList')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaBuilding size={60} className="text-blue-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Department Master
          </h2>
        </div>
      </div>
      <div className="mt-8 w-full flex justify-center">
        <BackButton />
      </div>
    </div>
  );
};

export default WardPage;

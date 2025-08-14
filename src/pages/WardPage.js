import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHospitalAlt, FaBed, FaBuilding, FaUserMd,FaRupeeSign, FaCogs, FaTruck } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const WardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-200">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-8">
        {/* Department Master */}
        <div
          onClick={() => navigate('/departmentList')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaBuilding size={60} className="text-blue-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Department
          </h2>
        </div>

        {/* Doctor Master */}
        <div
          onClick={() => navigate('/doctorlist')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaUserMd size={60} className="text-red-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Doctor
          </h2>
        </div>
          {/* Service Master */}
        <div
          onClick={() => navigate('/servicelist')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaCogs size={60} className="text-green-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Service
          </h2>
        </div>
         {/* Service Rate Master */}
        <div
          onClick={() => navigate('/serviceratelist')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaRupeeSign size={60} className="text-yellow-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Service Rate
          </h2>
        </div>
        {/* Ward Master */}
        <div
          onClick={() => navigate('/wardList')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaHospitalAlt size={60} className="text-teal-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Ward
          </h2>
        </div>

        {/* Bed Master */}
        <div
          onClick={() => navigate('/Bedlist')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaBed size={60} className="text-purple-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Bed
          </h2>
        </div>
         {/* Vendor Master */}
        <div
          onClick={() => navigate('/vendorlist')}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
        >
          <FaTruck size={60} className="text-orange-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Vendor
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

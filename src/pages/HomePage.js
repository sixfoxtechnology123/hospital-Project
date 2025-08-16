import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserInjured, FaProcedures, FaStethoscope, FaCheckCircle } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Welcome to CLINIX</h1>

      <div className="flex gap-10 flex-wrap justify-center">
        {/* Patients Box */}
        <div
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-blue-100 transition"
          onClick={() => navigate('/patients')}
        >
          <FaUserInjured size={50} className="mx-auto text-blue-500" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Patients
          </h2>
        </div>

        {/* Ward Box */}
        <div
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
          onClick={() => navigate('/wardpage')}
        >
          <FaProcedures size={50} className="mx-auto text-green-500" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Ward
          </h2>
        </div>

        {/* Speciality Box */}
        <div
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-purple-100 transition"
          onClick={() => navigate('/SpecialityPage')}
        >
          <FaStethoscope size={50} className="mx-auto text-purple-500" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Speciality
          </h2>
        </div>

        {/* Status Box */}
        <div
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-yellow-100 transition"
          onClick={() => navigate('/statuspage')}
        >
          <FaCheckCircle size={50} className="mx-auto text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Status
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

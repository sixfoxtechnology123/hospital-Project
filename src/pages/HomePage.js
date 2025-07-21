import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserInjured } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Welcome to Hospital Portal</h1>
      
      <div
        className="p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-blue-100 transition"
        onClick={() => navigate('/patients')}
      >
        <FaUserInjured size={50} className="mx-auto text-blue-500" />
        <h2 className="mt-4 text-xl font-semibold">Patients</h2>
      </div>
    </div>
  );
};

export default HomePage;

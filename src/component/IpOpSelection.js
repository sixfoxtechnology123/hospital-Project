import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaProcedures } from 'react-icons/fa';

const IpOpSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] p-6">
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl w-full max-w-2xl p-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-wide">
          Purpose
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* OP Button */}
          <div
            onClick={() => navigate('/op-registration')}
            className="cursor-pointer group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 hover:bg-blue-100 hover:scale-105 shadow-md"
          >
            <FaUserMd className="text-blue-700 text-5xl mb-4 transition-transform group-hover:rotate-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Out-Patient(OP)</h2>
          </div>

          {/* IP Button */}
          <div
            onClick={() => navigate('/ip-registration')}
            className="cursor-pointer group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 hover:bg-purple-100 hover:scale-105 shadow-md"
          >
            <FaProcedures className="text-purple-700 text-5xl mb-4 transition-transform group-hover:-rotate-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-1">In-Patient(IN)</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IpOpSelection;

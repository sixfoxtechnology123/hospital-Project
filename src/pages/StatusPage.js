import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; 
import BackButton from "../component/BackButton";

const StatusPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Status Master */}
        <div
          onClick={() => navigate("/StatusList")}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-yellow-200 transition"
        >
          <FaCheckCircle size={60} className="text-green-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Status
          </h2>
        </div>

      </div>

      <div className="mt-8 w-full flex justify-center">
        <BackButton />
      </div>
    </div>
  );
};

export default StatusPage;

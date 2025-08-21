import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const Header = ({ search, setSearch, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "all", label: "Register All Patients", path: "/PatientsList" },
    { id: "ipd", label: "IPD List", path: " " },
    { id: "opd", label: "OPD List", path: " " },
    { id: "emergency", label: "Emergency List", path: " " },
  ];

  return (
    <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-3 mb-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {/* Tabs (scrollable on small devices) */}
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap w-full md:w-auto pb-1 md:pb-0">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium shrink-0 transition
                ${
                  activeTab === item.id || location.pathname === item.path
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-700 border border-green-400 hover:bg-green-100"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 rounded-md text-sm font-medium bg-white text-blue-700 border border-green-400 hover:bg-green-100 inline-flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Home button */}
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1 rounded-md text-sm font-medium bg-white text-green-700 border border-green-400 hover:bg-green-100 inline-flex items-center gap-2"
          >
            <FaHome className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by Name, Email, MR Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 md:flex-none bg-white text-black border border-green-400 rounded px-3 py-1 text-sm min-w-[150px] sm:min-w-[200px] md:min-w-[250px] focus:outline-none"
          />

          {/* New Register button */}
          <button
            onClick={() => navigate("/PatientsRegister")}
            className="px-4 py-1 rounded-lg text-sm font-semibold bg-green-600 text-white shadow hover:bg-green-700 w-full sm:w-auto"
          >
            New Register
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-bold text-green-800 text-center mt-3">
        Registered Patients List
      </h2>
    </div>
  );
};

export default Header;

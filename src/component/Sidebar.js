import React, { useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  BedDouble,
  Stethoscope,
  AlertTriangle,
  Menu,
  X,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  Home,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Get latest patient data from state or localStorage
  const patientData = useMemo(() => {
    try {
      return (
        location.state?.patientData ||
        JSON.parse(localStorage.getItem("patientFormData") || "null")
      );
    } catch {
      return null;
    }
  }, [location.state]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-3">
        <h2 className="text-lg font-bold">Patient Management</h2>
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:static md:translate-x-0 md:flex md:flex-col
        ${isOpen ? "md:w-56" : "md:w-16"} 
        md:min-h-screen`}
      >
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="hidden md:block text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ArrowBigLeftDash size={22} /> : <ArrowBigRightDash size={22} />}
          </button>
          <button
            className="md:hidden text-white p-2 ml-auto"
            onClick={() => setMobileOpen(false)}
          >
            <X size={28} />
          </button>
        </div>

        {isOpen && (
          <h2 className="hidden md:block text-xl font-bold mb-6">
            Patient Management
          </h2>
        )}

        {/* Links */}
        <ul className="space-y-3">
          <li>
            <NavLink
              to="/PatientsList"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Home size={20} />
              {isOpen && <span>Patients List</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/PatientUpdatePage"
              state={{ patientData }}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Users size={20} />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ip-registration"
              state={{ patientData }}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <BedDouble size={20} />
              {isOpen && <span>IPD Registration</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/op-registration"
              state={{ patientData }}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Stethoscope size={20} />
              {isOpen && <span>OPD Registration</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/emergency"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <AlertTriangle size={20} />
              {isOpen && <span>Emergency</span>}
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

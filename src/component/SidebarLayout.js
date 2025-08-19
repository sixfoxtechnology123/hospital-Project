// SidebarLayout.js
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Users, BedDouble, Stethoscope, AlertTriangle, Menu, X } from "lucide-react";

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block w-56 bg-gray-800 text-white p-4 space-y-4 min-h-screen">
        <h2 className="text-xl font-bold mb-6">Patient Management</h2>

        <ul className="space-y-3">
          <li>
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <Users size={20} /> Patients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ipd"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <BedDouble size={20} /> IPD
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/opd"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <Stethoscope size={20} /> OPD
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
            >
              <AlertTriangle size={20} /> Emergency
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-56 p-4 space-y-4 transform transition-transform duration-300 z-50 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Patient Management</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={28} className="text-white" />
          </button>
        </div>

        <ul className="space-y-3 mt-6">
          <li>
            <NavLink
              to="/patients"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <Users size={20} /> Patients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ipd"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <BedDouble size={20} /> IPD
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/opd"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <Stethoscope size={20} /> OPD
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/emergency"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <AlertTriangle size={20} /> Emergency
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Hamburger Button (mobile only) */}
      <button
        className="absolute top-4 left-4 md:hidden z-50 bg-gray-800 text-white p-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;

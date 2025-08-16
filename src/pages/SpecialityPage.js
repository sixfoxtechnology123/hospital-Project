import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaBoxes, FaStethoscope, FaPills } from "react-icons/fa";
import BackButton from "../component/BackButton";

const SpecialityPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* Vendor Master */}
        <div
          onClick={() => navigate("/vendorlist")}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-blue-200 transition"
        >
          <FaTruck size={60} className="text-orange-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Vendor
          </h2>
        </div>

        {/* Inventory Item Master */}
        <div
          onClick={() => navigate("/InventoryItemList")}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-blue-200 transition"
        >
          <FaBoxes size={60} className="text-indigo-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Inventory Item
          </h2>
        </div>

        {/* Speciality Master */}
        <div
          onClick={() => navigate("/SpecialtyList")}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-blue-200 transition"
        >
          <FaStethoscope size={60} className="text-green-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Speciality
          </h2>
        </div>

        {/* Generic Medicine */}
        <div
          onClick={() => navigate("/GenericMedicineList")}
          className="group p-8 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-blue-200 transition"
        >
          <FaPills size={60} className="text-red-600 mb-4" />
          <h2 className="mt-4 text-xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Generic Medicine
          </h2>
        </div>
      </div>

      <div className="mt-8 w-full flex justify-center">
        <BackButton />
      </div>
    </div>
  );
};

export default SpecialityPage;

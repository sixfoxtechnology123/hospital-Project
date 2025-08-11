import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 bg-blue-700 font-semibold  text-white px-4 py-1 rounded"
    >
      <FaArrowLeft className="text-sm" />
      {label}
    </button>
  );
};

export default BackButton;

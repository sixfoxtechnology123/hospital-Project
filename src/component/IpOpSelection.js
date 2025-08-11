import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserMd, FaProcedures } from 'react-icons/fa';
import BackButton from './BackButton';

const IpOpSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state || {};
  const patientData = locationState.patientData || {};
  const mrNumber = locationState.mrNumber || patientData.mrno || '';
  const wardName = locationState.wardName || '';


  const goToIP = () => {
    navigate('/ip-registration', {
      state: {
        mrNumber,
        patientData: {
          name: patientData?.name || '',
          age: patientData?.age || '',
          sex: patientData?.sex || '',
          ageSex: `${patientData?.age || ''}/${patientData?.sex || ''}`,
          fatherOrSpouse: patientData?.fatherOrSpouse || '',
          dob: patientData?.dob || '',
          mobile: patientData?.mobile || '',
          address1: patientData?.address1 || '',
          address2: patientData?.address2 || '',
          location: patientData?.location || '',
          city: patientData?.city || '',
          state: patientData?.state || '',
          maritalStatus: patientData?.maritalStatus || '',
          religion: patientData?.religion || '',
          email: patientData?.email || '',
          bloodGroup: patientData?.bloodGroup || '',
          occupation: patientData?.occupation || '',
          aadhar: patientData?.aadhar || '',
          abhaId: patientData?.abhaId || ''
        },
       wardName
      }
    });
  };

  const goToOP = () => {
    navigate('/op-registration', {
      state: {
        mrNumber,
        patientData: {
          name: patientData?.name || '',
          mobile: patientData?.mobile || '',
          address: patientData?.address1 || ''
        }
      }
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] p-6">
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl w-full max-w-2xl p-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-wide">
          Purpose
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* OP Button */}
        <div
           onClick={goToOP}


            className="cursor-pointer group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 hover:bg-blue-100 hover:scale-105 shadow-md"
          >
            <FaUserMd className="text-blue-700 text-5xl mb-4 transition-transform group-hover:rotate-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Out-Patient(OP)</h2>
          </div>

          {/* IP Button */}
          <div
            onClick={goToIP}
            className="cursor-pointer group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 hover:bg-purple-100 hover:scale-105 shadow-md"
          >
            <FaProcedures className="text-purple-700 text-5xl mb-4 transition-transform group-hover:-rotate-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-1">In-Patient(IN)</h2>
          </div>
          <div>
            <BackButton/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IpOpSelection;
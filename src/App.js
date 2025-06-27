import React, { useState } from 'react';
import PatientsRegister from './component/PatientsRegister';
import AdminLoginPage from './component/AdminLoginPage';
import PatientsList from './component/PatientsList';

const App = () => {
  const [showForm, setShowForm] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {isAdminLoggedIn ? (
        <PatientsList
          setIsAdminLoggedIn={setIsAdminLoggedIn}
          setShowForm={setShowForm}
        />
      ) : showForm ? (
        <>
          <PatientsRegister />
          <button
            onClick={() => setShowForm(false)}
            className="block mx-auto text-white text-xl pt-2 pb-2 pr-4 pl-4 rounded-md mt-2 bg-green-600 font-bold"
          >
            Admin Login
          </button>
        </>
      ) : (
        <>
          <AdminLoginPage onLogin={() => setIsAdminLoggedIn(true)} />
          <button
            onClick={() => setShowForm(true)}
            className="block mx-auto mt-4 bg-green-600 text-white text-lg font-semibold py-2 px-4 rounded-md"
          >
            Patients New Registration
          </button>
        </>
      )}
    </div>
  );
};

export default App;

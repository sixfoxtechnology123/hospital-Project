import { Routes, Route } from 'react-router-dom';
import PatientsRegister from './component/PatientsRegister';
import OpIpSelection from './component/IpOpSelection';
import OpForm from './component/OPRegister';
import HomePage from './pages/HomePage';
import PatientsPage from './pages/PatientsPage';
import DepartmentMaster from './pages/DepartmentMaster';
import DoctorMaster from './pages/DoctorMaster';
import ServiceMaster from './pages/ServiceMaster';
import ServiceRateMaster from './pages/ServiceRateMaster';
import IPRegistration from './component/IPRegistration';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/PatientsRegister" element={<PatientsRegister />} />
        <Route path="/select" element={<OpIpSelection />} />
        <Route path="/op-registration" element={<OpForm />} />
        <Route path="/ip-registration" element={<IPRegistration/>} />
        <Route path="/departmentMaster" element={<DepartmentMaster/>} />
        <Route path="/doctorMaster" element={<DoctorMaster/>} />
        <Route path="/serviceMaster" element={<ServiceMaster/>} />
        <Route path="/serviceRateMaster" element={<ServiceRateMaster/>} />
        
      </Routes>
    </div>
  );
}

export default App;

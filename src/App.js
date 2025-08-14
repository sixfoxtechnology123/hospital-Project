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
import WardMaster from './pages/WardMaster';
import WardList from './pages/WardList';
import WardPage from './pages/WardPage';
import BedMaster from './pages/BedMaster';
import BedList from './pages/BedList';
import DepartmentList from './pages/DepartmentList';
import DoctorList from './pages/DoctorList';
import ServiceList from './pages/ServiceList';
import ServiceRateList from './pages/ServiceRateList';
import VendorMaster from './pages/VendorMaster';
import VendorList from './pages/VendorList';

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
        <Route path="/departmentlist" element={<DepartmentList/>} />
        <Route path="/doctorMaster" element={<DoctorMaster/>} />
        <Route path="/doctorlist" element={<DoctorList/>} />
        <Route path="/servicemaster" element={<ServiceMaster/>} />
        <Route path="/servicelist" element={<ServiceList/>} />
        <Route path="/serviceRateMaster" element={<ServiceRateMaster/>} />
        <Route path="/serviceratelist" element={<ServiceRateList/>} />
        <Route path="/wards" element={<WardMaster/>} />
        <Route path="/wardList" element={<WardList/>} />
        <Route path="/wardpage" element={<WardPage/>} />
        <Route path="/Bedmaster" element={<BedMaster/>} />
        <Route path="/Bedlist" element={<BedList/>} />
        <Route path="/vendormaster" element={<VendorMaster/>} />
        <Route path="/vendorlist" element={<VendorList/>} />
      </Routes>
    </div>
  );
}

export default App;

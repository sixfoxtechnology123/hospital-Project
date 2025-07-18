import { Routes, Route } from 'react-router-dom';
import PatientsRegister from './component/PatientsRegister';
import OpIpSelection from './component/IpOpSelection';
import OpForm from './component/OPRegister';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PatientsRegister />} />
        <Route path="/select" element={<OpIpSelection />} />
        <Route path="/op-registration" element={<OpForm />} />
        {/* Future: <Route path="/ip-registration" element={<IpForm />} /> */}
      </Routes>
    </div>
  );
}

export default App;

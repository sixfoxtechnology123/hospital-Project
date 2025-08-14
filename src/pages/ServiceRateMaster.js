import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../component/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';

const ServiceRateMaster = () => {
  const [rate, setRate] = useState({
    rateId: '',
    serviceId: '',
    rateType: '',
    rateAmount: '',
    effectiveFrom: '',
    effectiveTo: '',
    status: 'Active',
    doctorShare: '',
    hospitalShare: '',
  });

  const [services, setServices] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomingRate, setIncomingRate] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Load services + decide create vs edit
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data || []);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };

    const fetchNextRateId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/service-rates/latest');
        const nextId = res.data?.rateId || 'SERVRATE0001';
        setRate(prev => ({ ...prev, rateId: nextId }));
      } catch (err) {
        console.error('Error getting rate ID:', err);
      }
    };

    fetchServices();

    if (location.state?.rate) {
      const r = location.state.rate;
      setIncomingRate(r);
      setIsEditMode(true);
      setRate(prev => ({
        ...prev,
        _id: r._id,
        rateId: r.rateId || '',
        serviceId: r.serviceId || '',
        rateType: r.rateType || '',
        rateAmount: r.rateAmount ?? '',
        effectiveFrom: r.effectiveFrom ? r.effectiveFrom.substring(0, 10) : '',
        effectiveTo: r.effectiveTo ? r.effectiveTo.substring(0, 10) : '',
        status: r.status || 'Active',
        doctorShare: r.doctorShare ?? '',
        hospitalShare: r.hospitalShare ?? '',
      }));
    } else {
      fetchNextRateId();
      setIsEditMode(false);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRate(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic numeric coercion
    const payload = {
      ...rate,
      rateAmount: rate.rateAmount === '' ? null : Number(rate.rateAmount),
      doctorShare: rate.doctorShare === '' ? null : Number(rate.doctorShare),
      hospitalShare: rate.hospitalShare === '' ? null : Number(rate.hospitalShare),
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/service-rates/${rate._id}`, payload);
        alert('Rate updated successfully!');
        navigate('/serviceRateList', { replace: true });
      } else {
        await axios.post('http://localhost:5000/api/service-rates', payload);
        alert('Rate saved successfully!');
        const res = await axios.get('http://localhost:5000/api/service-rates/latest');
        setRate({
          rateId: res.data?.rateId || 'SERVRATE0001',
          serviceId: '',
          rateType: '',
          rateAmount: '',
          effectiveFrom: '',
          effectiveTo: '',
          status: 'Active',
          doctorShare: '',
          hospitalShare: '',
        });
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert(err?.response?.data?.error || 'Error saving rate');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isEditMode ? 'Update Service Rate' : 'Service Rate Master'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Rate ID</label>
            <input
              type="text"
              name="rateId"
              value={rate.rateId}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Service</label>
            <select
              name="serviceId"
              value={rate.serviceId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">--Select--</option>
              {services.map(svc => (
                <option key={svc._id} value={svc.serviceId}>
                  {svc.serviceName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Rate Type</label>
            <select
              name="rateType"
              value={rate.rateType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="">--Select--</option>
              <option value="General">General</option>
              <option value="Insurance">Insurance</option>
              <option value="Corporate">Corporate</option>
              <option value="Package">Package</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Rate Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              name="rateAmount"
              value={rate.rateAmount}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Effective From</label>
            <input
              type="date"
              name="effectiveFrom"
              value={rate.effectiveFrom}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Effective To</label>
            <input
              type="date"
              name="effectiveTo"
              value={rate.effectiveTo}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Doctor Share (₹)</label>
            <input
              type="number"
              step="0.01"
              name="doctorShare"
              value={rate.doctorShare}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Hospital Share (₹)</label>
            <input
              type="number"
              step="0.01"
              name="hospitalShare"
              value={rate.hospitalShare}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={rate.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-1 rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-between">
            <BackButton />
            <button
              type="submit"
              className={`px-4 py-1 rounded text-white ${
                isEditMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRateMaster;

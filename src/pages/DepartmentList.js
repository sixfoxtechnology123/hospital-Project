import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import BackButton from '../component/BackButton';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Delete department
  const deleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/departments/${id}`);
      setDepartments(departments.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Failed to delete department:', err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Header */}
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Department Master</h2>
          <div className="flex gap-4">
            <BackButton />
            <button
              onClick={() => navigate('/departmentMaster')}
              className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold shadow"
            >
              Add Department
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Department Code</th>
            <th className="border border-green-500 px-2 py-1">Department Name</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {departments.length > 0 ? (
            departments.map((dept, index) => (
              <tr key={index} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{dept.deptCode || dept.dept_code || dept.code}</td>
                <td className="border border-green-500 px-2 py-1">{dept.deptName || dept.name}</td>
                <td className="border border-green-500 px-2 py-1 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => navigate('/departmentMaster', { state: { department: dept } })}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Edit Department"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteDepartment(dept._id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete Department"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No departments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentList;

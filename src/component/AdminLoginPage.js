import React, { useState } from 'react';
import axios from 'axios';

const AdminLoginPage = ({ setToken, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://hospitalpatientsreg.onrender.com/api/admin-login', { username, password });

      if (res.data.success) {
         
        if (onLogin) onLogin(); 
         setToken && setToken('admin-token'); 
         alert('Login successful');
      } else {
        alert('Invalid username or password');
      }

    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed due to server error');
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        className="border p-2 w-full mb-2"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 w-full mb-4"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Login
      </button>
    </form>
  );
};

export default AdminLoginPage;

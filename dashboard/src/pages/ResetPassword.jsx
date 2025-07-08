import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const email = location.state?.email || '';

  const handleReset = async () => {
    if (!otp) {
      setError('OTP is required.');
      setMsg('');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be a 6-digit number.');
      setMsg('');
      return;
    }
    if (!password) {
      setError('Password is required.');
      setMsg('');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setMsg('');
      return;
    }
    try {
      await axios.post(`${API_BASE}/users/reset-password`, { email, otp, password });
      setMsg('Password has been reset! You can now log in.');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
      setMsg('');
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center poppins-font"
      style={{
        background: '#f3f4f6',
        fontFamily: 'Poppins, Verdana, monospace',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md bg-white/90 shadow-2xl p-10 rounded-3xl m-4 backdrop-blur-md border border-black"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
          fontFamily: 'Poppins, Verdana, monospace'
        }}>
        <h2 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>Reset Password</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          className="border p-2 w-full mb-2 rounded-md text-black"
          style={{ fontFamily: 'Poppins, Verdana, monospace', background: 'white', borderColor: 'black' }}
          value={otp}
          onChange={e => setOtp(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter new password"
          className="border p-2 w-full mb-2 rounded-md text-black"
          style={{ fontFamily: 'Poppins, Verdana, monospace', background: 'white', borderColor: 'black' }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-xl shadow-md transition-colors duration-200 mb-2 mt-2 text-lg tracking-wide"
          style={{ fontFamily: 'Poppins, Verdana, monospace', background: '#000', color: '#fff', border: 'none', outline: 'none' }}
          onClick={handleReset}
        >
          Reset Password
        </button>
        {msg && <p className="text-green-600 mt-4" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>{msg}</p>}
        {error && <p className="text-red-600 mt-4" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>{error}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
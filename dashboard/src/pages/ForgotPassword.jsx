import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post(`${API_BASE}/users/forgot-password`, { email });
      setMsg('OTP sent to your email!');
      setError('');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP.');
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
        <h2 className="text-2xl font-bold mb-4 text-black" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 w-full mb-4 rounded-md text-black"
          style={{ fontFamily: 'Poppins, Verdana, monospace', background: 'white', borderColor: 'black' }}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-xl shadow-md transition-colors duration-200 mb-2 mt-2 text-lg tracking-wide"
          style={{ fontFamily: 'Poppins, Verdana, monospace', background: '#000', color: '#fff', border: 'none', outline: 'none' }}
          onClick={handleSendOtp}
        >
          Send OTP
        </button>
        {msg && <p className="text-green-600 mt-4" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>{msg}</p>}
        {error && <p className="text-red-600 mt-4" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
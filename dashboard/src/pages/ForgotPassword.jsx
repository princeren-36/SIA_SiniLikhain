import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import TextField from '@mui/material/TextField';
import loginImg from '../images/login.jpg';

const logo = '/circular-logo.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const navigate = useNavigate();

  // Simple email validation
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!email) {
      setError('Email is required.');
      setMsg('');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setMsg('');
      return;
    }
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
        backgroundImage: `url(${loginImg})`,
        fontFamily: 'Poppins, Verdana, monospace',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="absolute top-6 left-6 cursor-pointer z-20" onClick={() => navigate("/")}> 
        <img src={logo} alt="SiniLikhain Logo" className="w-20 h-20 rounded-full shadow-lg border-2 border-black hover:scale-105 transition-transform duration-200 bg-white" />
      </div>
      <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md bg-white/90 shadow-2xl p-10 rounded-3xl m-4 backdrop-blur-md border border-black"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
          fontFamily: 'Poppins, Verdana, monospace'
        }}>
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black drop-shadow-lg leading-tight" style={{ fontFamily: 'Poppins, Verdana, monospace', color: '#111' }}>
            Forgot Password
          </h1>
          <p className="mt-4 text-base md:text-base font-normal text-black" style={{ fontFamily: 'Poppins, Verdana, monospace', color: '#333' }}>
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
        </div>
        
        <div className="w-full mb-4 relative">
          <TextField
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            label="Email Address"
            variant="outlined"
            fullWidth
            autoComplete="off"
            required
            id="email"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black',
                },
                '&:hover fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black',
                },
                backgroundColor: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'black',
                fontFamily: 'Poppins, Verdana, monospace',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black',
              },
              fontFamily: 'Poppins, Verdana, monospace',
            }}
            InputProps={{
              style: {
                color: 'black',
                fontFamily: 'Poppins, Verdana, monospace',
                fontWeight: 400,
              },
            }}
            InputLabelProps={{
              style: {
                fontFamily: 'Poppins, Verdana, monospace',
                fontWeight: 400,
              },
            }}
          />
        </div>
        
        <button
          className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-xl shadow-md transition-colors duration-200 mb-4 mt-2 text-lg tracking-wide cursor-pointer"
          style={{ fontFamily: 'Poppins, Verdana, monospace', background: '#000', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer' }}
          onClick={handleSendOtp}
        >
          Send OTP
        </button>
        
        {msg && <div className="w-full mt-2 mb-2">
          <p className="text-center text-green-600 bg-green-50 border border-green-200 rounded-md py-2 px-3" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>{msg}</p>
        </div>}
        
        {error && <div className="w-full mt-2 mb-2">
          <p className="text-center text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>{error}</p>
        </div>}
        
        <p className="text-center text-black mt-4 text-sm" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>
          <span
            onClick={() => navigate("/login")}
            className="text-black hover:text-gray-700 cursor-pointer transition-colors duration-200 font-semibold"
            style={{ fontFamily: 'Poppins, Verdana, monospace' }}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
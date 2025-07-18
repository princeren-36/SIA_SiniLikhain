import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import loginImg from '../images/login.jpg';

const logo = '/circular-logo.png';

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const email = location.state?.email || '';

  // Strong password validation
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);

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
    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
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

  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 1) return; // Only allow one digit
    const newArr = [...otpArray];
    newArr[idx] = val;
    setOtpArray(newArr);
    setOtp(newArr.join(''));
    if (val && idx < 5) {
      document.getElementById(`otp-box-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otpArray[idx] && idx > 0) {
      document.getElementById(`otp-box-${idx - 1}`)?.focus();
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
            Reset Password
          </h1>
          <p className="mt-4 text-base md:text-base font-normal text-black" style={{ fontFamily: 'Poppins, Verdana, monospace', color: '#333' }}>
            Enter the OTP sent to your email and your new password.
          </p>
        </div>
        
        <div className="w-full mb-4 relative flex justify-center gap-2">
          {[0,1,2,3,4,5].map((i) => (
            <input
              key={i}
              id={`otp-box-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otpArray[i]}
              onChange={(e) => handleOtpChange(e, i)}
              onKeyDown={(e) => handleOtpKeyDown(e, i)}
              onFocus={() => setOtpFocused(true)}
              onBlur={() => setOtpFocused(false)}
              className={`w-12 h-12 text-center text-2xl border-2 rounded-lg focus:outline-none focus:border-black transition-all bg-white font-mono ${otpFocused ? 'border-black' : 'border-gray-400'}`}
              style={{ fontFamily: 'Poppins, Verdana, monospace', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
              autoComplete="off"
              required
            />
          ))}
        </div>
        
        <div className="w-full mb-4 relative">
          <TextField
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            label="New Password"
            variant="outlined"
            fullWidth
            autoComplete="off"
            required
            id="password"
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    tabIndex={-1}
                    sx={{ color: 'black' }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
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
          onClick={handleReset}
        >
          Reset Password
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

export default ResetPassword;
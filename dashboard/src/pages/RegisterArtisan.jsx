import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../utils/api';
import signupImg from '../images/signup.jpg';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function RegisterArtisan() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'artisan'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Only allow up to 15 digits
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 15);
      setUserData({ ...userData, [name]: numericValue });
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      setUserData({ ...userData, [name]: value });
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let currentErrors = {};
    let isValid = true;
    if (!userData.username.trim()) {
      currentErrors.username = "Username is required.";
      isValid = false;
    } else if (userData.username.trim().length < 3) {
      currentErrors.username = "Username must be at least 3 characters long.";
      isValid = false;
    }
    if (!userData.email.trim()) {
      currentErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())) {
      currentErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (!userData.phone.trim()) {
      currentErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{10,15}$/.test(userData.phone.trim())) {
      currentErrors.phone = "Phone number must be 10-15 digits.";
      isValid = false;
    }
    if (!userData.password.trim()) {
      currentErrors.password = "Password is required.";
      isValid = false;
    } else if (userData.password.trim().length < 6) {
      currentErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }
    if (!userData.confirmPassword.trim()) {
      currentErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (userData.password !== userData.confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
    setErrors(currentErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      const { confirmPassword, ...submitData } = userData;
      await axios.post(`${API_BASE}/users/register`, submitData);
      alert("Registration successful! You can now log in.");
      navigate("/Login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="poppins-font">
      <div
        className="flex h-screen items-center justify-center bg-cover bg-center flex-row relative"
        style={{
          backgroundImage: `url(${signupImg})`,
          fontFamily: 'Poppins, Verdana, monospace',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Blurred overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />
        <button
          className="fixed top-8 left-8 z-30 bg-white/80 hover:bg-white text-black font-semibold px-4 py-2 rounded-full shadow border border-gray-300 transition-colors duration-200"
          style={{ fontFamily: 'Poppins, Verdana, monospace' }}
          onClick={() => navigate('/register')}
        >
          &#8592; Back
        </button>
        <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md bg-white/90 shadow-2xl p-10 rounded-3xl m-4 backdrop-blur-md border border-black" style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)', fontFamily: 'Poppins, Verdana, monospace' }}>
          <h2 className="text-4xl font-bold mb-4 text-black" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>Register as Artisan</h2>
          <p className="text-base text-black mb-6 text-center" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>
            Please fill out the form below to create your artisan account and join our community.
          </p>
          {/* Username */}
          <div className="w-full mb-2 relative">
            <TextField
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              label="Enter Username"
              variant="outlined"
              fullWidth
              autoComplete="off"
              required
              id="username"
              error={!!errors.username}
              helperText={errors.username ? errors.username : ''}
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
          {/* Email */}
          <div className="w-full mb-2 relative">
            <TextField
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              label="Enter Email"
              variant="outlined"
              fullWidth
              autoComplete="off"
              required
              id="email"
              error={!!errors.email}
              helperText={errors.email ? errors.email : ''}
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
          {/* Phone */}
          <div className="w-full mb-2 relative">
            <TextField
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              label="Enter Phone Number"
              variant="outlined"
              fullWidth
              autoComplete="off"
              required
              id="phone"
              error={!!errors.phone}
              helperText={errors.phone ? errors.phone : ''}
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
          {/* Password */}
          <div className="w-full mb-2 relative">
            <TextField
              type={showPassword ? "text" : "password"}
              name="password"
              value={userData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              label="Enter Password"
              variant="outlined"
              fullWidth
              autoComplete="off"
              required
              id="password"
              error={!!errors.password}
              helperText={errors.password ? errors.password : ''}
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
          {/* Confirm Password */}
          <div className="w-full mb-2 relative">
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              label="Confirm Password"
              variant="outlined"
              fullWidth
              autoComplete="off"
              required
              id="confirmPassword"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword ? errors.confirmPassword : ''}
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
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                      tabIndex={-1}
                      sx={{ color: 'black' }}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
            className="w-full bg-black text-white hover:bg-gray-900 font-semibold py-2 rounded-xl shadow-md transition-colors duration-200 mb-2 mt-2 text-lg tracking-wide border border-black outline-none"
            style={{ fontFamily: 'Poppins, Verdana, monospace', backgroundColor: '#000', color: '#fff' }}
            onClick={handleRegister}
          >
            Register
          </button>
          <p className="text-center text-black mt-4 text-sm" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate("/login")}
              className="text-black underline cursor-pointer font-semibold"
              style={{ fontFamily: 'Poppins, Verdana, monospace' }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterArtisan;

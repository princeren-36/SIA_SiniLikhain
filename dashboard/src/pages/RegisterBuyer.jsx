import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../utils/api';
import signupImg from '../images/signup.jpg';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function RegisterBuyer() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [pendingReg, setPendingReg] = useState(null);
  const [infoMsg, setInfoMsg] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
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

  // Validation helpers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);
  const isValidPhone = (phone) => /^\d{10,15}$/.test(phone);
  const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username) {
      newErrors.username = 'Username is required.';
    } else if (!isValidUsername(userData.username)) {
      newErrors.username = 'Username must be 3-20 alphanumeric characters.';
    }
    if (!userData.email) {
      newErrors.email = 'Email is required.';
    } else if (!isValidEmail(userData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!userData.phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!isValidPhone(userData.phone)) {
      newErrors.phone = 'Enter a valid phone number (10-15 digits).';
    }
    if (!userData.password) {
      newErrors.password = 'Password is required.';
    } else if (!isStrongPassword(userData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
    }
    if (!userData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      const { confirmPassword, ...submitData } = userData;
      // Check if email is already used for this role
      const check = await axios.post(`${API_BASE}/users/register`, submitData);
      // If we get here, email is not used, OTP sent
      setPendingReg({ email: submitData.email, role: submitData.role });
      setOtpDialogOpen(true);
      setInfoMsg(check.data.message || 'OTP sent to your email. Please enter it below.');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        // If email is already used, show error as toast
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed. Please try again later.");
      }
      setOtpDialogOpen(false);
    }
  };

  const handleOtpVerify = async () => {
    setOtpError('');
    if (!otp.trim()) {
      setOtpError('OTP is required.');
      return;
    }
    try {
      await axios.post(`${API_BASE}/users/verify-registration-otp`, {
        email: pendingReg.email,
        role: pendingReg.role,
        otp: otp.trim(),
      });
      setInfoMsg('Registration successful! You can now log in.');
      setTimeout(() => {
        setOtpDialogOpen(false);
        navigate('/Login');
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setOtpError(err.response.data.message);
      } else {
        setOtpError('OTP verification failed. Please try again.');
      }
    }
  };

  return (
    <div className="font-poppins poppins-font">
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="flex h-screen items-center justify-center bg-cover bg-center flex-row font-poppins relative"
        style={{
          backgroundImage: `url(${signupImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Blurred overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />
        <button
          className="fixed top-8 left-8 z-30 bg-white/80 hover:bg-white text-black font-semibold px-4 py-2 rounded-full shadow border border-gray-300 transition-colors duration-200 font-poppins"
          onClick={() => navigate('/login')}
        >
          &#8592; Back
        </button>
        <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md bg-white/90 shadow-2xl p-10 rounded-3xl m-4 backdrop-blur-md border border-black font-poppins" style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}>
          <h2 className="text-4xl font-bold mb-4 text-black font-poppins">Register as Buyer</h2>
          <p className="text-base text-black mb-6 text-center font-poppins">
            Please fill out the form below to create your buyer account and join our community.
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
          <p className="text-center text-black mt-4 text-sm font-poppins">
            Already have an account?{' '}
            <span
              onClick={() => navigate("/login")}
              className="text-black underline cursor-pointer font-semibold"
            >
              Login
            </span>
          </p>
          <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogContent>
              <div style={{ marginBottom: 12 }}>{infoMsg}</div>
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                fullWidth
                error={!!otpError}
                helperText={otpError}
                autoFocus
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleOtpVerify} variant="contained">Verify</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default RegisterBuyer;

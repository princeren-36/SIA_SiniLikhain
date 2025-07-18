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
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [otpFocused, setOtpFocused] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
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
      // Reset OTP fields when opening dialog
      setOtpArray(['', '', '', '', '', '']);
      setOtp('');
      setOtpError('');
      setVerificationSuccess(false);
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
    const otpValue = otpArray.join('');
    if (!otpValue) {
      setOtpError('OTP is required.');
      return;
    }
    if (otpValue.length !== 6) {
      setOtpError('OTP must be 6 digits.');
      return;
    }
    try {
      await axios.post(`${API_BASE}/users/verify-registration-otp`, {
        email: pendingReg.email,
        role: pendingReg.role,
        otp: otpValue,
      });
      
      // Show success state
      setVerificationSuccess(true);
      
      // Navigate after delay
      setTimeout(() => {
        setOtpDialogOpen(false);
        navigate('/Login');
      }, 2000);
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
          <Dialog 
            open={otpDialogOpen} 
            onClose={() => setOtpDialogOpen(false)}
            PaperProps={{
              style: {
                borderRadius: '16px',
                padding: '16px',
                maxWidth: '400px',
                width: '90%',
                fontFamily: 'Poppins, Verdana, monospace',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
                border: '1px solid #000'
              }
            }}
          >
            <DialogTitle style={{ 
              textAlign: 'center', 
              fontFamily: 'Poppins, Verdana, monospace',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#111'
            }}>
              Account Verification
            </DialogTitle>
            <DialogContent>
              <div style={{ 
                marginBottom: '20px',
                textAlign: 'center',
                fontFamily: 'Poppins, Verdana, monospace',
                color: '#333' 
              }}>
                {verificationSuccess ? (
                  <div className="text-center text-green-600 p-4">
                    <div className="flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-xl font-semibold mb-2">Registration successful!</p>
                    <p className="text-base">You can now log in to your account.</p>
                  </div>
                ) : (
                  <>
                    Enter the OTP sent to your email to verify your account.
                  
                    <div className="flex justify-center items-center gap-2 my-6">
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
                          style={{ 
                            fontFamily: 'Poppins, Verdana, monospace', 
                            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)'
                          }}
                          autoFocus={i === 0}
                          autoComplete="off"
                          required
                        />
                      ))}
                    </div>
                    
                    {otpError && (
                      <div className="text-center text-red-600 mt-2 p-2 bg-red-50 border border-red-200 rounded-md" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>
                        {otpError}
                      </div>
                    )}
                  </>
                )}
              </div>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
              {!verificationSuccess && (
                <>
                  <Button 
                    onClick={() => setOtpDialogOpen(false)}
                    style={{
                      fontFamily: 'Poppins, Verdana, monospace',
                      backgroundColor: '#f5f5f5',
                      color: '#000',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      margin: '0 8px',
                      border: '1px solid #ddd'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleOtpVerify} 
                    variant="contained"
                    style={{
                      fontFamily: 'Poppins, Verdana, monospace',
                      backgroundColor: '#000',
                      color: '#fff',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      margin: '0 8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                  >
                    Verify Account
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default RegisterBuyer;

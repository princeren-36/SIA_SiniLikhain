import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signupImg from '../images/signup.jpg';

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
      await axios.post("http://localhost:5000/users/register", submitData);
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
    <div className="font-poppins poppins-font">
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
          onClick={() => navigate('/register')}
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
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              className={`w-full px-4 py-4 text-base text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-white peer shadow-sm font-poppins ${errors.username ? 'border-red-500' : ''}`}
              autoComplete="off"
              required
              id="username"
            />
            <label
              htmlFor="username"
              className={`absolute left-4 transition-all duration-300 pointer-events-none px-1 font-poppins ${(userData.username || usernameFocused || errors.username) ? 'top-2 text-xs' : 'top-1/2 -translate-y-1/2 text-sm'} ${errors.username ? 'text-red-500 font-bold' : 'text-black'}`}
              style={{ zIndex: 10 }}
            >
              Enter Username
            </label>
            {errors.username && <p className="text-red-500 text-xs mt-1 font-bold font-poppins">{errors.username}</p>}
          </div>
          {/* Email */}
          <div className="w-full mb-2 relative">
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className={`w-full px-4 py-4 text-base text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-white peer shadow-sm font-poppins ${errors.email ? 'border-red-500' : ''}`}
              autoComplete="off"
              required
              id="email"
            />
            <label
              htmlFor="email"
              className={`absolute left-4 transition-all duration-300 pointer-events-none px-1 font-poppins ${(userData.email || emailFocused || errors.email) ? 'top-2 text-xs' : 'top-1/2 -translate-y-1/2 text-sm'} ${errors.email ? 'text-red-500 font-bold' : 'text-black'}`}
              style={{ zIndex: 10 }}
            >
              Enter Email
            </label>
            {errors.email && <p className="text-red-500 text-xs mt-1 font-bold font-poppins">{errors.email}</p>}
          </div>
          {/* Phone */}
          <div className="w-full mb-2 relative">
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              className={`w-full px-4 py-4 text-base text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-white peer shadow-sm font-poppins ${errors.phone ? 'border-red-500' : ''}`}
              autoComplete="off"
              required
              id="phone"
            />
            <label
              htmlFor="phone"
              className={`absolute left-4 transition-all duration-300 pointer-events-none px-1 font-poppins ${(userData.phone || phoneFocused || errors.phone) ? 'top-2 text-xs' : 'top-1/2 -translate-y-1/2 text-sm'} ${errors.phone ? 'text-red-500 font-bold' : 'text-black'}`}
              style={{ zIndex: 10 }}
            >
              Enter Phone Number
            </label>
            {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold font-poppins">{errors.phone}</p>}
          </div>
          {/* Password */}
          <div className="w-full mb-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className={`w-full px-4 py-4 text-base text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-white peer shadow-sm font-poppins ${errors.password ? 'border-red-500' : ''}`}
              autoComplete="off"
              required
              id="password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={`absolute right-4 transition-all duration-300 text-black hover:text-gray-700 focus:outline-none
                ${(userData.password || passwordFocused || errors.password)
                  ? 'top-3 translate-y-0'
                  : 'top-1/2 -translate-y-1/2'}
              `}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={
                (userData.password || passwordFocused || errors.password)
                  ? { background: 'none', border: 'none', padding: 0, margin: 0 }
                  : { background: 'none', border: 'none', padding: 0, margin: 0, top: '60%', transform: 'translateY(-50%)' }
              }
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="white" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7a21.77 21.77 0 015.06-5.94M22.54 12.42A21.77 21.77 0 0012 5c-1.657 0-3.22.403-4.575 1.125M3 3l18 18" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="white" /></svg>
              )}
            </button>
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-300 pointer-events-none px-1 font-poppins ${(userData.password || passwordFocused || errors.password) ? 'top-2 text-xs' : 'top-1/2 -translate-y-1/2 text-sm'} ${errors.password ? 'text-red-500 font-bold' : 'text-black'}`}
              style={{ zIndex: 10 }}
            >
              Enter Password
            </label>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-bold font-poppins">{errors.password}</p>}
          </div>
          {/* Confirm Password */}
          <div className="w-full mb-2 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              className={`w-full px-4 py-4 text-base text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-white peer shadow-sm font-poppins ${errors.confirmPassword ? 'border-red-500' : ''}`}
              autoComplete="off"
              required
              id="confirmPassword"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className={`absolute right-4 transition-all duration-300 text-black hover:text-gray-700 focus:outline-none
                ${(userData.confirmPassword || confirmPasswordFocused || errors.confirmPassword)
                  ? 'top-3 translate-y-0'
                  : 'top-1/2 -translate-y-1/2'}
              `}
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              style={
                (userData.confirmPassword || confirmPasswordFocused || errors.confirmPassword)
                  ? { background: 'none', border: 'none', padding: 0, margin: 0 }
                  : { background: 'none', border: 'none', padding: 0, margin: 0, top: '60%', transform: 'translateY(-50%)' }
              }
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="white" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7a21.77 21.77 0 015.06-5.94M22.54 12.42A21.77 21.77 0 0012 5c-1.657 0-3.22.403-4.575 1.125M3 3l18 18" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="white" /></svg>
              )}
            </button>
            <label
              htmlFor="confirmPassword"
              className={`absolute left-4 transition-all duration-300 pointer-events-none px-1 font-poppins ${(userData.confirmPassword || confirmPasswordFocused || errors.confirmPassword) ? 'top-2 text-xs' : 'top-1/2 -translate-y-1/2 text-sm'} ${errors.confirmPassword ? 'text-red-500 font-bold' : 'text-black'}`}
              style={{ zIndex: 10 }}
            >
              Confirm Password
            </label>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-bold font-poppins">{errors.confirmPassword}</p>}
          </div>
          <button
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-xl shadow-md transition-colors duration-200 mb-2 mt-2 text-lg tracking-wide"
            style={{ background: '#000', color: '#fff', border: 'none', outline: 'none' }}
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
        </div>
      </div>
    </div>
  );
}

export default RegisterBuyer;

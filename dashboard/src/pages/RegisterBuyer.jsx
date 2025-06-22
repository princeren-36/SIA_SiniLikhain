import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signupImg from '../images/signup.jpg';

function RegisterBuyer() {
  const [userData, setUserData] = useState({ username: '', password: '', role: 'buyer' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
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
    if (!userData.password.trim()) {
      currentErrors.password = "Password is required.";
      isValid = false;
    } else if (userData.password.trim().length < 6) {
      currentErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }
    setErrors(currentErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      await axios.post("http://localhost:5000/users/register", userData);
      alert("Registration successful! You can now log in.");
      navigate("/Loginn");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 flex-row" style={{ fontFamily: 'Source Code Pro, monospace' }}>
      <div className="flex-1 hidden md:block h-full md:w-[55%] lg:w-[60%] xl:w-[65%]">
        <img src={signupImg} alt="register" className="w-full h-full object-cover" style={{ minWidth: '350px' }} />
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/3 bg-white shadow-lg p-8 mx-auto rounded-3xl m-4 md:m-8">
        <h1 className="text-4xl font-bold mb-4 text-black">Register as Buyer</h1>
        <div className="w-full mb-4 relative">
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-base text-black border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-white peer`}
            style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 400 }}
            autoComplete="off"
            required
          />
          <label
            htmlFor="username"
            className={`absolute left-4 ${userData.username ? '-top-3 text-xs text-blue-700 translate-y-0' : 'top-1/2 -translate-y-1/2 text-gray-500'} bg-white px-1 transition-all duration-300 pointer-events-none
              peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-700 peer-focus:translate-y-0
              peer-hover:-top-3 peer-hover:text-xs peer-hover:text-blue-700 peer-hover:translate-y-0`}
            style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 400 }}
          >
            Enter Username
          </label>
          {errors.username && <p className="text-red-500 text-xs mt-1 font-bold" style={{ fontFamily: 'Source Code Pro, monospace' }}>{errors.username}</p>}
        </div>
        <div className="h-4"></div>
        <div className="w-full mb-4 relative">
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-base text-black border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-white peer`}
            style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 400 }}
            autoComplete="off"
            required
          />
          <label
            htmlFor="password"
            className={`absolute left-4 ${userData.password ? '-top-3 text-xs text-blue-700 translate-y-0' : 'top-1/2 -translate-y-1/2 text-gray-500'} bg-white px-1 transition-all duration-300 pointer-events-none
              peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-700 peer-focus:translate-y-0
              peer-hover:-top-3 peer-hover:text-xs peer-hover:text-blue-700 peer-hover:translate-y-0`}
            style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 400 }}
          >
            Enter Password
          </label>
          {errors.password && <p className="text-red-500 text-xs mt-1 font-bold" style={{ fontFamily: 'Source Code Pro, monospace' }}>{errors.password}</p>}
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200 mb-2"
          onClick={handleRegister}
        >
          Register
        </button>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{' '}
          <span
            onClick={() => navigate("/Loginn")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterBuyer;

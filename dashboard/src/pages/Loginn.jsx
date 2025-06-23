import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginImg from '../images/login.jpg';
import logo from '../../public/circular-logo.png';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleLogin = async () => {
    let currentErrors = {};

    if (!credentials.username.trim()) {
      currentErrors.username = "Username is required";
    }
    if (!credentials.password.trim()) {
      currentErrors.password = "Password is required";
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return; 
    }

    try {
      const response = await axios.post("http://localhost:5000/users/login", credentials);
      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "artisan") {
        navigate("/artisan");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100" style={{ fontFamily: 'Verdana, monospace' }}>
      {/* Logo at the top, links to landing page */}
      <div className="absolute top-6 left-6 cursor-pointer z-10" onClick={() => navigate("/")}>
        <img src={logo} alt="SiniLikhain Logo" className="w-20 h-20 rounded-full shadow-lg border-2 border-blue-400 hover:scale-105 transition-transform duration-200" />
      </div>
      <div className="flex-1 hidden md:block h-full md:w-[55%] lg:w-[60%] xl:w-[65%]">
        <img src={loginImg} alt="login" className="w-full h-full object-cover" style={{ minWidth: '350px' }} />
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/3 bg-white shadow-lg p-8 mx-auto rounded-3xl m-4 md:m-8">
        <h1 className="text-4xl font-bold mb-4 text-black" style={{ fontFamily: 'Verdana, monospace' }}>Login</h1>
        <div className="w-full mb-4 relative">
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-base text-black border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-white peer`}
            style={{ fontFamily: 'Verdana, monospace', fontWeight: 400 }}
            autoComplete="off"
            required
          />
          <label
            htmlFor="username"
            className={`absolute left-4 ${credentials.username ? '-top-3 text-xs text-blue-700 translate-y-0' : 'top-1/2 -translate-y-1/2 text-gray-500'} bg-white px-1 transition-all duration-300 pointer-events-none
              peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-700 peer-focus:translate-y-0
              peer-hover:-top-3 peer-hover:text-xs peer-hover:text-blue-700 peer-hover:translate-y-0`}
            style={{ fontFamily: 'Verdana, monospace', fontWeight: 400 }}
          >
            Enter Username
          </label>
          {errors.username && <p className="text-red-500 text-xs mt-1 font-bold" style={{ fontFamily: 'Verdana, monospace' }}>{errors.username}</p>}
        </div>
        <div className="h-4"></div>
        <div className="w-full mb-4 relative">
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-base text-black border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-white peer`}
            style={{ fontFamily: 'Verdana, monospace', fontWeight: 400 }}
            autoComplete="off"
            required
          />
          <label
            htmlFor="password"
            className={`absolute left-4 ${credentials.password ? '-top-3 text-xs text-blue-700 translate-y-0' : 'top-1/2 -translate-y-1/2 text-gray-500'} bg-white px-1 transition-all duration-300 pointer-events-none
              peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-700 peer-focus:translate-y-0
              peer-hover:-top-3 peer-hover:text-xs peer-hover:text-blue-700 peer-hover:translate-y-0`}
            style={{ fontFamily: 'Verdana, monospace', fontWeight: 400 }}
          >
            Enter Password
          </label>
          {errors.password && <p className="text-red-500 text-xs mt-1 font-bold" style={{ fontFamily: 'Verdana, monospace' }}>{errors.password}</p>}
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200 mb-2"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?{' '}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
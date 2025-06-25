import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginImg from '../images/login.jpg';

const logo = '/circular-logo.png';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Typing animation states
  const animatedText = "Artisan-made. Culture-inspired.";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blinking effect
  React.useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  React.useEffect(() => {
    let typingTimeout;
    if (!isDeleting && !showDeleted && charIndex < animatedText.length) {
      typingTimeout = setTimeout(() => {
        setDisplayedText(animatedText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 60);
    } else if (!isDeleting && !showDeleted && charIndex === animatedText.length && !pause) {
      setPause(true);
      typingTimeout = setTimeout(() => {
        setIsDeleting(true);
        setPause(false);
      }, 1200);
    } else if (isDeleting && !showDeleted && charIndex > 0) {
      typingTimeout = setTimeout(() => {
        setDisplayedText(animatedText.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 30);
    } else if (isDeleting && !showDeleted && charIndex === 0) {
      setShowDeleted(true);
      typingTimeout = setTimeout(() => {
        setShowDeleted(false);
        setIsDeleting(false);
        setCharIndex(0);
        setDisplayedText("");
      }, 1000);
    }
    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, pause, animatedText, showDeleted]);

  // Prefill username if lastUsername exists in localStorage
  React.useEffect(() => {
    const lastUsername = localStorage.getItem('lastUsername');
    if (lastUsername) {
      setCredentials((prev) => ({ ...prev, username: lastUsername }));
    }
  }, []);

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

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    try {
      const response = await axios.post("http://localhost:5000/users/login", credentials);
      const user = response.data.user;
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("lastUsername", credentials.username); // Save last used username only if Remember Me is checked
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("lastUsername"); // Remove lastUsername if Remember Me is not checked
      }

      console.log('Logged in user:', user);
      const roleRoutes = {
        admin: "/admin",
        artisan: "/Artisan",
        buyer: "/home",
      };
      const route = roleRoutes[user.role];
      if (route) {
        navigate(route);
      } else {
        setLoginError("Unknown user role. Please contact support.");
        navigate("/");
      }
      setLoginError("");
    } catch (error) {
      setLoginError("Invalid username or password.");
      setErrors({ username: true, password: true });
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
        <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md bg-white/90 shadow-2xl p-10 rounded-3xl m-4 backdrop-blur-md border border-black" style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)', fontFamily: 'Poppins, Verdana, monospace' }}>
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-black drop-shadow-lg leading-tight" style={{ fontFamily: 'Poppins, Verdana, monospace', color: '#111' }}>
              Welcome to SiniLikhain
            </h1>
            <p className="text-base md:text-lg mt-2 font-medium text-black min-h-[1.5em]" style={{ fontFamily: 'Source Code Pro, monospace', color: '#222', letterSpacing: '0.5px', whiteSpace: 'pre' }}>
              {showDeleted ? (
                <span style={{ textDecoration: 'line-through', color: '#888' }}>{animatedText}</span>
              ) : (
                <>
                  {displayedText}
                  <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
                </>
              )}
            </p>
            <p className="mt-4 text-base md:text-base font-normal text-black" style={{ fontFamily: 'Poppins, Verdana, monospace', color: '#333' }}>
              Please log in your account to continue.
            </p>
          </div>
          {loginError && (
            <div className="w-full mb-4">
              <p className="text-black text-center text-sm font-semibold bg-white border border-black rounded-md py-2 px-3" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>{loginError}</p>
            </div>
          )}
          <div className="w-full mb-2 relative">
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              className={`w-full px-4 py-4 text-base text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-white peer shadow-sm ${errors.username ? 'border-red-500' : ''}`}
              style={{ fontFamily: 'Poppins, Verdana, monospace', fontWeight: 400 }}
              autoComplete="off"
              required
              id="username"
            />
            <label
              htmlFor="username"
              className={`absolute left-4 transition-all duration-300 pointer-events-none px-1
                ${(credentials.username || usernameFocused || errors.username) ? 'top-2 text-xs translate-y-0' : 'top-1/2 -translate-y-1/2 text-sm'}
                ${errors.username ? 'text-red-500' : 'text-black'}`}
              style={{
                fontFamily: 'Poppins, Verdana, monospace',
                fontWeight: 400,
                zIndex: 10,
                background: errors.username ? 'white' : 'transparent',
                pointerEvents: 'none',
                width: 'fit-content',
                maxWidth: '90%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Enter Username
            </label>
            {errors.username && <p className="text-red-500 text-xs mt-1 font-bold" style={{ fontFamily: 'Poppins, Verdana, monospace', marginTop: '0.25rem' }}>{errors.username}</p>}
          </div>
          <div className="w-full mb-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className={`w-full px-4 py-4 text-base text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-white peer shadow-sm ${errors.password ? 'border-red-500' : ''}`}
              style={{ fontFamily: 'Poppins, Verdana, monospace', fontWeight: 400, border: 'none', boxShadow: 'none' }}
              autoComplete="off"
              required
              id="password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={`absolute right-4 transition-all duration-300 text-black hover:text-gray-700 focus:outline-none
                ${(credentials.password || passwordFocused || errors.password)
                  ? 'top-3 translate-y-0'
                  : 'top-1/2 -translate-y-1/2'}
              `}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="white" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7a21.77 21.77 0 015.06-5.94M22.54 12.42A21.77 21.77 0 0012 5c-1.657 0-3.22.403-4.575 1.125M3 3l18 18" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="white" /></svg>
              )}
            </button>
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-300 pointer-events-none px-1
                ${(credentials.password || passwordFocused || errors.password) ? 'top-2 text-xs translate-y-0' : 'top-1/2 -translate-y-1/2 text-sm'}
                ${errors.password ? 'text-red-500' : 'text-black'}`}
              style={{
                fontFamily: 'Poppins, Verdana, monospace',
                fontWeight: 400,
                zIndex: 10,
                background: errors.password ? 'white' : 'transparent',
                pointerEvents: 'none',
                width: 'fit-content',
                maxWidth: '90%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Enter Password
            </label>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-bold" style={{ fontFamily: 'Poppins, Verdana, monospace', marginTop: '0.25rem' }}>{errors.password}</p>}
          </div>
          <div className="w-full flex items-center mb-4">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="mr-2 accent-black h-4 w-4 rounded focus:ring-black border-black"
            />
            <label htmlFor="rememberMe" className="text-sm text-black select-none" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>
              Remember me
            </label>
          </div>
          <button
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-xl shadow-md transition-colors duration-200 mb-2 mt-2 text-lg tracking-wide"
            style={{ fontFamily: 'Poppins, Verdana, monospace' }}
            onClick={handleLogin}
          >
            Login
          </button>
          <p className="text-center text-black mt-4 text-sm" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate("/register")}
              className="text-black underline cursor-pointer font-semibold"
              style={{ fontFamily: 'Poppins, Verdana, monospace' }}
            >
              Register
            </span>
          </p>
        </div>
      </div>
  );
}

export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginImg from '../images/login.jpg';
import { API_BASE } from '../utils/api';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
      currentErrors.username = "Email or username is required";
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
      const response = await axios.post(`${API_BASE}/users/login`, credentials);
      const user = response.data.user;
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("lastUsername", credentials.username); // Save last used username/email only if Remember Me is checked
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
      setLoginError("Invalid email/username or password.");
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
              Please log in to your account to continue.
            </p>
          </div>
          {loginError && (
            <div className="w-full mb-4">
              <p className="text-black text-center text-sm font-semibold bg-white border border-black rounded-md py-2 px-3" style={{ fontFamily: 'Poppins, Verdana, monospace' }}>{loginError}</p>
            </div>
          )}
          <div className="w-full mb-2 relative">
            <TextField
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              label="Enter Email or Username"
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('password').focus();
                }
              }}
            />
          </div>
          <div className="w-full mb-2 relative">
            <TextField
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
          </div>
          <div className="w-full flex justify-between items-center mb-4">
            <div className="flex items-center">
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
            <p
              className="text-sm text-black hover:text-gray-700 cursor-pointer transition-colors duration-200"
              onClick={() => navigate("/forgot-password")}
              style={{ fontFamily: 'Poppins, Verdana, monospace', textDecoration: 'none' }}
            >
              Forgot password?
            </p>
          </div>
          <button
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-xl shadow-md transition-colors duration-200 mb-4 mt-2 text-lg tracking-wide cursor-pointer"
            style={{ fontFamily: 'Poppins, Verdana, monospace', background: '#000', color: '#fff', border: 'none', outline: 'none', cursor: 'pointer' }}
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axios from 'axios';
import "../style/Loginn.css";

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
    <Box className="login" display="flex" height="100vh">
      <Box className="image" flex={1}>
        <img src="../src/images/1000_F_498999508_PSgnnT9YiDQ6lFnDgYyHohV8yVw90b2c.jpg" alt="login" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Box>

      <Paper className="container-login" elevation={6} sx={{ p: 4, width: "25%", margin: "auto" }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={credentials.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
          Login
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <span onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "#1976d2" }}>Register</span>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../style/Loginn.css"; // Reuse the login CSS for layout/background

function Register() {
  const [userData, setUserData] = useState({ username: '', password: '', role: 'buyer' });
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    // Clear the error for the specific field when user starts typing
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
    } else if (userData.password.trim().length < 6) { // Common practice for minimum password length
      currentErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await axios.post("http://localhost:5000/users/register", userData);
      alert("Registration successful! You can now log in."); // More informative message
      navigate("/"); // Redirect to login page
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        // Use the specific message from the backend if available
        alert(err.response.data.message); // E.g., "User already exists"
      } else {
        // Generic error for network issues or unexpected server errors
        alert("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <Box className="login" display="flex" height="100vh">
      <Box className="image" flex={1}>
        <img
          src="..\src\images\pexels-korhan-erdol-1123380-2344613.jpg"
          alt="register"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Paper className="container-login" elevation={6} sx={{ p: 4, width: "25%", margin: "auto" }}>
        <Typography variant="h5" gutterBottom>Register</Typography>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userData.username}
          onChange={handleChange}
          error={!!errors.username} // Show error state
          helperText={errors.username} // Display error message
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userData.password}
          onChange={handleChange}
          error={!!errors.password} // Show error state
          helperText={errors.password} // Display error message
        />
        <TextField
          select
          label="Role"
          name="role"
          fullWidth
          margin="normal"
          value={userData.role}
          onChange={handleChange}
        >
          <MenuItem value="artisan">Artisan</MenuItem>
          <MenuItem value="buyer">Buyer</MenuItem>
        </TextField>
        <Button variant="contained" fullWidth onClick={handleRegister} sx={{ mt: 2 }}>
          Register
        </Button>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", color: "#1976d2" }}
          >
            Login
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
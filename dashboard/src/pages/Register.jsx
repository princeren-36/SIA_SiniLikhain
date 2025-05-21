import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../style/Loginn.css"; // Reuse the login CSS for layout/background

function Register() {
  const [userData, setUserData] = useState({ username: '', password: '', role: 'buyer' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/users/register", userData);
      alert("Registration successful!");
      navigate("/"); // Redirect to login
    } catch (err) {
      alert("Username already exists or registration failed.");
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
          <MenuItem value="admin">Admin</MenuItem>
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


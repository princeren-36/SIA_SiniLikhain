import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button
} from '@mui/material';
import Navbar from './NavbarArtisan'; // Import the Navbar

function Artisan() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "artisan") {
      navigate("/");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const goToProductManager = () => {
    navigate("/addproduct");
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Artisan Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome, <strong>{user.username}</strong>! Manage your handcrafted products here.
        </Typography>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Manage Products</Typography>
              <Button variant="contained" fullWidth onClick={goToProductManager}>Go</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>View Orders (Coming Soon)</Typography>
              <Button variant="outlined" fullWidth disabled>Coming Soon</Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Artisan;

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box p={4}>
      <Typography variant="h4">Admin Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>You can monitor users and manage the platform here.</Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleLogout}>Logout</Button>
    </Box>
  );
}

export default Admin;

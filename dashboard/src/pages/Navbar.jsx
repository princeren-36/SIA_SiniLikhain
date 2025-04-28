import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SiniLikhain
        </Typography>
        <Button color="inherit" component={Link} to="/home">
          Home
        </Button>
        
        <Button color="inherit" component={Link} to="/addproduct">
          Products
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

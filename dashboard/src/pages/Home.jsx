import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Container } from "@mui/material";
import Navbar from "./Navbar";  // Make sure the Navbar is in the correct path
import '../style/Home.css';  // Import the external CSS file

function Home() {
  const navigate = useNavigate();

  const handleProduct = () => {
    navigate("/AddProduct");
  };

  return (
    <div>
      <Navbar />
      <Container sx={{ textAlign: "center", py: 5 }}>
        <Box className="home">
          <div className="container-home">
            <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
              Welcome to SiniLikhain
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: "text.secondary" }}>
              Discover unique handmade products crafted by skilled artisans.
            </Typography>
            <Button
              onClick={handleProduct}
              variant="contained"
              color="primary"
              className="product-button"  // Using the class for styling
            >
              VIEW PRODUCTS
            </Button>
          </div>
        </Box>
      </Container>
    </div>
  );
}

export default Home;

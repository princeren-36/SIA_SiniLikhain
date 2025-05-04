import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Navbar from "./Navbar"; // Ensure the Navbar path is correct
import "../style/Home.css"; // Import the external CSS file

function Home() {
  const navigate = useNavigate();

  const handleProduct = () => {
    navigate("/AddProduct");
  };

  return (
    <div>
      <Navbar />
      <div>
        <div className="home">
          <div className="container-home">
            <Typography variant="h3" style={{ marginBottom: "1rem", fontWeight: "bold" }}>
              Welcome to SiniLikhain
            </Typography>
            <Typography variant="h5" style={{ marginBottom: "2rem", color: "gray" }}>
              Discover unique handmade products crafted by skilled artisans.
            </Typography>
            <Button
              onClick={handleProduct}
              variant="contained"
              color="primary"
              className="product-button"
            >
              VIEW PRODUCTS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

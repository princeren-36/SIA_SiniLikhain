import Navbar from "./NavbarBuyer";
import { Button } from "@mui/material";

function About() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>About SiniLikhain</h1>
        <p>
          Welcome to <strong>SiniLikhain</strong>, an e-commerce platform
          dedicated to showcasing the creativity and craftsmanship of talented
          artisans. Our mission is to connect skilled creators with customers
          who value unique, handmade, and high-quality products.
        </p>
      </div>
    </>
  );
}

export default About;

import { useNavigate } from "react-router-dom";
import Navbar from "../buyer/NavbarBuyer";
import "../style/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <Navbar />
      <div className="home">
        <div className="home-image-half">
          <img
            src="../src/images/3.jpg"
            alt="home"
            className="home-image"
          />
        </div>
        <div className="container-home">
          <h1 className="home-title">Welcome to Artisan Marketplace</h1>
          <p className="home-subtitle">
            Discover unique handmade products from local artisans.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;

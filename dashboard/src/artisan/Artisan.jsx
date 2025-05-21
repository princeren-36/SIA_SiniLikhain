import { useNavigate } from "react-router-dom";
import Navbar from "./NavbarArtisan";
import "../style/Home.css";

function Artisan() {
  const navigate = useNavigate();

  return (
    <div className="artisan-page">
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

export default Artisan;

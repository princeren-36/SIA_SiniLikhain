import Navbar from "./NavbarBuyer";
import "../style/About.css";

function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <h1 className="about-title">About SiniLikhain</h1>
        <div className="about-row">
          <div className="about-text-block">
            <h2 className="about-subtitle">Introduction</h2>
            <p className="about-text">
              Welcome to <strong>SiniLikhain</strong>, an e-commerce platform dedicated to
              showcasing the creativity and craftsmanship of talented artisans. Our mission
              is to connect skilled creators with customers who value unique, handmade, and
              high-quality products.
            </p>
          </div>
          <div className="about-img-block">
            <img src="../src/images/2.jpg" alt="handmade products" />
          </div>
        </div>
        <div className="about-row reverse">
          <div className="about-text-block">
            <h2 className="about-subtitle">Our Mission</h2>
            <p className="about-text">
              At SiniLikhain, we believe in the power of creativity and the importance of
              supporting local artisans. We are committed to promoting sustainable practices
              and ensuring fair compensation for their hard work.
            </p>
          </div>
          <div className="about-img-block">
            <img src="../src/images/4.jpg" alt="mission image" />
          </div>
        </div>
        <div className="about-row">
          <div className="about-text-block">
            <h2 className="about-subtitle">Our Vision</h2>
            <p className="about-text">
              Our vision is to become the leading online marketplace that highlights the
              value of handcrafted artistry while empowering communities and preserving
              traditional craftsmanship.
            </p>
          </div>
          <div className="about-img-block">
            <img src="../src/images/1.jpg" alt="vision image" />
          </div>
        </div>
        <div className="about-row reverse">
          <div className="about-text-block">
            <h2 className="about-subtitle">Our History</h2>
            <p className="about-text">
              SiniLikhain was born out of a passion for Filipino culture and a desire to
              support artisans struggling to market their work in the digital era. What
              started as a local initiative has now grown into a nationwide movement.
            </p>
          </div>
          <div className="about-img-block">
            <img src="../src/images/5.jpg" alt="history image" />
          </div>
        </div>
        <div className="about-row">
          <div className="about-text-block">
            <h2 className="about-subtitle">Background</h2>
            <p className="about-text">
              The idea for SiniLikhain emerged from various community engagements and art
              fairs. With the increasing demand for local and authentic handmade products,
              we envisioned a digital platform that connects artisans to a broader audience.
            </p>
          </div>
          <div className="about-img-block">
            <img src="../src/images/6.jpg" alt="background image" />
          </div>
        </div>
      </div>
    </>
  );
}

export default About;

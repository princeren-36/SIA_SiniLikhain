import { useNavigate } from "react-router-dom";
import Navbar from "../buyer/NavbarBuyer";
import logo from "../images/homepage.jpg";
import image1 from "../images/1.jpg";
import image2 from "../images/2.jpg";
import image3 from "../images/3.jpg";
import image4 from "../images/4.jpg";
import image5 from "../images/5.jpg";
import React, { useState, useEffect } from "react";
import { FaHandHoldingHeart, FaShoppingBag, FaPalette, FaUserFriends, FaArrowRight, FaArrowDown, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

// Baybayin for: si, ni, li, khai, n
const baybayin = [
  "ᜐᜒ", // si
  "ᜈᜒ", // ni
  "ᜎᜒ", // li
  "ᜃᜑᜒ", // khai
  "ᜈ᜔", // n
];
const latin = ["Si", "ni", "Li", "khai", "n"];

function SiniLikhainBaybayin() {
  const [hovered, setHovered] = useState(Array(latin.length).fill(false));

  const handleMouseEnter = (idx) => {
    setHovered((h) => h.map((v, i) => (i === idx ? true : v)));
  };
  const handleMouseLeave = (idx) => {
    setHovered((h) => h.map((v, i) => (i === idx ? false : v)));
  };

  return (
    <h2
      className="mb-2 text-4xl md:text-6xl font-extrabold tracking-widest text-white flex justify-center gap-4 select-none"
      style={{ letterSpacing: "0.05em" }}
    >
      {latin.map((char, idx) => (
        <span
          key={idx}
          className="transition-all duration-300 ease-in-out cursor-pointer relative"
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={() => handleMouseLeave(idx)}
          style={{
            display: "inline-block",
            minWidth: "2.5ch",
            position: "relative",
            textAlign: "center",
          }}
        >
          <span
            className={`block transition-all duration-300 ${
              hovered[idx] ? "opacity-0 scale-75" : "opacity-100 scale-100"
            }`}
            style={{ position: "absolute", left: 0, right: 0 }}
          >
            {char}
          </span>
          <span
            className={`block transition-all duration-300 ${
              hovered[idx] ? "opacity-100 scale-100" : "opacity-0 scale-125"
            }`}
            style={{ position: "relative" }}
          >
            {baybayin[idx]}
          </span>
        </span>
      ))}
    </h2>
  );
}

// Create a Footer component
function Footer() {
  return (
    <footer className="bg-[#121212] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4 font-mono">SiniLikhain</h3>
            <p className="text-gray-400 mb-4">
              Connecting talented Filipino artisans with those who appreciate authentic handcrafted products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-mono">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">All Products</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Featured</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Best Sellers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-mono">About</h3>
            <ul className="space-y-2">
              <li><a href="/aboutbuyer" className="text-gray-400 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Artisans</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-mono">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} SiniLikhain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  const navigate = useNavigate();
  
  // Animation function for scroll reveal
  const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn', 'opacity-100');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
        observer.unobserve(entry.target);
      }
    });
  };

  // Set up intersection observer when component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    document.querySelectorAll('.landing-section').forEach((section, index) => {
      observer.observe(section);
      // Add staggered delay to animations
      section.style.transitionDelay = `${index * 150}ms`;
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={logo}
            alt="SiniLikhain artisan background"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SiniLikhainBaybayin />
          <p className="mt-4 max-w-3xl mx-auto text-xl text-white font-[source-code-pro,monospace] tracking-wide opacity-90">
            Connecting Filipino Artisans with the World
          </p>
          <h1 className="mt-6 text-3xl md:text-5xl font-bold font-[source-code-pro,monospace] text-white mb-8 leading-tight tracking-wide">
            In simplicity, the seed of creation;
            <br />
            in humble tools, the birth of brilliance.
          </h1>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/buyer"
              className="px-8 py-4 bg-[#5e503f] text-white font-[source-code-pro,monospace] rounded-lg shadow-lg hover:bg-[#4d3f2f] transition-all duration-300 flex items-center gap-2"
            >
              <span>Shop Now</span>
              <FaArrowRight />
            </a>
            <a
              href="/aboutbuyer"
              className="px-8 py-4 border border-white text-white font-[source-code-pro,monospace] rounded-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Learn More
            </a>
          </div>
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <button 
              onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}
              className="animate-bounce bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
            >
              <FaArrowDown className="text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className="bg-[#f8f9fa] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto opacity-0 landing-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">
              Our Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              Why Choose SiniLikhain
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover what makes our marketplace the premier destination for authentic Filipino crafts
            </p>
            <div className="w-24 h-1 bg-[#5e503f] mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="bg-[#5e503f]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaHandHoldingHeart className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Authentic Craftsmanship</h3>
              <p className="text-gray-600">
                Every product is handcrafted with care, skill, and traditional techniques passed down through generations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="bg-[#5e503f]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaShoppingBag className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Direct From Artisans</h3>
              <p className="text-gray-600">
                Shop directly from the creators, ensuring fair compensation and supporting local communities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="bg-[#5e503f]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaPalette className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Unique Selection</h3>
              <p className="text-gray-600">
                Discover one-of-a-kind treasures that reflect rich cultural heritage and contemporary design.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="bg-[#5e503f]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaUserFriends className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Support</h3>
              <p className="text-gray-600">
                Join a community passionate about preserving cultural heritage and sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Showcase Section */}
      <div className="bg-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto opacity-0 landing-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">
              Featured Crafts
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              Discover Filipino Artistry
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our curated selection of handcrafted treasures
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <img 
                src={image1} 
                alt="Handwoven Textiles" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-1">Handwoven Textiles</h3>
                <p className="text-gray-200 mb-4 text-sm">Traditional patterns meet modern design</p>
                <a href="/buyer" className="text-white flex items-center gap-2 text-sm font-medium group-hover:text-[#f8d49f] transition-colors">
                  <span>Explore Collection</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <img 
                src={image3} 
                alt="Handcrafted Pottery" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-1">Handcrafted Pottery</h3>
                <p className="text-gray-200 mb-4 text-sm">Earth-toned ceramic masterpieces</p>
                <a href="/buyer" className="text-white flex items-center gap-2 text-sm font-medium group-hover:text-[#f8d49f] transition-colors">
                  <span>Explore Collection</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <img 
                src={image2} 
                alt="Bamboo Crafts" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-1">Bamboo Crafts</h3>
                <p className="text-gray-200 mb-4 text-sm">Sustainable and elegant home decor</p>
                <a href="/buyer" className="text-white flex items-center gap-2 text-sm font-medium group-hover:text-[#f8d49f] transition-colors">
                  <span>Explore Collection</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div 
        className="py-16 px-4 md:px-8 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${image5})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-5xl mx-auto opacity-0 landing-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-2">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-mono mb-3">
              What Our Community Says
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#222] bg-opacity-90 backdrop-blur-sm p-6 rounded-xl text-white border border-white/20">
              <div className="flex items-center mb-4">
                <div className="flex flex-col">
                  <p className="font-semibold">Maria Santos</p>
                  <p className="text-sm text-gray-300">Loyal Customer</p>
                </div>
              </div>
              <p className="italic">
                "The quality of craftsmanship is exceptional. Every piece tells a story, and I love supporting these talented artisans directly."
              </p>
            </div>
            
            <div className="bg-[#222] bg-opacity-90 backdrop-blur-sm p-6 rounded-xl text-white border border-white/20">
              <div className="flex items-center mb-4">
                <div className="flex flex-col">
                  <p className="font-semibold">Juan Reyes</p>
                  <p className="text-sm text-gray-300">Art Collector</p>
                </div>
              </div>
              <p className="italic">
                "SiniLikhain offers unique pieces that you simply can't find anywhere else. The attention to detail and cultural significance make each purchase special."
              </p>
            </div>
            
            <div className="bg-[#222] bg-opacity-90 backdrop-blur-sm p-6 rounded-xl text-white border border-white/20">
              <div className="flex items-center mb-4">
                <div className="flex flex-col">
                  <p className="font-semibold">Elena Cruz</p>
                  <p className="text-sm text-gray-300">Interior Designer</p>
                </div>
              </div>
              <p className="italic">
                "As a designer, I'm always looking for authentic pieces with character. SiniLikhain is my go-to source for genuine Filipino crafts that elevate any space."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-[#f8f9fa] py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto opacity-0 landing-section translate-y-8 transition-all duration-700">
          <div className="bg-gradient-to-br from-[#5e503f] to-[#3d332a] text-white py-12 px-8 rounded-xl shadow-xl relative overflow-hidden text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wide">
                Join the SiniLikhain Community
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Discover unique handcrafted treasures and support Filipino artisans preserving traditional craftsmanship.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/buyer" 
                  className="bg-white text-[#5e503f] px-8 py-3 rounded-lg font-medium shadow-md hover:bg-[#f8d49f] hover:text-[#3d332a] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#5e503f]"
                >
                  Shop Now
                </a>
                <a 
                  href="/aboutbuyer" 
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-[#5e503f] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Add keyframes for fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default Home;

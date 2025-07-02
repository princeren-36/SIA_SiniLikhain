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
              <li><a href="/buyer" className="text-gray-400 hover:text-white transition-colors">All Products</a></li>
              <li><a href="/buyer" className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="/buyer" className="text-gray-400 hover:text-white transition-colors">Featured</a></li>
              <li><a href="/buyer" className="text-gray-400 hover:text-white transition-colors">Best Sellers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-mono">About</h3>
            <ul className="space-y-2">
              <li><a href="/aboutbuyer" className="text-gray-400 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="/artisans" className="text-gray-400 hover:text-white transition-colors">Artisans</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#impact" className="text-gray-400 hover:text-white transition-colors">Our Impact</a></li>
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
      
      {/* How It Works Section */}
      <div id="how-it-works" className="bg-[#eae0d5] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto opacity-0 landing-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">
              Our Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              How SiniLikhain Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From artisan creation to your doorstep - a simple journey of connecting cultures
            </p>
            <div className="w-24 h-1 bg-[#5e503f] mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5e503f] text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-4 pt-2">Creation</h3>
                <p className="text-gray-600">
                  Skilled Filipino artisans craft unique pieces using traditional techniques and sustainable materials.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5e503f] text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-4 pt-2">Curation</h3>
                <p className="text-gray-600">
                  Each piece is carefully selected for our marketplace, ensuring authenticity, quality, and cultural significance.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5e503f] text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-4 pt-2">Connection</h3>
                <p className="text-gray-600">
                  Browse our collections and connect directly with artisans, learning the stories behind their creations.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5e503f] text-white rounded-full flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-4 pt-2">Community</h3>
                <p className="text-gray-600">
                  Your purchase supports artisans' livelihoods and helps preserve Filipino cultural heritage for generations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <div className="relative">
              <div className="absolute inset-0 bg-[#5e503f] blur-md opacity-30 rounded-lg transform -rotate-1"></div>
              <a 
                href="/aboutbuyer" 
                className="relative px-8 py-4 bg-[#5e503f] text-white font-medium rounded-lg inline-flex items-center gap-2 hover:bg-[#4d3f2f] transition-colors duration-300"
              >
                Learn More About Our Process
                <FaArrowRight />
              </a>
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
      
      {/* Artisan Spotlight Section */}
      <div className="bg-[#1b2a41] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto opacity-0 landing-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#eae0d5]/20 text-[#eae0d5] rounded-full text-sm font-medium mb-2">
              Meet Our Creators
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-mono mb-3">
              Artisan Spotlight
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              The skilled hands and creative minds behind our unique Filipino crafts
            </p>
            <div className="w-24 h-1 bg-[#eae0d5] mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-[#22303f] rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-64 overflow-hidden">
                <img 
                  src="/src/images/background.jpg" 
                  alt="Artisan Maria" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Maria Santos</h3>
                <p className="text-sm text-[#eae0d5] mb-3">Textile Weaver, Ilocos Region</p>
                <p className="text-gray-300 mb-4">
                  "My grandmother taught me to weave when I was just eight years old. Each piece carries our family's traditions and stories."
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#eae0d5] text-sm">15+ years experience</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#22303f] rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-64 overflow-hidden">
                <img 
                  src="/src/images/2.jpg" 
                  alt="Artisan Antonio" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Antonio Reyes</h3>
                <p className="text-sm text-[#eae0d5] mb-3">Bamboo Craftsman, Bicol Region</p>
                <p className="text-gray-300 mb-4">
                  "Bamboo is life in our village. It's flexible yet strong - I create pieces that represent our resilience as Filipinos."
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#eae0d5] text-sm">20+ years experience</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#22303f] rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-64 overflow-hidden">
                <img 
                  src="/src/images/3.jpg" 
                  alt="Artisan Elena" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Elena Mabini</h3>
                <p className="text-sm text-[#eae0d5] mb-3">Pottery Artist, Vigan</p>
                <p className="text-gray-300 mb-4">
                  "Clay connects me to my ancestors. Each pot I create is a conversation between the past and present."
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[#eae0d5] text-sm">12+ years experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-[#222] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto opacity-0 landing-section translate-y-8 transition-all duration-700">
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
      
      {/* Impact Statistics Section */}
      <div id="impact" className="bg-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto opacity-0 landing-section translate-y-8 transition-all duration-700 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">
              Our Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              Creating Positive Change
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every purchase helps preserve Filipino craftsmanship and supports artisan communities
            </p>
            <div className="w-24 h-1 bg-[#5e503f] mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-[#eae0d5]/20 p-8 rounded-xl text-center hover:bg-[#eae0d5]/30 transition-all duration-300">
              <h3 className="text-4xl font-bold text-[#5e503f] mb-2">100+</h3>
              <p className="text-lg font-medium text-gray-700">Artisans Supported</p>
              <div className="w-12 h-1 bg-[#5e503f] mx-auto mt-4"></div>
              <p className="mt-4 text-gray-600">Providing sustainable income for talented creators across the Philippines</p>
            </div>
            
            <div className="bg-[#eae0d5]/20 p-8 rounded-xl text-center hover:bg-[#eae0d5]/30 transition-all duration-300">
              <h3 className="text-4xl font-bold text-[#5e503f] mb-2">15</h3>
              <p className="text-lg font-medium text-gray-700">Provinces Reached</p>
              <div className="w-12 h-1 bg-[#5e503f] mx-auto mt-4"></div>
              <p className="mt-4 text-gray-600">Supporting craft traditions from diverse regions across the Philippine archipelago</p>
            </div>
            
            <div className="bg-[#eae0d5]/20 p-8 rounded-xl text-center hover:bg-[#eae0d5]/30 transition-all duration-300">
              <h3 className="text-4xl font-bold text-[#5e503f] mb-2">500+</h3>
              <p className="text-lg font-medium text-gray-700">Unique Products</p>
              <div className="w-12 h-1 bg-[#5e503f] mx-auto mt-4"></div>
              <p className="mt-4 text-gray-600">Each item tells a story and preserves traditional Filipino craftsmanship</p>
            </div>
            
            <div className="bg-[#eae0d5]/20 p-8 rounded-xl text-center hover:bg-[#eae0d5]/30 transition-all duration-300">
              <h3 className="text-4xl font-bold text-[#5e503f] mb-2">85%</h3>
              <p className="text-lg font-medium text-gray-700">Direct to Artisans</p>
              <div className="w-12 h-1 bg-[#5e503f] mx-auto mt-4"></div>
              <p className="mt-4 text-gray-600">Of product sales go directly to supporting the artisans and their communities</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a href="/aboutbuyer" className="inline-flex items-center px-6 py-3 bg-[#5e503f] text-white rounded-full font-medium hover:bg-[#483c30] transition-colors duration-300">
              Learn More About Our Impact
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#5e503f]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5e503f]/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
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

import React, { useState, useEffect } from 'react';
import Navbar from "./NavbarBuyer";
import cartBg from "../images/2.jpg";
import missionImg from "../images/4.jpg";
import visionImg from "../images/1.jpg";
import historyImg from "../images/5.jpg";
import backgroundImg from "../images/6.jpg";
import sigma from "../images/7.jpg";
import craft from "../images/8.jpg";
import { FaHandHoldingHeart, FaEye, FaHistory, FaLightbulb, FaInfoCircle } from 'react-icons/fa';

function About() {
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Add collaborator status state
  const [kahitSaanOnline, setKahitSaanOnline] = useState(null);
  const [nbsOnline, setNbsOnline] = useState(null);
  const [blanktapes, setCollaborators] = useState(null);

  // Check collaborator status on mount
  useEffect(() => {
    // Helper to check if a site is up (using fetch with mode: 'no-cors')
    const checkStatus = async (url, setter) => {
      try {
        await fetch(url, { mode: 'no-cors' });
        setter(true);
      } catch {
        setter(false);
      }
    };
    checkStatus('http://192.168.9.69:5173/', setKahitSaanOnline);
    checkStatus('http://192.168.9.19:5173/', setNbsOnline);
    checkStatus('http://192.168.9.83:5173/', setCollaborators);

  }, []);

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
  React.useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    document.querySelectorAll('.about-section').forEach((section, index) => {
      observer.observe(section);
      // Add staggered delay to animations
      section.style.transitionDelay = `${index * 150}ms`;
    });

    return () => observer.disconnect();
  }, []);

  // Toggle accordion sections
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // FAQ data
  const faqs = [
    {
      question: "How does SiniLikhain ensure product authenticity?",
      answer: "Each artisan undergoes a verification process, and our team personally reviews all products before they are listed on the marketplace to ensure they meet our quality and authenticity standards."
    },
    {
      question: "Can I request custom-made products?",
      answer: "Yes! Many of our artisans accept custom orders. You can contact them directly through our messaging system to discuss your specific requirements and preferences."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, digital wallets, and bank transfers. All transactions are secured with industry-standard encryption to protect your information."
    },
    {
      question: "How does shipping work?",
      answer: "Shipping options vary by artisan location and product type. Each product page displays detailed shipping information, including estimated delivery times and shipping costs."
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero section with parallax effect */}
      <div
        className="relative h-[50vh] min-h-[300px] overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url(${cartBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 text-center px-4 w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white font-mono tracking-wider drop-shadow-2xl" style={{textShadow: '2px 2px 8px #000'}}>
            About SiniLikhain
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-light drop-shadow-2xl" style={{textShadow: '1px 1px 6px #000'}}>
            Connecting Tradition with Modern Appreciation
          </p>
          <div className="mt-8">
            <button 
              onClick={() => {
                document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ backgroundColor: '#5e503f' }}
              className="px-6 py-3 text-white rounded-full hover:bg-[#4d3f2f] transition-all duration-300 flex items-center gap-2 mx-auto shadow-2xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>Our Story</span>
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main container */}
      <div id="main-content" className="min-h-screen bg-[#f8f9fa] py-16 px-4 md:px-8 lg:px-16">
        {/* Introduction section */}
        <div className="max-w-7xl mx-auto mb-24 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              More Than Just A Marketplace
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SiniLikhain is a celebration of Filipino craftsmanship, connecting artisans with those who value authenticity and tradition.
            </p>
            <div className="w-24 h-1 bg-[#5e503f] mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <img 
                src={cartBg} 
                alt="Handcrafted products" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
                style={{ maxHeight: "500px" }}
              />
              <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="text-[#5e503f] font-medium text-lg">
                  Founded in 2023
                </p>
                <p className="text-gray-600">
                  Supporting over 200+ local artisans
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1b2a41]">Introduction</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Welcome to <span className="font-bold text-[#5e503f]">SiniLikhain</span>, an e-commerce platform dedicated to
                showcasing the creativity and craftsmanship of talented artisans. Our mission
                is to connect skilled creators with customers who value unique, handmade, and
                high-quality products.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Every product tells a story—of cultural heritage, personal expression, and the dedication of Filipino craftspeople. 
                By supporting these artisans, you're not just purchasing an item; you're preserving traditions and empowering communities.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#5e503f]/10 p-3 rounded-full text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Authentic</h4>
                    <p className="text-sm text-gray-600">Genuine handcrafted products</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#5e503f]/10 p-3 rounded-full text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Ethical</h4>
                    <p className="text-sm text-gray-600">Fair compensation for artisans</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#5e503f]/10 p-3 rounded-full text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Sustainable</h4>
                    <p className="text-sm text-gray-600">Eco-friendly practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#5e503f]/10 p-3 rounded-full text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Cultural</h4>
                    <p className="text-sm text-gray-600">Preserving heritage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our values section with cards */}
        <div className="max-w-7xl mx-auto mb-24 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              What Drives Us
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our core principles guide everything we do at SiniLikhain
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5e503f]">
              <div className="bg-[#5e503f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaHandHoldingHeart className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To promote sustainable practices and fair compensation while connecting talented artisans with a global audience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5e503f]">
              <div className="bg-[#5e503f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaEye className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Vision</h3>
              <p className="text-gray-600">
                To become the leading marketplace for authentic handcrafted Filipino products while preserving traditional craftsmanship.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5e503f]">
              <div className="bg-[#5e503f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaHistory className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our History</h3>
              <p className="text-gray-600">
                Born from a passion for Filipino culture and a desire to support artisans in the digital era.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5e503f]">
              <div className="bg-[#5e503f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaLightbulb className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Background</h3>
              <p className="text-gray-600">
                Emerged from community engagements and art fairs to address the need for digital platforms for local artisans.
              </p>
            </div>
          </div>
        </div>
        
        {/* Image gallery */}
        <div className="max-w-7xl mx-auto mb-24 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">Our Showcase</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              Artisanal Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A glimpse into the craftsmanship available on SiniLikhain
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 row-span-2">
              <img 
                src={sigma} 
                alt="Featured handcrafted product" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ height: "100%", maxHeight: "400px" }}
              />
            </div>
            <div>
              <img 
                src={craft} 
                alt="Product showcase" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ height: "100%", maxHeight: "200px" }}
              />
            </div>
            <div>
              <img 
                src={visionImg} 
                alt="Product showcase" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ height: "100%", maxHeight: "200px" }}
              />
            </div>
            <div>
              <img 
                src={historyImg} 
                alt="Product showcase" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ height: "100%", maxHeight: "200px" }}
              />
            </div>
            <div>
              <img 
                src={backgroundImg} 
                alt="Product showcase" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ height: "100%", maxHeight: "200px" }}
              />
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-24 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about SiniLikhain
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button 
                  className={`w-full text-left p-4 flex justify-between items-center focus:outline-none ${activeAccordion === index ? 'bg-[#5e503f] text-black' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transition-transform duration-300 ${activeAccordion === index ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === index ? 'max-h-40 py-4' : 'max-h-0'}`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to action */}
        <div className="max-w-5xl mx-auto text-center mb-12 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="bg-gradient-to-br from-[#5e503f] to-[#3d332a] text-white py-12 px-8 rounded-xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wide">
                Discover Unique Handcrafted Treasures
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Explore our curated collection of authentic Filipino crafts and connect with the 
                stories behind each unique piece. SiniLikhain brings artisanal excellence to you.
              </p>
              <div className="flex justify-center">
                <button 
                  className="bg-white text-[#5e503f] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 shadow-md hover:shadow-lg"
                  onClick={() => window.location.href='/buyer'}
                >
                  Explore Products
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add keyframes for fadeIn animation */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }
          .bg-pattern {
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
          }
        `}</style>
      </div>
      
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
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in" />
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
                <li><a href="#artisans" className="text-gray-400 hover:text-white transition-colors">Artisans</a></li>
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
          
          {/* Collaboration section - inserted before copyright */}
          <div className="mt-10 mb-8">
            <h3 className="text-center text-lg font-semibold mb-4 font-mono">In Collaboration With</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {/* Example Collaborator 1 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-md">
                  <a href="http://192.168.9.69:5173/" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="../src/images/LogoWhite.webp" 
                      alt="Kahit Saan Logo"
                      className="w-12 h-12 object-contain"
                    />
                  </a>
                </div>
                <p className="text-gray-400 text-sm">Kahit Saan</p>
                <span
                  className={`mt-1 text-xs font-semibold ${
                    kahitSaanOnline === null
                      ? 'text-gray-400'
                      : kahitSaanOnline
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {kahitSaanOnline === null
                    ? 'Checking...'
                    : kahitSaanOnline
                    ? 'Online'
                    : 'Offline'}
                </span>
              </div>
              {/* Example Collaborator 2 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-md">
                  <a href="http://192.168.9.19:5173/" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="../src/images/nbs.svg" 
                      alt="National Book Store Logo"
                      className="w-12 h-12 object-contain"
                    />
                  </a>
                </div>
                <p className="text-gray-400 text-sm">National Book Store</p>
                <span
                  className={`mt-1 text-xs font-semibold ${
                    nbsOnline === null
                      ? 'text-gray-400'
                      : nbsOnline
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {nbsOnline === null
                    ? 'Checking...'
                    : nbsOnline
                    ? 'Online'
                    : 'Offline'}
                </span>
              </div>
              {/* Example Collaborator 3 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-md">
                  <a href="http://192.168.9.83:5173/" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="http://192.168.9.83:5173/src/img/logowhite.png" 
                      alt="National Book Store Logo"
                      className="w-12 h-12 object-contain"
                    />
                  </a>
                </div>
                <p className="text-gray-400 text-sm">Blank Tapes</p>
                <span
                  className={`mt-1 text-xs font-semibold ${
                    nbsOnline === null
                      ? 'text-gray-400'
                      : nbsOnline
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {nbsOnline === null
                    ? 'Checking...'
                    : nbsOnline
                    ? 'Online'
                    : 'Offline'}
                </span>
              </div>
              {/* Add more collaborators as needed */}
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} SiniLikhain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default About;

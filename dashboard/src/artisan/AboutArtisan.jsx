import ArtisanLayout from "./ArtisanLayout";
import React, { useState } from "react";
import cartBg from "../images/2.jpg";
import missionImg from "../images/4.jpg";
import visionImg from "../images/1.jpg";
import historyImg from "../images/5.jpg";
import backgroundImg from "../images/6.jpg";
import { FaHandHoldingHeart, FaEye, FaHistory, FaLightbulb } from 'react-icons/fa';

function AboutArtisan() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  
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

  // FAQ data for artisans
  const faqs = [
    {
      question: "How do I get started selling on SiniLikhain?",
      answer: "To start selling, complete your artisan profile, upload high-quality photos of your products with detailed descriptions, and set your pricing and shipping options. Once approved by our team, your products will be visible to buyers."
    },
    {
      question: "What fees does SiniLikhain charge?",
      answer: "SiniLikhain takes a small commission on each sale to cover platform maintenance and marketing. The exact percentage can be found in your artisan dashboard. There are no listing fees or monthly charges."
    },
    {
      question: "How do I receive payment for my sales?",
      answer: "Payments are processed securely through our platform. Once an order is completed and delivered, funds will be available in your artisan dashboard. You can withdraw funds to your linked bank account at any time."
    },
    {
      question: "Can I offer custom products to buyers?",
      answer: "Yes! We encourage artisans to offer customization options. You can communicate directly with buyers through our messaging system to discuss custom orders and special requests."
    }
  ];

  return (
    <ArtisanLayout>
      {/* Main container */}
      <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 md:px-8 lg:px-16">
        {/* Hero section */}
        <div className="max-w-5xl mx-auto text-center mb-16 opacity-0 about-section translate-y-8 transition-all duration-700">
          <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">Our Platform</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1b2a41] font-mono tracking-wide">
            About SiniLikhain
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            A platform connecting skilled artisans with those who appreciate unique, handcrafted treasures
          </p>
          <div className="w-24 h-1 bg-[#5e503f] mx-auto"></div>
        </div>
        
        {/* Introduction section */}
        <div className="max-w-7xl mx-auto mb-20 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1b2a41] font-mono">Introduction</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Welcome to <span className="font-bold text-[#5e503f]">SiniLikhain</span>, an e-commerce platform dedicated to
                showcasing the creativity and craftsmanship of talented artisans. Our mission
                is to connect skilled creators with customers who value unique, handmade, and
                high-quality products.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                For artisans like you, we provide a dedicated space to showcase your talent, connect with customers who appreciate handcrafted goods, and grow your business with our supportive community.
              </p>
              <div className="flex items-center gap-4 p-4 bg-[#5e503f]/10 rounded-lg">
                <div className="rounded-full bg-[#5e503f] p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">
                  As an artisan, you can manage your products, track orders, and interact directly with your customers through your dashboard.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={cartBg} 
                alt="Handcrafted products" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
                style={{ maxHeight: "400px" }}
              />
              <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="text-[#5e503f] font-medium text-lg">Artisan Community</p>
                <p className="text-gray-600">Join our growing family of creators</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our values section with cards */}
        <div className="max-w-7xl mx-auto mb-20 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              The SiniLikhain Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Why artisans choose our platform to showcase their work
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
                Born from a passion for Filipino culture and a desire to support artisans struggling to market their work in the digital era.
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
        
        {/* Benefits for artisans */}
        <div className="max-w-7xl mx-auto mb-20 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="bg-gradient-to-br from-[#5e503f] to-[#3d332a] text-white p-8 md:p-12 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
            <div className="relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">
                  Why Sell on SiniLikhain?
                </h2>
                <p className="text-lg max-w-3xl mx-auto opacity-90">
                  Join hundreds of artisans who have found success on our platform
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                  <p className="opacity-90">Expand your customer base beyond local markets to reach buyers nationwide.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
                  <p className="opacity-90">Set your own prices and receive fair compensation for your craftsmanship.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="opacity-90">Connect with fellow artisans, share insights, and grow together.</p>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <button 
                  className="bg-white text-[#5e503f] px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors duration-200"
                  onClick={() => window.location.href='/artisan/manage-products'}
                >
                  Manage My Products
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Artisan FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              Artisan Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Answers to common questions for SiniLikhain artisans
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button 
                  className={`w-full text-left p-4 flex justify-between items-center focus:outline-none ${activeAccordion === index ? 'bg-[#5e503f] text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
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
    </ArtisanLayout>
  );
}

export default AboutArtisan;

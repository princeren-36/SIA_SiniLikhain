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
      question: "How do I showcase my products effectively?",
      answer: "Upload high-quality photos from multiple angles, write detailed descriptions highlighting materials and techniques, and include your inspiration behind each piece. Consider adding short video demonstrations of your craft process when possible."
    },
    {
      question: "How are products approved for the marketplace?",
      answer: "Our admin team reviews each product submission for quality, originality, and alignment with our marketplace values. Most products are reviewed within 24-48 hours. You'll receive a notification once approved."
    },
    {
      question: "How can I increase my visibility on SiniLikhain?",
      answer: "Complete your artisan profile with your story and craft techniques, maintain consistent product uploads, respond promptly to customer inquiries, and participate in our featured artisan programs and seasonal promotions."
    },
    {
      question: "How do I handle shipping and deliveries?",
      answer: "You can manage your shipping options in your dashboard settings. We recommend setting clear shipping timeframes and using our integrated tracking system to keep buyers updated on their order status."
    },
    {
      question: "How do I track my sales and performance?",
      answer: "Your dashboard provides real-time statistics including total products, average buyer ratings, and completed sales. Use these metrics to identify your most popular products and understand your business growth over time."
    },
    {
      question: "Can I offer customized products to buyers?",
      answer: "Yes! You can indicate which products can be customized in the product description. When a buyer requests customization, you'll receive a special order notification to discuss details before confirming the order."
    }
  ];

  return (
    <ArtisanLayout>
      {/* Main container */}
      <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 md:px-8 lg:px-16">
        {/* Hero section */}
        <div className="max-w-5xl mx-auto text-center mb-16 opacity-0 about-section translate-y-8 transition-all duration-700">
          <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">Artisan Portal</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1b2a41] font-mono tracking-wide">
            Artisan Resources
          </h1>
          <p className="text-lg text-[#18181b] max-w-3xl mx-auto mb-8">
            Your guide to managing and growing your Filipino craft business on SiniLikhain
          </p>
          <div className="w-24 h-1 bg-[#5e503f] mx-auto"></div>
        </div>
        
        {/* Introduction section */}
        <div className="max-w-7xl mx-auto mb-20 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1b2a41] font-mono">Your Artisan Journey</h3>
              <p className="text-[#18181b] leading-relaxed mb-6">
                As a <span className="font-bold text-[#5e503f]">SiniLikhain Artisan</span>, you're part of a thriving community dedicated to celebrating Filipino craftsmanship. Your dashboard provides all the tools you need to showcase your creations, manage orders, and connect with customers who value handmade products.
              </p>
              <p className="text-[#18181b] leading-relaxed mb-6">
                Our platform is designed to highlight your unique skills and stories, bringing traditional crafting techniques and contemporary artistry to a wider audience while ensuring you receive fair compensation for your work.
              </p>
              <div className="flex items-center gap-4 p-4 bg-[#5e503f]/10 rounded-lg">
                <div className="rounded-full bg-[#5e503f] p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-[#18181b]">
                  This guide will help you navigate your artisan dashboard and make the most of our platform features.
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
                <p className="text-[#5e503f] font-medium text-lg">Your Artisan Dashboard</p>
                <p className="text-[#18181b]">Manage products, orders & more</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our values section with cards */}
        <div className="max-w-7xl mx-auto mb-20 opacity-0 about-section translate-y-8 transition-all duration-700">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[#5e503f]/10 text-[#5e503f] rounded-full text-sm font-medium mb-2">Key Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b2a41] font-mono mb-3">
              Your Artisan Dashboard
            </h2>
            <p className="text-lg text-[#18181b] max-w-3xl mx-auto">
              Powerful tools designed to showcase your craft and grow your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5e503f]">
              <div className="bg-[#5e503f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaHandHoldingHeart className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#1b2a41] mb-2">Product Management</h3>
              <p className="text-[#18181b]">
                Easily upload, edit and organize your handcrafted products with our intuitive management system.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5e503f]">
              <div className="bg-[#5e503f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaEye className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#1b2a41] mb-2">Order Tracking</h3>
              <p className="text-[#18181b]">
                Monitor orders from placement to delivery with real-time updates and customer communication tools.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5e503f]">
              <div className="bg-[#5e503f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaHistory className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#1b2a41] mb-2">Sales Analytics</h3>
              <p className="text-[#18181b]">
                Track your performance with detailed insights on product views, sales trends, and customer demographics.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-[#5e503f]">
              <div className="bg-[#5e503f]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaLightbulb className="text-[#5e503f] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#1b2a41] mb-2">Profile Customization</h3>
              <p className="text-[#18181b]">
                Tell your story and showcase your craft heritage with a customizable artisan profile.
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
                  Grow Your Artisan Business
                </h2>
                <p className="text-lg max-w-3xl mx-auto opacity-90 text-[#18181b]">
                  Strategies to increase your sales and customer engagement
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#18181b]">Visual Storytelling</h3>
                  <p className="opacity-90 text-[#18181b]">Use high-quality photos and videos to highlight your crafting process and the cultural heritage behind your work.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#18181b]">Track Your Growth</h3>
                  <p className="opacity-90 text-[#18181b]">Use your dashboard statistics to monitor sales trends and identify which products resonate with your customers.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-[#5e503f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#18181b]">Build Relationships</h3>
                  <p className="opacity-90 text-[#18181b]">Connect with your buyers through prompt responses, personalized service, and follow-ups on completed orders.</p>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <button 
                  className="bg-white text-[#5e503f] px-8 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors duration-200 mr-4"
                  onClick={() => window.location.href='/artisan/add-product'}
                >
                  Add New Product
                </button>
                <button 
                  className="bg-white/20 text-[#18181b] border border-white/50 px-8 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors duration-200"
                  onClick={() => window.location.href='/artisan/dashboard'}
                >
                  View Your Statistics
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
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#18181b] max-w-3xl mx-auto">
              Answers to help you succeed as a SiniLikhain artisan
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button 
                  className={`w-full text-left p-4 flex justify-between items-center focus:outline-none ${activeAccordion === index ? 'bg-[#5e503f]' : 'bg-white'} ${activeAccordion === index ? 'text-[#18181b]' : 'text-[#18181b]'} hover:bg-gray-50`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-medium text-[#18181b]">{faq.question}</span>
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
                  <p className="text-[#18181b]">{faq.answer}</p>
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

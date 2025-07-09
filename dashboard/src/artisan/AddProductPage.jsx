import React, { useState, useEffect } from "react";
import ArtisanLayout from "./ArtisanLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cartBg from '../images/2.jpg';
import { API_BASE } from '../utils/api';

const AddProductPage = () => {
  const [formData, setFormData] = useState({ name: "", price: "", image: null, quantity: 1, category: "" });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Get user from localStorage or sessionStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: '' }));
    } else {
      setPreview(null);
    }
  };

  const validateForm = () => {
    let currentErrors = {};
    let isValid = true;
    if (!formData.name.trim()) {
      currentErrors.name = "Product name is required.";
      isValid = false;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      currentErrors.price = "Price must be a positive number.";
      isValid = false;
    }
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      currentErrors.quantity = "Quantity must be a positive integer.";
      isValid = false;
    }
    if (!formData.category.trim()) {
      currentErrors.category = "Category is required.";
      isValid = false;
    }
    if (!formData.image) {
      currentErrors.image = "Product image is required.";
      isValid = false;
    }
    setErrors(currentErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("artisan", user.username);
    data.append("userId", String(user._id)); // Ensure userId is a string
    if (formData.image) data.append("image", formData.image);
    data.append("quantity", formData.quantity);
    data.append("category", formData.category);
    // Set product status as pending for admin approval
    data.append("status", "pending");
    console.log('user:', user);
    console.log('user._id:', user && user._id);
    for (let pair of data.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }
    try {
      await axios.post(`${API_BASE}/products`, data);
      alert("Product submitted successfully and awaiting admin approval!");
      navigate("/artisan/products");
    } catch (err) {
      alert("Error submitting product. Please try again.");
    }
  };

  return (
    <ArtisanLayout>
      <div className="flex flex-col w-full">
        {/* Banner header from AddProduct.jsx */}
        <div className="relative w-full overflow-hidden" style={{height: '280px'}}>
          <img src={cartBg} alt="Products Background" className="w-full h-full object-cover opacity-80 select-none pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">ADD NEW PRODUCT</h1>
            <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">Create and showcase your handcrafted masterpieces to the world.</p>
          </div>
        </div>

        <div className="w-full p-6 md:p-8" style={{ backgroundColor: '#18181b', color: 'white' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold addproduct-title" style={{ color: '#fff' }}>Add New Product</h2>
          </div>

          {/* Admin Approval Info Card */}
          <div className="mb-8 p-4 rounded-lg border-l-4" style={{ backgroundColor: '#23232b', borderColor: '#3b82f6', color: '#b6d4fe' }}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Product Approval Required</h3>
                <div className="mt-1 text-sm opacity-90">
                  <p>All new products will be reviewed by our admin team before being listed in the marketplace. This process typically takes 24-48 hours.</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: '#e5e7eb' }}>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ backgroundColor: '#23232b', color: '#fff', borderColor: errors.name ? '#ef4444' : '#333' }}
                  />
                  {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: '#e5e7eb' }}>Price (₱)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      style={{ backgroundColor: '#23232b', color: '#fff', borderColor: errors.price ? '#ef4444' : '#333' }}
                    />
                    {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: '#e5e7eb' }}>Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      style={{ backgroundColor: '#23232b', color: '#fff', borderColor: errors.quantity ? '#ef4444' : '#333' }}
                    />
                    {errors.quantity && <div className="text-red-500 text-xs mt-1">{errors.quantity}</div>}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: '#e5e7eb' }}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ backgroundColor: '#23232b', color: '#fff', borderColor: errors.category ? '#ef4444' : '#333' }}
                  >
                    <option value="">Select Category</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Art">Art</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
                </div>
              </div>

              {/* Right: Image Upload with improved styling */}
              <div>
                <label className="block font-semibold mb-1" style={{ color: '#fff' }}>Product Image</label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] relative" style={{ backgroundColor: '#23232b', borderColor: errors.image ? '#ef4444' : '#666' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  
                  {preview ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-60 max-w-full mb-4 rounded-md shadow-md" 
                      />
                      <p className="text-sm" style={{ color: '#e5e7eb' }}>Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium text-lg mb-1" style={{ color: '#fff' }}>Drop your image here</p>
                      <p className="text-sm mb-4" style={{ color: '#e5e7eb' }}>Or click to browse</p>
                      <button 
                        type="button" 
                        className="px-4 py-2 bg-[#386641] text-white rounded-md hover:opacity-90 transition-colors font-semibold shadow"
                        style={{ color: '#fff', backgroundColor: '#386641' }}
                        onClick={() => document.querySelector('input[type="file"]').click()}
                      >
                        Select File
                      </button>
                      <p className="mt-4 text-xs" style={{ color: '#bdbdbd' }}>
                        Supported formats: JPG, PNG, WEBP (max 10MB)
                      </p>
                    </div>
                  )}
                  {errors.image && <div className="text-red-500 text-xs mt-2 absolute bottom-2">{errors.image}</div>}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 gap-4">
              <button
                type="button"
                onClick={() => navigate('/artisan/products')}
                className="px-6 py-2 border-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                style={{ borderColor: '#386641', color: '#386641' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg font-semibold text-white shadow transition"
                style={{ backgroundColor: '#386641' }}
              >
                Submit for Approval
              </button>
            </div>
          </form>
        </div>
      </div>
    </ArtisanLayout>
  );
};

export default AddProductPage;

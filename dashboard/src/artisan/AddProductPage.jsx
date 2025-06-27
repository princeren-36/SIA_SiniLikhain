import React, { useState, useEffect } from "react";
import ArtisanLayout from "./ArtisanLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    if (formData.image) data.append("image", formData.image);
    data.append("quantity", formData.quantity);
    data.append("category", formData.category);
    try {
      await axios.post("http://localhost:5000/products", data);
      alert("Product added successfully!");
      navigate("/artisan/products");
    } catch (err) {
      alert("Error saving product. Please try again.");
    }
  };

  const bgColor = isDarkMode ? 'bg-[#18181b]' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const labelColor = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const inputBg = isDarkMode ? 'bg-[#23232b] text-white border-gray-700' : 'bg-white text-black border-gray-300';

  return (
    <ArtisanLayout>
      <div className="flex flex-col w-full">
        <div className={`min-h-screen w-full ${bgColor} py-8 flex flex-col`}>
          <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
            {/* Upper left: Title and Description */}
            <div className="w-full md:w-2/3 lg:w-1/2 mb-6 px-4 md:px-0">
              <h1 className={`text-4xl font-bold mb-2 ${textColor}`}>Add Product</h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fill out the form to add a new product to your artisan shop. Make sure to provide accurate details and a clear product image.</p>
            </div>
            {/* Form full width below heading, responsive, fits screen but leaves sidebar */}
            <form onSubmit={handleSubmit} className="flex-1 w-full flex flex-col items-center justify-center">
              <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Fields */}
                <div className="space-y-4">
                  <div>
                    <label className={`block font-semibold mb-1 ${labelColor}`}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputBg} ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1 ${labelColor}`}>Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputBg} ${errors.price ? 'border-red-500' : ''}`}
                      />
                      {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1 ${labelColor}`}>Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputBg} ${errors.quantity ? 'border-red-500' : ''}`}
                      />
                      {errors.quantity && <div className="text-red-500 text-xs mt-1">{errors.quantity}</div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1 ${labelColor}`}>Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputBg} ${errors.category ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Category</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home Decor">Home Decor</option>
                        <option value="Art">Art</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
                    </div>
                    <div></div>
                  </div>
                </div>
                {/* Right: Image Upload */}
                <div className="flex flex-col items-center justify-start w-full">
                  <label className={`block font-semibold mb-1 w-full ${labelColor}`}>Product Image</label>
                  <div className={`flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl ${isDarkMode ? 'bg-[#23232b]' : 'bg-blue-50'} w-full max-w-xs min-h-[220px] p-6 relative`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      style={{ width: '100%', height: '100%' }}
                    />
                    {preview ? (
                      <img src={preview} alt="Preview" className="max-h-32 mb-2 rounded shadow" style={{maxWidth:'100%'}} />
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#60a5fa" className="mb-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4h6v4a1 1 0 01-1 1z" /></svg>
                          <span className={`text-gray-500 text-sm mb-2 ${isDarkMode ? 'text-gray-300' : ''}`}>Drop product image here</span>
                          <span className={`text-gray-400 text-xs mb-2 ${isDarkMode ? 'text-gray-300' : ''}`}>Or</span>
                          <button type="button" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">Browse File</button>
                        </div>
                      </>
                    )}
                    <div className="text-xs text-gray-400 mt-2 text-center">Allowed JPEG, JPG & PNG format | Max 100 mb</div>
                    {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-2 mt-6 w-full max-w-5xl mx-auto">
                <button
                  type="submit"
                  className="addproduct-submit-btn text-white px-5 py-2 rounded-lg font-semibold shadow transition flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                  style={{ backgroundColor: '#073b4c' }}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="addproduct-cancel-btn border border-gray-400 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                  onClick={() => navigate('/artisan/products')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ArtisanLayout>
  );
};

export default AddProductPage;

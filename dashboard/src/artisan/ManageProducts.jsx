import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArtisanLayout from "./ArtisanLayout";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { BiSave, BiX } from "react-icons/bi";
import { FaSearch, FaFilter, FaImage } from "react-icons/fa";
import cartBg from '../images/2.jpg';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Search and filter states
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: 1,
    category: "",
    image: null
  });
  // Preview image for the edit form
  const [imagePreview, setImagePreview] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  // Get user from localStorage or sessionStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  useEffect(() => {
    // Check if user is logged in and is an artisan
    if (!user || user.role !== "artisan") {
      navigate("/");
      return;
    }
    
    // Fetch products belonging to this artisan
    fetchProducts();

    // Dark mode detection
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [user, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/products");
      // Filter products by artisan (match _id, username, or email for compatibility)
      const artisanProducts = res.data.filter(p =>
        p.artisan === user._id ||
        p.artisan === user.username ||
        p.artisan === user.email
      );
      setProducts(artisanProducts);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a product
  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      image: null
    });
    // Set image preview if the product has an image
    if (product.image) {
      setImagePreview(`http://localhost:5000${product.image}`);
    } else {
      setImagePreview(null);
    }
    setShowEditModal(true);
  };

  // Handle saving edits
  const handleSaveEdit = async (id) => {
    try {
      // Create FormData for multipart form submission (needed for image upload)
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("description", editFormData.description || "");
      formData.append("price", editFormData.price);
      formData.append("quantity", editFormData.quantity);
      formData.append("category", editFormData.category);
      formData.append("artisan", user._id);
      
      // Only append image if a new one is selected
      if (editFormData.image) {
        formData.append("image", editFormData.image);
      }

      // Update product details
      await axios.put(`http://localhost:5000/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh product list
      fetchProducts();
      setEditingId(null);
      setImagePreview(null);
      setShowEditModal(false);
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product. Please try again.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setImagePreview(null);
    setShowEditModal(false);
  };

  // Handle form change for editing
  const handleEditChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      // Handle file input (image upload)
      if (files && files[0]) {
        setEditFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
        
        // Create a preview URL for the selected image
        const previewUrl = URL.createObjectURL(files[0]);
        setImagePreview(previewUrl);
      }
    } else {
      // Handle other input types
      setEditFormData((prev) => ({
        ...prev,
        [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
      }));
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    setConfirmDelete(id);
  };

  // Handle actual deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setConfirmDelete(null);
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product. Please try again.");
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    
    const matchesStatus = statusFilter 
      ? (statusFilter === "approved" ? product.status === "approved"
        : statusFilter === "pending" ? product.status === "pending"
        : statusFilter === "rejected" ? product.status === "rejected"
        : true)
      : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      <ArtisanLayout blurOverlay={showEditModal}>
        <div className="flex flex-col w-full">
          {/* Banner section - Styled like AddProduct.jsx */}
          <div className="relative w-full overflow-hidden" style={{height: '280px'}}>
            <img src={cartBg} alt="Products Background" className="w-full h-full object-cover opacity-80 select-none pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">MANAGE PRODUCTS</h1>
              <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">Edit or delete your artisan creations and keep your inventory up to date.</p>
            </div>
          </div>
          
          <div className={`w-full p-6 md:p-8 ${isDarkMode ? 'bg-[#23232b] text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Manage Products</h2>
            </div>

            {/* Product Status Guide - curvy card with thin colored left border */}
            <div className={`mb-6 flex items-start gap-4 rounded-2xl shadow p-4 border-l-4 ${
              isDarkMode
                ? 'bg-[#23232b] text-purple-100 border-purple-600'
                : 'bg-purple-50 text-purple-800 border-purple-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <div>
                <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>Product Status Guide</h3>
                <ul className={`list-disc pl-5 ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>
                  <li>You can only edit products that have been approved by administrators.</li>
                  <li>New products have a "pending" status and will be reviewed by administrators.</li>
                  <li>Products may be rejected if they do not meet the platform guidelines.</li>
                  <li>You can delete products in any status.</li>
                </ul>
              </div>
            </div>

            {/* Search and filter section */}
            <div className={`mb-8 flex flex-col md:flex-row items-center gap-4 ${isDarkMode ? 'bg-[#2a2a33]' : 'bg-gray-50'} p-4 rounded-lg shadow-sm`}>
              {/* Search input */}
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-[#3a3a45] border-gray-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Filter dropdown trigger */}
              <div className="flex flex-col items-start gap-2 w-full md:w-auto relative">
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className={`flex items-center gap-2 border-2 px-4 py-2 rounded-lg font-semibold transition text-sm shadow ${
                    isDarkMode
                      ? (showFilter ? 'border-purple-500 text-purple-300 bg-[#23232b] hover:bg-[#2a2a33]' : 'border-purple-400 text-purple-300 bg-[#23232b] hover:bg-[#2a2a33]')
                      : (showFilter ? 'border-purple-400 text-purple-700 bg-white hover:bg-purple-50' : 'border-purple-400 text-purple-700 bg-white hover:bg-purple-50')
                  }`} 
                  style={{ minWidth: '120px', position: 'relative', zIndex: 30 }}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm4 4h8m-8 4h8m-8 4h8" /></svg>
                  Filter
                </button>
                {showFilter && (
                  <div className={`absolute left-0 mt-2 w-48 rounded-lg shadow-lg z-50 border-2 ${
                    isDarkMode
                      ? 'bg-purple-900 border-purple-500 text-purple-200'
                      : 'bg-purple-50 border-purple-400 text-purple-700'
                  }`} style={{top: '100%'}}>
                    <div className="p-4">
                      <label className="block mb-2 font-semibold">Category</label>
                      <select
                        className={`w-full border rounded px-2 py-1 ${isDarkMode ? 'bg-purple-950 border-purple-700 text-purple-100' : 'bg-purple-100 border-purple-400 text-purple-700'}`}
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                      >
                        <option value="">All</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products table */}
            {error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            ) : (
              <div className={`overflow-x-auto ${isDarkMode ? 'bg-[#2a2a33]' : 'bg-white'} rounded-lg shadow border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={isDarkMode ? 'bg-[#3a3a45]' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Image</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FaImage className={`text-5xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                            <p className="text-lg font-medium">No products found</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters or adding new products</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(product => (
                        <tr key={product._id} className={`${isDarkMode ? 'hover:bg-[#3a3a45]' : 'hover:bg-gray-50'} transition-colors`}>
                          {/* Image cell */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingId === product._id ? (
                              <div className="flex flex-col space-y-2">
                                <div className="relative group">
                                  {imagePreview ? (
                                    <img 
                                      src={imagePreview} 
                                      alt="Preview" 
                                      className="h-16 w-16 object-cover rounded-lg border-2 border-purple-500" 
                                    />
                                  ) : product.image ? (
                                    <img 
                                      src={`http://localhost:5000${product.image}`} 
                                      alt={product.name}
                                      className="h-16 w-16 object-cover rounded-lg border-2 border-purple-500" 
                                    />
                                  ) : (
                                    <div className="h-16 w-16 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg">
                                      <FaImage className="text-gray-400 text-xl" />
                                    </div>
                                  )}
                                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                                    <span className="text-white text-xs font-medium">Change</span>
                                    <input
                                      type="file"
                                      name="image"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleEditChange}
                                    />
                                  </label>
                                </div>
                                <span className="text-xs text-gray-500">Click to change</span>
                              </div>
                            ) : (
                              product.image ? (
                                <img 
                                  src={`http://localhost:5000${product.image}`} 
                                  alt={product.name}
                                  className="h-16 w-16 object-cover rounded-lg shadow" 
                                />
                              ) : (
                                <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-lg">
                                  <FaImage className="text-gray-400" />
                                </div>
                              )
                            )}
                          </td>
                          
                          {/* Product name and description cell */}
                          <td className="px-6 py-4">
                            {editingId === product._id ? (
                              <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditChange}
                                className={`w-full p-1 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-[#3a3a45] border-gray-700 text-white' 
                                    : 'bg-white border-gray-200 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                required
                              />
                            ) : (
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.description}</div>
                              </div>
                            )}
                          </td>
                          
                          {/* Category cell */}
                          <td className="px-6 py-4">
                            {editingId === product._id ? (
                              <select
                                name="category"
                                value={editFormData.category}
                                onChange={handleEditChange}
                                className={`w-full p-1 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-[#3a3a45] border-gray-700 text-white' 
                                    : 'bg-white border-gray-200 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                required
                              >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            ) : (
                              product.category
                            )}
                          </td>
                          
                          {/* Price cell */}
                          <td className="px-6 py-4">
                            {editingId === product._id ? (
                              <input
                                type="number"
                                name="price"
                                value={editFormData.price}
                                min="0"
                                step="0.01"
                                onChange={handleEditChange}
                                className={`w-full p-1 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-[#3a3a45] border-gray-700 text-white' 
                                    : 'bg-white border-gray-200 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                required
                              />
                            ) : (
                              `₱${parseFloat(product.price).toFixed(2)}`
                            )}
                          </td>
                          
                          {/* Quantity cell */}
                          <td className="px-6 py-4">
                            {editingId === product._id ? (
                              <input
                                type="number"
                                name="quantity"
                                value={editFormData.quantity}
                                min="1"
                                onChange={handleEditChange}
                                className={`w-full p-1 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-[#3a3a45] border-gray-700 text-white' 
                                    : 'bg-white border-gray-200 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                required
                              />
                            ) : (
                              product.quantity
                            )}
                          </td>
                          
                          {/* Status cell */}
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${product.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : product.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {product.status || 'pending'}
                            </span>
                          </td>
                          
                          {/* Actions cell */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.status === 'pending' ? (
                              <span className="text-yellow-700 font-semibold">Pending Approval</span>
                            ) : editingId === product._id ? (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleSaveEdit(product._id)}
                                  className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-all duration-200 flex items-center"
                                >
                                  <BiSave className="mr-1" />
                                  Save
                                </button>
                                <button 
                                  onClick={handleCancelEdit}
                                  className="text-white bg-gray-500 hover:bg-gray-600 p-2 rounded-lg transition-all duration-200 flex items-center"
                                >
                                  <BiX className="mr-1" />
                                  Cancel
                                </button>
                              </div>
                            ) : confirmDelete === product._id ? (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleDelete(product._id)}
                                  className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 flex items-center"
                                >
                                  Delete
                                </button>
                                <button 
                                  onClick={handleCancelDelete}
                                  className="text-white bg-gray-500 hover:bg-gray-600 p-2 rounded-lg transition-all duration-200 flex items-center"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEdit(product)}
                                  className={`p-2 rounded-lg transition-all duration-200 flex items-center ${
                                    isDarkMode
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                      : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                                  }`}
                                  title="Edit product"
                                  disabled={product.status !== 'approved'}
                                >
                                  <RiEdit2Line />
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteConfirm(product._id)}
                                  className={`p-2 rounded-lg transition-all duration-200 flex items-center ${
                                    isDarkMode
                                      ? 'bg-red-600 hover:bg-red-700 text-white'
                                      : 'bg-red-100 hover:bg-red-200 text-red-600'
                                  }`}
                                  title="Delete product"
                                >
                                  <RiDeleteBin6Line />
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Info card about product status */}
            {/* (Moved and redesigned above) */}
          </div>
        </div>
      </ArtisanLayout>

      {/* Edit Modal rendered outside the blurred content */}
      {showEditModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className={`bg-white dark:bg-[#23232b] rounded-lg shadow-xl p-6 w-full max-w-2xl relative`} style={{ minHeight: 'unset' }}>
              <button onClick={handleCancelEdit} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold">&times;</button>
              <h2 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Edit Product</h2>
              <form onSubmit={e => { e.preventDefault(); handleSaveEdit(editingId); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">Name</label>
                    <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-[#3a3a45] border-gray-700 text-white' : 'bg-purple-50 border-purple-300 text-purple-700'}`} required />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Category</label>
                    <select name="category" value={editFormData.category} onChange={handleEditChange} className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-[#3a3a45] border-gray-700 text-white' : 'bg-purple-50 border-purple-300 text-purple-700'}`} required>
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Price</label>
                    <input type="number" name="price" value={editFormData.price} min="0" step="0.01" onChange={handleEditChange} className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-[#3a3a45] border-gray-700 text-white' : 'bg-purple-50 border-purple-300 text-purple-700'}`} required />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Quantity</label>
                    <input type="number" name="quantity" value={editFormData.quantity} min="1" onChange={handleEditChange} className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-[#3a3a45] border-gray-700 text-white' : 'bg-purple-50 border-purple-300 text-purple-700'}`} required />
                  </div>
                </div>
                <div className="mt-4 flex flex-row items-center justify-center gap-8">
                  <div className="flex-shrink-0">
                    <label className="relative flex flex-col items-center justify-center h-48 w-48 border-2 border-dashed border-purple-400 rounded-lg cursor-pointer transition hover:border-purple-600 bg-purple-50 dark:bg-[#2a2a33]">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="object-cover h-full w-full rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          <FaImage className="text-5xl text-purple-300 mb-2" />
                          <span className="text-purple-400 font-medium">Drop image here or click to upload</span>
                        </div>
                      )}
                      <input type="file" name="image" accept="image/*" onChange={handleEditChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </label>
                  </div>
                  <div className="flex flex-col justify-center h-48">
                    <span className="text-lg font-semibold text-purple-700 dark:text-purple-200">Choose an Image</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" onClick={handleCancelEdit} className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ManageProducts;

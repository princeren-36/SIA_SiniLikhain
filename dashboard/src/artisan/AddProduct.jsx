import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarArtisan from "./NavbarArtisan";
import cartBg from '../images/2.jpg';
import ArtisanLayout from "./ArtisanLayout";

function AddProduct() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [view, setView] = React.useState("addProduct");
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    window.location.href = "/";
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", image: null, quantity: 1, category: "" });
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [errors, setErrors] = useState({});

  // Get user from localStorage or sessionStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "artisan") {
      navigate("/");
    } else {
      axios.get("http://localhost:5000/products").then((res) => {
        const artisanProducts = res.data.filter(p => p.artisan === user.username);
        setProducts(artisanProducts);
      }).catch(err => {
        console.error("Error fetching products:", err);
      });
    }
  }, [user, navigate]);

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

    if (!editId && !formData.image) {
      currentErrors.image = "Product image is required.";
      isValid = false;
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("artisan", user.username);
    if (formData.image) data.append("image", formData.image);
    data.append("quantity", formData.quantity);
    data.append("category", formData.category);

    try {
      if (editId) {
        const res = await axios.put(`http://localhost:5000/products/${editId}`, data);
        setProducts((prev) =>
          prev.map((p) => (p._id === editId ? res.data : p))
        );
        alert("Product updated successfully!");
      } else {
        const res = await axios.post("http://localhost:5000/products", data);
        setProducts((prev) => [...prev, res.data]);
        alert("The piece is in place. Await the gatekeeper's glance before it takes its place.");
      }
      setEditId(null);
      setFormData({ name: "", price: "", image: null, quantity: 1, category: "" });
      setPreview(null);
      setOpenForm(false);
      setErrors({});
    } catch (err) {
      console.error("Error submitting product:", err);
      alert("Error saving product. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      image: null,
      quantity: product.quantity || 1,
      category: product.category || "",
    });
    setPreview(product.image ? `http://localhost:5000${product.image}` : null);
    setOpenForm(true);
    setSelectedProduct(null);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/products/${id}`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
        if (editId === id) {
          setEditId(null);
          setFormData({ name: "", price: "", image: null, quantity: 1, category: "" });
          setPreview(null);
          setOpenForm(false);
        }
        setSelectedProduct(null);
        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ name: "", price: "", image: null, quantity: 1, category: "" });
    setPreview(null);
    setOpenForm(true);
    setErrors({});
  };

  const handleCloseForm = () => {
    setEditId(null);
    setFormData({ name: "", price: "", image: null, quantity: 1, category: "" });
    setPreview(null);
    setOpenForm(false);
    setErrors({});
  };

  // Simple average rating calculation for display
  const getAverageRating = (ratings) => {
    if (!ratings || !ratings.length) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.value, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <ArtisanLayout>
      <div className="min-h-screen flex bg-gray-100 w-full max-w-[1920px] mx-auto overflow-x-hidden">
        <div className="flex-1 flex flex-col md:ml-56 min-w-0">
          <NavbarArtisan />
          <div className="relative w-full max-w-full mb-8 rounded-2xl shadow-lg overflow-hidden" style={{height: '320px', maxHeight: '400px', marginTop: '-1rem'}}>
            <img src={cartBg} alt="Products Background" className="w-full h-full object-cover opacity-80 select-none pointer-events-none" style={{height: '100%', maxWidth: '100%'}} />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">MY PRODUCTS</h1>
              <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">Showcase your creations and manage your artisan shop here.</p>
            </div>
          </div>
          <div className="addproduct-main p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold addproduct-title">My Products</h2>
              <button
                className="addproduct-add-btn flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition border border-black"
                style={{ backgroundColor: '#000', color: '#fff', borderColor: '#000' }}
                onClick={handleOpenAdd}
              >
                <span className="text-xl font-bold">+</span> Add Product
              </button>
            </div>

            {/* Add/Edit Product Modal */}
            {openForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Blurry overlay */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"></div>
                <div className="bg-white rounded-2xl shadow-lg px-6 py-4 w-full max-w-md border-t-4 border-blue-800 animate-fadeIn relative flex flex-col items-center z-10" style={{minHeight: 'unset', maxHeight: '90vh'}}>
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl" onClick={handleCloseForm}>&times;</button>
                  <h3 className="text-xl font-bold mb-4">{editId ? "Edit Product" : "Add Product"}</h3>
                  <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="w-full flex flex-col items-center">
                    <div className="mb-3 w-full">
                      <label className="block font-semibold mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>
                    <div className="mb-3 w-full">
                      <label className="block font-semibold mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                    </div>
                    <div className="mb-3 w-full">
                      <label className="block font-semibold mb-1">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.quantity && <div className="text-red-500 text-xs mt-1">{errors.quantity}</div>}
                    </div>
                    <div className="mb-3 w-full">
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
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
                    <div className="mb-3 w-full">
                      <label className="block font-semibold mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="w-full border rounded px-3 py-2"
                      />
                      {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
                      {preview && (
                        <img src={preview} alt="Preview" className="mt-2 max-w-full h-auto rounded" style={{maxHeight:'120px'}} />
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-2 -mt-2 w-full">
                      <button
                        type="submit"
                        className="addproduct-submit-btn text-white px-5 py-2 rounded-lg font-semibold shadow transition flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                        style={{ backgroundColor: '#073b4c' }}
                      >
                        {editId ? "Update" : "Submit"}
                      </button>
                      <button
                        type="button"
                        className="addproduct-cancel-btn border border-gray-400 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                        onClick={handleCloseForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="addproduct-grid-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 justify-items-center">
              {products.length === 0 ? (
                <div className="col-span-full text-center text-lg mt-8">You have no products yet. Click "Add Product" to get started!</div>
              ) :
                products.map((p) => (
                  <div key={p._id} className="w-[320px] flex flex-col items-center shadow-none rounded-none relative cursor-pointer" style={{ boxShadow: 'none', background: 'white' }} onClick={() => setSelectedProduct(p)}>
                    {/* Image card, visually separated */}
                    <div className="w-full flex justify-center pt-8 pb-4 min-h-[180px]" style={{ background: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                      <img
                        src={`http://localhost:5000${p.image}`}
                        alt={p.name}
                        className="object-contain h-36 w-36"
                        style={{ background: 'white', border: 'none' }}
                      />
                    </div>
                    {/* Product info card with borders */}
                    <div className="w-full border-t border-b border-l border-r border-[#bfa181]" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                      <div className="text-center py-4 px-2 border-b border-[#bfa181]">
                        <span className="font-mono text-lg font-semibold tracking-wider text-black uppercase letter-spacing-wider">{p.name}</span>
                      </div>
                      <div className="flex flex-row border-b border-[#bfa181] relative">
                        <div className="flex items-center justify-center border-r border-[#bfa181] py-3 w-1/2">
                          <span className="font-mono text-base text-black">₱{Number(p.price).toFixed(2)}</span>
                        </div>
                        <div className="w-1/2 relative flex items-center justify-center">
                          <span className="font-mono text-base text-black">Qty: {p.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Blurry overlay */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"></div>
                <div className="bg-white rounded-2xl shadow-lg px-6 py-4 w-full max-w-md border-t-4 border-blue-800 animate-fadeIn relative flex flex-col items-center z-10" style={{minHeight: 'unset', maxHeight: '90vh'}}>
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl" onClick={() => setSelectedProduct(null)}>&times;</button>
                  <img
                    src={`http://localhost:5000${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="w-40 h-40 object-contain rounded-xl mb-4"
                    style={{flexShrink:0}}
                  />
                  <div className="flex flex-col items-center w-full">
                    <div className="text-xl font-bold mb-1 truncate w-full text-center">{selectedProduct.name}</div>
                    <div className="text-black font-semibold mb-2 text-lg">₱{selectedProduct.price}</div>
                    <div className="text-gray-600 mb-2 text-base">Quantity: {selectedProduct.quantity}</div>
                    <div className="flex items-center gap-2 mb-4 justify-center">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="font-semibold">{getAverageRating(selectedProduct.ratings)}</span>
                      <span className="text-gray-500 text-sm">({selectedProduct.ratings ? selectedProduct.ratings.length : 0})</span>
                    </div>
                    <div className="flex justify-center gap-2 mt-2 w-full">
                      <button
                        className="border px-4 py-2 rounded-lg font-semibold transition flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                        style={{ backgroundColor: '#073b4c', color: '#fff', borderColor: '#073b4c' }}
                        onClick={() => handleEdit(selectedProduct)}
                      >
                        Edit
                      </button>
                      <button
                        className="border px-4 py-2 rounded-lg font-semibold transition flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                        style={{ backgroundColor: '#c1121f', color: '#fff', borderColor: '#c1121f' }}
                        onClick={() => handleDelete(selectedProduct._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="border px-4 py-2 rounded-lg font-semibold transition flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                        style={{ backgroundColor: '#000', color: '#fff', borderColor: '#000' }}
                        onClick={() => setSelectedProduct(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ArtisanLayout>
  );
}

export default AddProduct;

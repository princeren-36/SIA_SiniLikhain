import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

  // Search state
  const [search, setSearch] = useState("");
  // Ref for file input
  const importInputRef = React.useRef();

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Filtered products
  const filteredProducts = products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())) &&
    (categoryFilter ? p.category === categoryFilter : true)
  );

  // Toggle filter dropdown
  const handleFilter = () => setShowFilter(f => !f);

  // CSV Export
  const handleExportCSV = () => {
    const csvRows = [
      ["Name", "Category", "Price", "Quantity"],
      ...filteredProducts.map(p => [p.name, p.category, p.price, p.quantity])
    ];
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print
  const handlePrint = () => {
    const printContent = document.getElementById('products-table').outerHTML;
    const win = window.open('', '', 'width=900,height=700');
    win.document.write('<html><head><title>Print</title></head><body>' + printContent + '</body></html>');
    win.document.close();
    win.print();
  };

  // PDF Export (simple)
  const handleExportPDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    doc.text('Products', 10, 10);
    let y = 20;
    doc.text('Name', 10, y);
    doc.text('Category', 60, y);
    doc.text('Price', 110, y);
    doc.text('Quantity', 150, y);
    y += 10;
    filteredProducts.forEach(p => {
      doc.text(p.name, 10, y);
      doc.text(p.category, 60, y);
      doc.text(String(p.price), 110, y);
      doc.text(String(p.quantity), 150, y);
      y += 10;
    });
    doc.save('products.pdf');
  };

  // Import CSV
  const handleImportClick = () => importInputRef.current.click();
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = evt.target.result.split('\n');
      const newProducts = lines.slice(1).map(line => {
        const [name, category, price, quantity] = line.split(',');
        return { name, category, price, quantity };
      }).filter(p => p.name);
      setProducts(prev => [...prev, ...newProducts]);
    };
    reader.readAsText(file);
  };

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return (
    <ArtisanLayout>
      <div className="flex flex-col w-full">
        <div className="relative w-full overflow-hidden" style={{height: '280px'}}>
          <img src={cartBg} alt="Products Background" className="w-full h-full object-cover opacity-80 select-none pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">MY PRODUCTS</h1>
            <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">Showcase your creations and manage your artisan shop here.</p>
          </div>
        </div>
        
        <div className={`w-full p-6 md:p-8 ${isDarkMode ? 'bg-[#18181b] text-white' : 'bg-white text-gray-800'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold addproduct-title">My Products</h2>
          </div>

          {/* Top controls: Add/Import, Search, Filter/Export */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 w-full">
            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 text-white px-6 py-2 rounded-lg font-semibold shadow transition hover:opacity-90"
                style={{ backgroundColor: '#386641' }}
                onClick={() => navigate('/artisan/add-product')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add Product
              </button>
              <button
                className="flex items-center gap-2 text-white px-6 py-2 rounded-lg font-semibold shadow transition hover:opacity-90"
                style={{ backgroundColor: '#003049' }}
                onClick={handleImportClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4m4 4l4 4 4-4" /></svg>
                Import Product
                <input
                  type="file"
                  accept=".csv"
                  ref={importInputRef}
                  onChange={handleImportCSV}
                  style={{ display: 'none' }}
                />
              </button>
            </div>
            <div className="flex-1 flex gap-4 items-center justify-end">
              <input
                type="text"
                placeholder="Search here"
                className={`border rounded-lg px-4 py-2 w-111 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode ? 'bg-[#23232b] border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'
                }`}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="relative">
                <button 
                  className={`flex items-center gap-2 border-2 px-4 py-2 rounded-lg font-semibold transition ${
                    isDarkMode ? 'border-purple-500 text-purple-300 bg-[#23232b] hover:bg-[#2a2a33]' : 'border-purple-400 text-purple-700 bg-white hover:bg-purple-50'
                  }`} 
                  onClick={handleFilter}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm4 4h8m-8 4h8m-8 4h8" /></svg>
                  Filter
                </button>
                {showFilter && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 border-2 ${
                    isDarkMode
                      ? 'bg-purple-900 border-purple-500 text-purple-200'
                      : 'bg-purple-50 border-purple-400 text-purple-700'
                  }`}>
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
              <button 
                className={`border-2 px-3 py-2 rounded-lg transition flex items-center ${
                  isDarkMode ? 'border-orange-400 text-orange-300 bg-[#23232b] hover:bg-[#2a2a33]' : 'border-orange-300 text-orange-600 bg-white hover:bg-orange-50'
                }`} 
                onClick={handleExportPDF}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V6m0 0l-7 7m7-7l7 7" /></svg>
                PDF
              </button>
              <button 
                className={`border-2 px-3 py-2 rounded-lg transition flex items-center ${
                  isDarkMode ? 'border-green-400 text-green-300 bg-[#23232b] hover:bg-[#2a2a33]' : 'border-green-300 text-green-600 bg-white hover:bg-green-50'
                }`} 
                onClick={handleExportCSV}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4V4zm4 4h8m-8 4h8m-8 4h8" /></svg>
                CSV
              </button>
              <button 
                className={`border-2 px-3 py-2 rounded-lg transition flex items-center ${
                  isDarkMode ? 'border-blue-400 text-blue-300 bg-gray-800 hover:bg-gray-700' : 'border-blue-300 text-blue-600 bg-white hover:bg-blue-50'
                }`} 
                onClick={handlePrint}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9v6m6-6v6m6-6v6" /></svg>
                Print
              </button>
            </div>
          </div>
          
          {/* Product Table */}
          <div className={`rounded-lg shadow-sm border ${isDarkMode ? 'bg-[#23232b] border-gray-700' : 'bg-white border-gray-200'} p-4`}>
            <div className={`overflow-x-auto w-full`}>
              {filteredProducts.length === 0 ? (
                <div className={`col-span-full text-center text-lg my-8 py-8 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>You have no products yet. Click "Add Product" to get started!</p>
                </div>
              ) : (
                <table id="products-table" className={`min-w-full ${isDarkMode ? 'bg-[#23232b] text-white' : 'bg-white text-gray-800'}`}>
                  <thead>
                    <tr className={isDarkMode ? 'bg-[#2a2a33]' : 'bg-gray-50'}>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Image</th>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Name</th>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Category</th>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Price</th>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className={`${isDarkMode ? 'hover:bg-[#2a2a33] border-gray-700' : 'hover:bg-gray-50 border-gray-100'} border-b last:border-b-0`}>
                        <td className="py-4 px-6">
                          {p.image ? (
                            <img
                              src={`http://localhost:5000${p.image}`}
                              alt={p.name}
                              className="w-16 h-16 object-cover rounded shadow"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-semibold">{p.name}</td>
                        <td className="py-4 px-6">{p.category}</td>
                        <td className="py-4 px-6">₱{Number(p.price).toLocaleString()}</td>
                        <td className="py-4 px-6">{p.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </ArtisanLayout>
  );
}

export default AddProduct;

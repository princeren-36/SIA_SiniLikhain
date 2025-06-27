import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cartBg from '../images/2.jpg';
import ArtisanLayout from "./ArtisanLayout";
import { API_BASE } from "../utils/api";

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
      axios.get(`${API_BASE}/products`).then((res) => {
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
        const res = await axios.put(`${API_BASE}/products/${editId}`, data);
        setProducts((prev) =>
          prev.map((p) => (p._id === editId ? res.data : p))
        );
        alert("Product updated successfully!");
      } else {
        const res = await axios.post(`${API_BASE}/products`, data);
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
    setPreview(product.image ? `${API_BASE}${product.image}` : null);
    setOpenForm(true);
    setSelectedProduct(null);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_BASE}/products/${id}`);
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
        
        <div className={`w-full p-6 md:p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold addproduct-title">My Products</h2>
          </div>

          {/* Top controls: Add/Import, Search, Filter/Export */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 w-full">
            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                onClick={() => navigate('/artisan/add-product')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add Product
              </button>
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
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
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'
                }`}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="relative">
                <button 
                  className={`flex items-center gap-2 border-2 px-4 py-2 rounded-lg font-semibold transition ${
                    isDarkMode ? 'border-purple-500 text-purple-300 bg-gray-800 hover:bg-gray-700' : 'border-purple-400 text-purple-700 bg-white hover:bg-purple-50'
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
              ) : (
                <table id="products-table" className={`min-w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                  <thead>
                    <tr className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Image</th>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Name</th>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Category</th>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Price</th>
                      <th className={`py-3 px-6 font-semibold text-left border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className={`${isDarkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'} border-b last:border-b-0`}>
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

import React, { useEffect, useState } from 'react';
import NavbarBuyer from "./NavbarBuyer";
import axios from 'axios';
import cartBg from '../images/2.jpg';
import { API_BASE } from "../utils/api";

function Buyer() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/products`).then(res => {
      setProducts(res.data.filter(p => p.quantity > 0));
      const cats = Array.from(new Set(res.data.map(p => p.category).filter(Boolean)));
      setCategories(cats);
    });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product, qty) => {
    const existingIndex = cart.findIndex(item => item._id === product._id);
    let updatedCart;
    if (existingIndex !== -1) {
      const existing = cart[existingIndex];
      const newQty = Math.min(existing.quantity + qty, product.quantity);
      updatedCart = [...cart];
      updatedCart[existingIndex] = { ...existing, quantity: newQty };
    } else {
      updatedCart = [...cart, { ...product, quantity: qty }];
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
    setSnackbarOpen(true);
    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(null), 1200);
  };

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  // Close snackbar after 1.5s
  useEffect(() => {
    if (snackbarOpen) {
      const timer = setTimeout(() => setSnackbarOpen(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [snackbarOpen]);

  return (
    <>
      <NavbarBuyer />
      <div className="p-4 min-h-screen" style={{ background: 'white', overflow: 'hidden' }}>
        {/* Image section with message */}
        <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-8 rounded-2xl overflow-hidden shadow-lg" style={{height: '320px', maxHeight: '400px', marginTop: '-1rem'}}>
          <img src={cartBg} alt="Shopping Cart Background" className="w-full h-full object-cover opacity-80" style={{height: '100%'}} />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">OUR PRODUCTS</h1>
            <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">Crafted with intention, each piece tells a story—handmade goods that honor tradition, design, and soul.</p>
          </div>
        </div>
        <div className="h-18" />
        <div className="flex w-full items-start gap-8">
          {/* Product grid on the left */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center gap-2 mb-6 justify-center">
              <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg" style={{ minWidth: 280 }}>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {/* Search icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
                </span>
              </div>
              <span className="font-mono text-base text-black">Category:</span>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="min-w-[140px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
              >
                <option value="">All</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {/* Product grid styled to match screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {filteredProducts.map((product) => (
                <div key={product._id} className="w-[320px] flex flex-col items-center shadow-none rounded-none relative" style={{ boxShadow: 'none', background: 'white' }}>
                  {/* Image card, visually separated, now clickable for modal */}
                  <div
                    className="w-full flex justify-center pt-8 pb-4 min-h-[180px] cursor-pointer"
                    style={{ background: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                    onClick={() => handleOpenProduct(product)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name}`}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpenProduct(product); }}
                  >
                    <img
                      src={`${API_BASE}${product.image}`}
                      alt={product.name}
                      className="object-contain h-36 w-36"
                      style={{ background: 'white', border: 'none' }}
                    />
                  </div>
                  {/* Product info card with borders */}
                  <div className="w-full border-t border-b border-l border-r" style={{ borderColor: '#5e503f', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                    <div className="text-center py-4 px-2 border-b" style={{ borderColor: '#5e503f' }}>
                      <span className="font-mono text-lg font-semibold tracking-wider text-black uppercase letter-spacing-wider">{product.name}</span>
                    </div>
                    <div className="flex flex-row border-b relative" style={{ borderColor: '#5e503f' }}>
                      <div className="flex items-center justify-center border-r py-3 w-1/2" style={{ borderColor: '#5e503f' }}>
                        <span className="font-mono text-base text-black">₱{Number(product.price).toFixed(2)}</span>
                      </div>
                      <div className="w-1/2 relative flex items-center justify-center">
                        <button
                          className="flex items-center justify-center py-3 w-full font-mono text-base text-[#bfa181] hover:bg-[#f5eee6] transition-colors duration-150 cursor-pointer tracking-widest font-semibold border-none bg-transparent"
                          style={{ fontSize: '0.95rem', position: 'relative', zIndex: 1 }}
                          onClick={() => handleAddToCart(product, 1)}
                        >
                          ADD TO CART
                        </button>
                        {addedProductId === product._id && (
                          <span style={{position:'absolute',top:'-10px',right:'-10px',zIndex:20}}>
                            <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:'50%',background:'#bfa181',boxShadow:'0 2px 8px #0002'}}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 11 17 4 10" /></svg>
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-xs w-full">
            <div className="flex items-center justify-between border-b border-[#bfa181] pb-2 mb-2">
              <span className="font-mono text-xl font-semibold tracking-widest text-black">CART</span>
              <span className="font-mono text-sm font-bold tracking-wider">Subtotal: ₱{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-2">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 font-mono text-sm">Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item._id} className="flex items-center gap-2 py-1">
                    <img src={`${API_BASE}${item.image}`} alt={item.name} className="w-9 h-9 object-contain bg-white" />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs font-semibold tracking-wider text-black uppercase truncate">{item.name}</div>
                      <div className="font-mono text-[11px] text-black">{item.quantity} × ₱{Number(item.price).toFixed(2)}</div>
                    </div>
                    <button
                      className="text-[#bfa181] text-base font-bold hover:bg-[#f5eee6] rounded px-1"
                      onClick={() => {
                        const updatedCart = cart.filter(i => i._id !== item._id);
                        setCart(updatedCart);
                        localStorage.setItem("cart", JSON.stringify(updatedCart));
                      }}
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="flex gap-2 mt-2">
                <button
                  className="w-1/2 border border-[#bfa181] bg-white text-[#bfa181] font-mono font-bold py-1 text-xs uppercase tracking-widest hover:bg-[#f5eee6] transition-colors duration-150 cursor-pointer"
                  style={{ letterSpacing: 2 }}
                  onClick={() => window.location.href = '/cart'}
                >
                  VIEW CART
                </button>
                <button
                  className="w-1/2 border border-[#bfa181] bg-white text-[#bfa181] font-mono font-bold py-1 text-xs uppercase tracking-widest hover:bg-[#f5eee6] transition-colors duration-150"
                  style={{ letterSpacing: 2 }}
                  onClick={() => window.location.href = '/cart#checkout'}
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Dialog */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.10)'}}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={`${API_BASE}${selectedProduct.image}`}
              alt={selectedProduct.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="font-semibold text-lg text-black mb-1 text-center">{selectedProduct.name}</div>
            <div className="text-black font-bold mb-2 text-center">₱{selectedProduct.price}</div>
            <div className="text-xs text-gray-500 mb-2 text-center">Available: {selectedProduct.quantity}</div>
            {/* Ratings (read-only average) */}
            <div className="flex items-center justify-center mb-1">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-sm text-black font-medium">
                {selectedProduct.ratings && selectedProduct.ratings.length
                  ? (selectedProduct.ratings.reduce((sum, r) => sum + r.value, 0) / selectedProduct.ratings.length).toFixed(1)
                  : '0.0'}
              </span>
              <span className="ml-1 text-xs text-gray-500">
                ({selectedProduct.ratings ? selectedProduct.ratings.length : 0})
              </span>
            </div>
            {/* User rating (clickable stars) */}
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm text-gray-700 mr-2">Your Rating:</span>
              {[1,2,3,4,5].map(star => {
                // Get user from localStorage or sessionStorage
                let user = null;
                try {
                  user = JSON.parse(localStorage.getItem("user"))?.username || JSON.parse(sessionStorage.getItem("user"))?.username;
                } catch (e) {
                  user = null;
                }
                const userRating = selectedProduct.ratings ? (selectedProduct.ratings.find(r => r.user === user)?.value || 0) : 0;
                return (
                  <button
                    key={star}
                    className={`text-xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
                    onClick={async () => {
                      if (!user) return;
                      await axios.post(`${API_BASE}/products/${selectedProduct._id}/rate`, {
                        user,
                        value: star
                      });
                      const { data } = await axios.get(`${API_BASE}/products`);
                      const updated = data.find(p => p._id === selectedProduct._id);
                      setSelectedProduct(updated);
                      setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
                    }}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Snackbar */}
      {snackbarOpen && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold animate-fade-in">
            Added to cart!
          </div>
        </div>
      )}
    </>
  );
}

export default Buyer;

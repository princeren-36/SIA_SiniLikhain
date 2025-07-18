import React, { useEffect, useState } from 'react';
import NavbarBuyer from "./NavbarBuyer";
import axios from 'axios';
import cartBg from '../images/2.jpg';
import { API_BASE } from "../utils/api";
import { toast } from 'react-toastify';

function Buyer() {
  // Track if logout dialog is open in NavbarBuyer
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const handleLogoutDialogState = (open) => setLogoutDialogOpen(open);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [cartOffset, setCartOffset] = useState(300); // Default value, will be updated on load
  const [ratingLoading, setRatingLoading] = useState(false);
  const cartRef = React.useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE}/products?approved=true`).then(res => {
      setProducts(res.data.filter(p => (p.approved === true || p.status === "approved") && p.quantity > 0));
      const cats = Array.from(new Set(res.data.filter(p => p.approved).map(p => p.category).filter(Boolean)));
      setCategories(cats);
    });
  }, []);

  useEffect(() => {
    let intervalId;
    const fetchProducts = () => {
      axios.get(`${API_BASE}/products?approved=true`).then(res => {
        setProducts(res.data.filter(p => (p.approved === true || p.status === "approved") && p.quantity > 0));
        const cats = Array.from(new Set(res.data.filter(p => p.approved).map(p => p.category).filter(Boolean)));
        setCategories(cats);
      });
    };
    fetchProducts();
    intervalId = setInterval(fetchProducts, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Measure the cart's initial position to know when to make it fixed
  useEffect(() => {
    const updateCartOffset = () => {
      if (cartRef.current) {
        const cartRect = cartRef.current.getBoundingClientRect();
        const cartOffsetFromTop = cartRect.top + window.scrollY;
        setCartOffset(cartOffsetFromTop);
      }
    };
    
    // Update on load and resize
    updateCartOffset();
    window.addEventListener('resize', updateCartOffset);
    
    return () => {
      window.removeEventListener('resize', updateCartOffset);
    };
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
    setTimeout(() => setAddedProductId(null), 2200); // Show check for 2.2s
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
    <div className="overflow-x-hidden" style={{ overflowY: 'visible' }}>
      <NavbarBuyer onLogoutDialogState={handleLogoutDialogState} />
      {/* Full-width hero section with AboutBuyer.jsx design */}
      <div
        className="relative h-[40vh] min-h-[200px] w-screen left-1/2 right-1/2 -translate-x-1/2 overflow-hidden flex items-center justify-center mb-0"
        style={{
          backgroundImage: `url(${cartBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 text-center px-2 w-full">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white font-mono tracking-wider drop-shadow-2xl" style={{textShadow: '2px 2px 8px #000'}}>
            Our Products
          </h1>
          <p className="text-base md:text-xl text-white max-w-3xl mx-auto font-light drop-shadow-2xl" style={{textShadow: '1px 1px 6px #000'}}>
            Crafted with intention, each piece tells a story—handmade goods that honor tradition, design, and soul.
          </p>
        </div>
      </div>
      <div className="p-2 pb-8 min-h-screen" 
           style={{ 
             background: '#f8f9fa', 
             marginTop: 0, 
             overflow: 'visible',
             position: 'relative'
           }}>
        <div id="main-content" className="h-18" />
        <div className="flex flex-col lg:flex-row items-start" 
             style={{ 
               minHeight: '80vh', 
               position: 'relative',
               maxWidth: '1800px',
               margin: '0 auto',
               paddingRight: scrollPosition > cartOffset && windowWidth >= 1024 ? '340px' : '0'
             }}>
          {/* Product grid on the left */}
          <div className="w-full mb-6 lg:mb-0" style={{ overflow: 'visible' }}>
            <div className="flex flex-col md:flex-row items-center gap-2 mb-6 justify-center md:space-x-4">
              <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg mb-2 md:mb-0" style={{ minWidth: 180 }}>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black bg-white text-black text-sm md:text-base"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
                </span>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row items-center">
                <span className="font-mono text-base text-black mb-2 md:mb-0 md:mr-2">Category:</span>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="min-w-[100px] w-full md:w-auto px-2 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black bg-white text-black text-sm md:text-base"
                >
                  <option value="">All</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Responsive product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-[#5e503f] mx-auto">
              {filteredProducts.map((product) => (
                <div key={product._id} className="w-full bg-white border-r border-b border-[#5e503f] relative overflow-hidden">
                  {/* Integrated product card with larger image and info in one container */}
                  <div 
                    className="cursor-pointer w-full flex flex-col"
                    onClick={() => handleOpenProduct(product)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name}`}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpenProduct(product); }}
                  >
                    <div className="w-full pt-2 pb-2 flex items-center justify-center min-h-[140px] md:min-h-[200px] bg-[#fcfcfc]">
                      <img
                        src={`${API_BASE}${product.image}`}
                        alt={product.name}
                        className="object-contain h-32 w-32 md:h-48 md:w-48 transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="text-center py-2 px-2 bg-[#f8f5f2] border-t border-[#e8e0d8]">
                      <h3 className="font-mono text-base md:text-lg font-semibold tracking-wider text-black uppercase letter-spacing-wider truncate">{product.name}</h3>
                      {product.quantity < 10 && (
                        <p className="text-xs text-[#d97706] mt-1">Only {product.quantity} left</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row border-t relative" style={{ borderColor: '#5e503f' }}>
                    <div className="flex items-center justify-center border-r py-2 md:py-3 w-1/2" style={{ borderColor: '#5e503f' }}>
                      <span className="font-mono text-base text-black">₱{Number(product.price).toFixed(2)}</span>
                    </div>
                    <div className="w-1/2 relative flex items-center justify-center">
                      <button
                        className="flex items-center justify-center py-2 md:py-3 w-full font-mono text-base text-[#5e503f] hover:bg-[#e6e0d8] transition-colors duration-150 cursor-pointer tracking-widest font-semibold border-none bg-transparent"
                        style={{ fontSize: '0.95rem', position: 'relative', zIndex: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product, 1);
                        }}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                  {addedProductId === product._id && (
                    <span className="absolute top-3 right-3 z-20">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#5e503f] shadow-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 11 17 4 10" /></svg>
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Cart sidebar - hide on mobile, show as fixed on desktop */}
          <div
            ref={cartRef}
            className={`${windowWidth < 1024 ? 'w-full mt-4' : ''} ${windowWidth < 1024 && scrollPosition > cartOffset ? 'hidden' : ''} lg:w-[300px] shrink-0`}
            style={{ 
              position: scrollPosition > cartOffset && windowWidth >= 1024 ? 'fixed' : windowWidth < 1024 ? 'static' : 'static',
              top: scrollPosition > cartOffset && windowWidth >= 1024 ? '20px' : 'auto',
              right: scrollPosition > cartOffset && windowWidth >= 1024 ? '20px' : 'auto',
              height: 'fit-content', 
              background: 'white', 
              zIndex: 50,
              border: '1px solid #eee',
              borderRadius: '6px',
              padding: '15px',
              marginLeft: windowWidth >= 1024 ? '30px' : '0',
              width: windowWidth < 1024 ? '100%' : '300px',
              maxHeight: scrollPosition > cartOffset && windowWidth >= 1024 ? 'calc(100vh - 50px)' : 'none',
              overflowY: scrollPosition > cartOffset && windowWidth >= 1024 ? 'auto' : 'visible',
              boxShadow: 'none', // Remove all shadow
              transition: 'none', // Remove transition on box-shadow and position
              filter: logoutDialogOpen ? 'blur(6px)' : undefined
            }}
          >
            {/* If sticky is not working, ensure no parent has overflow-y set! */}
            <div className="flex items-center justify-between border-b border-[#5e503f] pb-2 mb-2">
              <span className="font-mono text-lg md:text-xl font-semibold tracking-widest text-black">CART</span>
              <span className="font-mono text-xs md:text-sm font-bold tracking-wider">Subtotal: ₱{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-2">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 font-mono text-xs md:text-sm">Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item._id} className="flex items-center gap-2 py-1">
                    <img src={`${API_BASE}${item.image}`} alt={item.name} className="w-8 h-8 md:w-9 md:h-9 object-contain bg-white" />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs font-semibold tracking-wider text-black uppercase truncate">{item.name}</div>
                      <div className="font-mono text-[10px] md:text-[11px] text-black">{item.quantity} × ₱{Number(item.price).toFixed(2)}</div>
                    </div>
                    <button
                      className="text-[#5e503f] text-base font-bold hover:bg-[#e6e0d8] rounded px-1"
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
              <div className="flex gap-2 mt-2 flex-col md:flex-row">
                <button
                  className="w-full md:w-1/2 border border-[#5e503f] bg-white text-[#5e503f] font-mono font-bold py-1 text-xs uppercase tracking-widest hover:bg-[#e6e0d8] transition-colors duration-150 cursor-pointer mb-2 md:mb-0"
                  style={{ letterSpacing: 2 }}
                  onClick={() => window.location.href = '/cart'}
                >
                  VIEW CART
                </button>
                <button
                  className="w-full md:w-1/2 border border-[#5e503f] bg-white text-[#5e503f] font-mono font-bold py-1 text-xs uppercase tracking-widest hover:bg-[#e6e0d8] transition-colors duration-150"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2" style={{backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.10)'}}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-4 md:p-6 relative">
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
              className="w-full h-32 md:h-48 object-cover rounded-lg mb-4"
            />
            <div className="font-semibold text-base md:text-lg text-black mb-1 text-center">{selectedProduct.name}</div>
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
                      if (!user) {
                        toast.warn('You must be logged in to rate.');
                        return;
                      }
                      setRatingLoading(true);
                      try {
                        await axios.post(`${API_BASE}/products/${selectedProduct._id}/rate`, {
                          user,
                          value: star
                        });
                        const { data } = await axios.get(`${API_BASE}/products`);
                        const updated = data.find(p => p._id === selectedProduct._id);
                        setSelectedProduct(updated);
                        setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
                      } catch (err) {
                        toast.error('Failed to submit rating.');
                      } finally {
                        setRatingLoading(false);
                      }
                    }}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    disabled={ratingLoading}
                    title={!user ? 'Log in to rate' : ''}
                  >
                    ★
                  </button>
                );
              })}
              {ratingLoading && <span className="ml-2 text-xs text-gray-400">Saving...</span>}
            </div>
          </div>
        </div>
      )}
      {/* Snackbar */}
      {snackbarOpen && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-xs">
          <div className="bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg font-semibold animate-fade-in text-center text-sm md:text-base">
            Added to cart!
          </div>
        </div>
      )}
    </div>
  );
}

export default Buyer;

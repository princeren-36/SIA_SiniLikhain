import React, { useEffect, useState } from 'react';
import NavbarBuyer from "./NavbarBuyer";
import axios from 'axios';

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
    axios.get("http://localhost:5000/products").then(res => {
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
      <div className="p-4 min-h-screen" style={{ background: 'white' }}>
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
                  {/* Image card, visually separated */}
                  <div className="w-full flex justify-center pt-8 pb-4 min-h-[180px]" style={{ background: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="object-contain h-36 w-36"
                      style={{ background: 'white', border: 'none' }}
                    />
                  </div>
                  {/* Product info card with borders */}
                  <div className="w-full border-t border-b border-l border-r border-[#bfa181]" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                    <div className="text-center py-4 px-2 border-b border-[#bfa181]">
                      <span className="font-mono text-lg font-semibold tracking-wider text-black uppercase letter-spacing-wider">{product.name}</span>
                    </div>
                    <div className="flex flex-row border-b border-[#bfa181] relative">
                      <div className="flex items-center justify-center border-r border-[#bfa181] py-3 w-1/2">
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
          {/* Cart block on the right, not a sidebar, not a card */}
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
                    <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-9 h-9 object-contain bg-white" />
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
                  className="w-1/2 border border-[#bfa181] bg-white text-[#bfa181] font-mono font-bold py-1 text-xs uppercase tracking-widest hover:bg-[#f5eee6] transition-colors duration-150"
                  style={{ letterSpacing: 2 }}
                >
                  VIEW CART
                </button>
                <button
                  className="w-1/2 border border-[#bfa181] bg-white text-[#bfa181] font-mono font-bold py-1 text-xs uppercase tracking-widest hover:bg-[#f5eee6] transition-colors duration-150"
                  style={{ letterSpacing: 2 }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={`http://localhost:5000${selectedProduct.image}`}
              alt={selectedProduct.name}
              className="buyer-dialog-img-large w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="buyer-dialog-name-small font-semibold text-lg text-black mb-1">{selectedProduct.name}</div>
            <div className="buyer-dialog-price-small text-black font-bold mb-2">₱{selectedProduct.price}</div>
            <div className="mb-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                min={1}
                max={selectedProduct.quantity}
                onChange={e => setQuantity(
                  Math.max(1, Math.min(selectedProduct.quantity, parseInt(e.target.value) || 1))
                )}
                className="buyer-dialog-qty w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="buyer-dialog-available-small text-xs text-gray-500 mb-2">Available: {selectedProduct.quantity}</div>
            <button
              className="buyer-dialog-add-btn w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mb-2 disabled:opacity-50"
              disabled={quantity > selectedProduct.quantity}
              onClick={() => {
                handleAddToCart(selectedProduct, quantity);
                setSelectedProduct(null);
              }}
            >
              Add to Cart
            </button>
            {/* Ratings (read-only) */}
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
            {/* User rating (simple clickable stars) */}
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm text-gray-700 mr-2">Your Rating:</span>
              {[1,2,3,4,5].map(star => {
                const user = JSON.parse(localStorage.getItem("user"))?.username;
                const userRating = selectedProduct.ratings ? (selectedProduct.ratings.find(r => r.user === user)?.value || 0) : 0;
                return (
                  <button
                    key={star}
                    className={`text-xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
                    onClick={async () => {
                      await axios.post(`http://localhost:5000/products/${selectedProduct._id}/rate`, {
                        user,
                        value: star
                      });
                      const { data } = await axios.get(`http://localhost:5000/products`);
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

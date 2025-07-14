import React, { useEffect, useState } from "react";
import NavbarBuyer from "./NavbarBuyer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import cartBg from '../images/2.jpg';
import { API_BASE } from "../utils/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const navigate = useNavigate ? useNavigate() : () => {};

  const calculateCartTotal = (currentCart) => {
    return currentCart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  useEffect(() => {
    const fetchCartWithQuantities = async () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (storedCart.length === 0) {
        setCart([]);
        return;
      }
      try {
        const { data: products } = await axios.get(`${API_BASE}/products`);
        const updatedCart = storedCart.map(item => {
          const prod = products.find(p => p._id === item._id);
          const safeQuantity = prod ? Math.min(item.quantity, prod.quantity) : item.quantity;
          return prod
            ? { ...item, maxQuantity: prod.quantity, quantity: safeQuantity }
            : { ...item, maxQuantity: item.quantity };
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
        setCart(storedCart);
      }
    };
    fetchCartWithQuantities();
  }, []);

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index, value) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    const maxQty = item.maxQuantity || 1;
    let newQty = Number(value);
    if (isNaN(newQty) || newQty < 1) {
      newQty = 1;
    } else if (newQty > maxQty) {
      newQty = maxQty;
    }
    item.quantity = newQty;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleBuy = async () => {
    const user = getCurrentUser();
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    
    const itemsToPurchase = cart.filter(item => item.quantity > 0);
    if (itemsToPurchase.length === 0) {
      alert("Your cart is empty. Add items before purchasing.");
      return;
    }
    
    // Navigate to checkout page
    navigate('/buyer/Checkout');
  };

  return (
    <div className="overflow-x-hidden">
      <NavbarBuyer />
      {/* Full-width hero section with Buyer.jsx design at the topmost, no space below */}
      <div
        className="relative h-[50vh] min-h-[300px] w-screen left-1/2 right-1/2 -translate-x-1/2 overflow-hidden flex items-center justify-center mb-0"
        style={{
          backgroundImage: `url(${cartBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 text-center px-4 w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white font-mono tracking-wider drop-shadow-2xl" style={{textShadow: '2px 2px 8px #000'}}>
            Shopping Cart
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-light drop-shadow-2xl" style={{textShadow: '1px 1px 6px #000'}}>
            Crafted with intention, each piece tells a story—handmade goods that honor tradition, design, and soul.
          </p>
        </div>
      </div>
      <div className="p-4 min-h-screen bg-[#f8f9fa] buyer-container mt-0">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1b2a41]">My Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">Your cart is empty.</div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-5xl flex flex-col items-center">
              {/* Desktop/tablet table view */}
              <div className="w-full hidden sm:block">
                <table className="w-full max-w-5xl border-separate border-spacing-0" style={{tableLayout: 'fixed'}}>
                  <thead>
                    <tr className="bg-[#5e503f] text-white">
                      <th className="py-4 px-2 font-bold text-lg text-left rounded-tl-lg">&nbsp;</th>
                      <th className="py-4 px-2 font-bold text-lg text-left">Product</th>
                      <th className="py-4 px-2 font-bold text-lg text-left">Price</th>
                      <th className="py-4 px-2 font-bold text-lg text-left">Quantity</th>
                      <th className="py-4 px-2 font-bold text-lg text-left rounded-tr-lg">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {cart.map((product, idx) => (
                      <tr key={idx} className="align-middle border-b border-gray-200">
                        <td className="py-4 px-2 align-middle">
                          <button
                            className="w-8 h-8 flex items-center justify-center border-2 border-[#b38664] rounded-full text-[#b38664] hover:bg-[#f5eee6] transition text-xl"
                            onClick={() => handleRemove(idx)}
                            aria-label="Remove"
                          >
                            &times;
                          </button>
                        </td>
                        <td className="py-4 px-2 flex items-center gap-6 min-w-[220px]">
                          <img src={`${API_BASE}${product.image}`} alt={product.name} className="w-16 h-12 object-contain" />
                          <span className="font-mono text-xl text-[#b38664]">{product.name}</span>
                        </td>
                        <td className="py-4 px-2 font-mono text-lg text-black">₱{Number(product.price).toFixed(2)}</td>
                        <td className="py-4 px-2">
                          <input
                            id={`qty-${idx}`}
                            type="number"
                            min={1}
                            max={product.maxQuantity || 1}
                            value={product.quantity}
                            onChange={e => handleQuantityChange(idx, e.target.value)}
                            className="border border-gray-300 rounded text-center px-2 py-1 w-16 font-mono text-lg focus:ring-2 focus:ring-[#bfa181] text-black"
                          />
                        </td>
                        <td className="py-4 px-2 font-mono text-lg text-black">₱{(product.price * product.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile card view */}
              <div className="w-full sm:hidden flex flex-col gap-4">
                {cart.map((product, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-base text-[#b38664]">{product.name}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border-2 border-[#b38664] rounded-full text-[#b38664] hover:bg-[#f5eee6] transition text-xl"
                        onClick={() => handleRemove(idx)}
                        aria-label="Remove"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="flex gap-3 items-center mb-2">
                      <img src={`${API_BASE}${product.image}`} alt={product.name} className="w-16 h-12 object-contain" />
                      <span className="font-mono text-lg text-black">₱{Number(product.price).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-black">Qty:</span>
                      <input
                        id={`qty-mob-${idx}`}
                        type="number"
                        min={1}
                        max={product.maxQuantity || 1}
                        value={product.quantity}
                        onChange={e => handleQuantityChange(idx, e.target.value)}
                        className="border border-gray-300 rounded text-center px-2 py-1 w-16 font-mono text-base focus:ring-2 focus:ring-[#bfa181] text-black"
                      />
                    </div>
                    <div className="font-mono text-base text-black text-right">Subtotal: ₱{(product.price * product.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              {/* Cart totals and checkout button */}
              <div className="max-w-5xl w-full mx-auto mt-12">
                <h3 className="text-2xl font-mono font-semibold mb-6 tracking-widest text-black">CART TOTALS</h3>
                <div className="border-t-2 border-black sm:border-none sm:bg-transparent sm:rounded-none sm:shadow-none bg-white rounded-xl shadow-lg p-5 sm:p-0 mb-6 sm:mb-0">
                  <div className="flex flex-col sm:flex-row justify-between items-center py-4 border-b border-gray-100 gap-2">
                    <span className="font-mono text-lg font-semibold text-black">Subtotal</span>
                    <span className="font-mono text-lg text-black">₱{calculateCartTotal(cart)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center py-4 border-b-0 gap-2">
                    <span className="font-mono text-lg font-semibold text-black">Total</span>
                    <span className="font-mono text-lg font-semibold text-black">₱{calculateCartTotal(cart)}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-4">
                  <button
                    className="w-full sm:w-auto px-8 py-3 border-2 border-[#b38664] text-[#1b2a41] font-mono font-bold text-lg tracking-widest bg-white transition rounded-xl sm:rounded-none shadow-sm sm:shadow-none"
                    style={{ backgroundColor: '#5e503f', borderColor: '#5e503f', color: '#fff' }}
                    onMouseOver={e => { e.currentTarget.style.backgroundColor = '#eae0d5'; e.currentTarget.style.color = '#5e503f'; }}
                    onMouseOut={e => { e.currentTarget.style.backgroundColor = '#5e503f'; e.currentTarget.style.color = '#fff'; }}
                    onClick={handleBuy}
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Snackbar */}
        {snackbarOpen && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold animate-fade-in">
              Purchase successful!
            </div>
          </div>
        )}
        {/* Login Prompt Modal */}
        {loginPromptOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
              <div className="text-lg font-bold mb-3 text-[#1b2a41]">Login Required</div>
              <div className="mb-5 text-[#1b2a41]">You must be logged in to buy products. Do you want to log in now?</div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setLoginPromptOpen(false)} className="px-5 py-2 rounded-lg bg-[#ccc9dc] hover:bg-[#324a5f] hover:text-white text-[#1b2a41] font-semibold shadow-sm transition">No</button>
                <button onClick={() => { setLoginPromptOpen(false); navigate('/Login'); }} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm transition">Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

import React, { useEffect, useState } from "react";
import NavbarBuyer from "./NavbarBuyer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import cartBg from '../images/2.jpg';

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
        const { data: products } = await axios.get("http://localhost:5000/products");
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
    try {
      const itemsToPurchase = cart.filter(item => item.quantity > 0);
      if (itemsToPurchase.length === 0) {
        alert("Your cart is empty. Add items before purchasing.");
        return;
      }
      await axios.post("http://localhost:5000/products/buy", { cart: itemsToPurchase });
      setCart([]);
      localStorage.removeItem("cart");
      setSnackbarOpen(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Purchase failed: ${error.response.data.message}`);
      } else {
        alert("Purchase failed. Please try again.");
      }
    }
  };

  return (
    <>
      <NavbarBuyer />
      <div className="p-4 min-h-screen bg-white buyer-container" style={{overflowX: 'hidden'}}>
        <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-8 rounded-2xl overflow-hidden shadow-lg" style={{height: '320px', maxHeight: '400px', marginTop: '-1rem'}}>
          <img src={cartBg} alt="Shopping Cart Background" className="w-full h-full object-cover opacity-80" style={{height: '100%'}} />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">SHOPPING CART</h1>
            <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">Your curated collection — gather the pieces that speak to you, ready when you are.</p>
          </div>
        </div>
        <div className="h-10" />
        <h2 className="text-2xl font-bold mb-5 text-center text-[#1b2a41]">My Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">Your cart is empty.</div>
        ) : (
          <div className="overflow-x-auto mt-6 mb-8 max-w-3xl mx-auto">
            <table className="min-w-full border-separate border-spacing-0 text-lg">
              <thead>
                <tr className="bg-[#5e503f] text-white">
                  <th className="py-3 px-6 font-bold text-lg text-left rounded-tl-lg">&nbsp;</th>
                  <th className="py-3 px-6 font-bold text-lg text-left">Product</th>
                  <th className="py-3 px-6 font-bold text-lg text-left">Price</th>
                  <th className="py-3 px-6 font-bold text-lg text-left">Quantity</th>
                  <th className="py-3 px-6 font-bold text-lg text-left rounded-tr-lg">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {cart.map((product, idx) => (
                  <tr key={idx} className="align-middle border-b border-gray-200">
                    <td className="py-3 px-2 align-middle">
                      <button
                        className="w-8 h-8 flex items-center justify-center border-2 border-[#b38664] rounded-full text-[#b38664] hover:bg-[#f5eee6] transition text-xl ml-4"
                        onClick={() => handleRemove(idx)}
                        aria-label="Remove"
                      >
                        &times;
                      </button>
                    </td>
                    <td className="py-3 px-2 flex items-center gap-6 min-w-[180px]">
                      <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-16 h-12 object-contain" />
                      <span className="font-mono text-lg text-[#b38664]">{product.name}</span>
                    </td>
                    <td className="py-3 px-2 font-mono text-lg text-black">₱{Number(product.price).toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <input
                        id={`qty-${idx}`}
                        type="number"
                        min={1}
                        max={product.maxQuantity || 1}
                        value={product.quantity}
                        onChange={e => handleQuantityChange(idx, e.target.value)}
                        className="border border-gray-300 rounded text-center px-2 py-1 w-14 font-mono text-lg focus:ring-2 focus:ring-[#bfa181] text-black"
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-lg text-black">₱{(product.price * product.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full mt-10 max-w-lg mx-auto">
              <h3 className="text-2xl font-mono font-semibold mb-5 tracking-widest text-black">CART TOTALS</h3>
              <div className="border-t-2 border-black">
                <div className="flex justify-between items-center py-5 border-b border-gray-100">
                  <span className="font-mono text-xl font-semibold text-black">Subtotal</span>
                  <span className="font-mono text-xl text-black">₱{calculateCartTotal(cart)}</span>
                </div>
                <div className="flex justify-between items-center py-5 border-b-0">
                  <span className="font-mono text-xl font-semibold text-black">Total</span>
                  <span className="font-mono text-xl font-semibold text-black">₱{calculateCartTotal(cart)}</span>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <button
                  className="px-10 py-3 border-2 border-[#b38664] text-[#1b2a41] font-mono font-bold text-lg tracking-widest bg-white hover:bg-[#f5eee6] transition rounded-none"
                  onClick={handleBuy}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
        {snackbarOpen && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold animate-fade-in">
              Purchase successful!
            </div>
          </div>
        )}
        {loginPromptOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
              <div className="text-lg font-bold mb-3 text-[#1b2a41]">Login Required</div>
              <div className="mb-5 text-[#1b2a41]">You must be logged in to buy products. Do you want to log in now?</div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setLoginPromptOpen(false)} className="px-5 py-2 rounded-lg bg-[#ccc9dc] font-semibold shadow-sm transition">No</button>
                <button onClick={() => { setLoginPromptOpen(false); navigate('/Login'); }} className="px-5 py-2 rounded-lg bg-black text-white font-semibold shadow-sm transition" style={{backgroundColor: '#000', color: '#fff', border: 'none'}}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;

import React, { useEffect, useState } from "react";
import NavbarBuyer from "./NavbarBuyer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import checkoutBg from '../images/2.jpg';
import { API_BASE } from "../utils/api";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    middleInitial: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    email: '',
    paymentMethod: 'cod'
  });
  
  // Most common provinces and cities
  const provinces = [
    'Metro Manila',
    'Batangas',
    'Benguet',
    'Camarines Sur',
    'Cebu',
    'Davao del Sur',
    'Iloilo',
    'Leyte',
    'Misamis Oriental',
    'Negros Occidental',
    'Pampanga',
    'Rizal',
    'South Cotabato',
    'Zamboanga del Sur'
  ];
  
  // Cities by province
  const citiesByProvince = {
    'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Parañaque', 'Caloocan', 'Pasay', 'Marikina', 'Muntinlupa', 'Mandaluyong', 'San Juan', 'Valenzuela', 'Malabon', 'Navotas', 'Pateros'],
    'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Danao', 'Toledo', 'Carcar', 'Naga'],
    'Davao del Sur': ['Davao City', 'Digos', 'Santa Cruz', 'Malalag'],
    'Benguet': ['Baguio City', 'La Trinidad', 'Itogon', 'Tublay'],
    'Misamis Oriental': ['Cagayan de Oro', 'Gingoog', 'El Salvador', 'Tagoloan'],
    'Iloilo': ['Iloilo City', 'Passi', 'Oton', 'Pavia'],
    'Negros Occidental': ['Bacolod', 'Silay', 'Kabankalan', 'Cadiz'],
    'South Cotabato': ['General Santos', 'Koronadal', 'Tupi', 'Polomolok'],
    'Rizal': ['Antipolo', 'Cainta', 'Taytay', 'Angono'],
    'Batangas': ['Batangas City', 'Lipa', 'Tanauan', 'Sto. Tomas'],
    'Pampanga': ['Angeles City', 'San Fernando', 'Mabalacat', 'Guagua'],
    'Camarines Sur': ['Naga City', 'Iriga', 'Pili', 'Calabanga'],
    'Leyte': ['Tacloban City', 'Ormoc', 'Baybay', 'Palo'],
    'Zamboanga del Sur': ['Zamboanga City', 'Pagadian', 'Ipil', 'Aurora']
  };

  const [selectedProvince, setSelectedProvince] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate ? useNavigate() : () => {};

  const calculateCartTotal = (currentCart) => {
    return currentCart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/Login');
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      navigate('/buyer/Cart');
      return;
    }

    // Pre-fill user information if available
    if (user) {
      // Split name into parts if available
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      const lastName = nameParts.length > 1 ? nameParts.pop() : '';
      const firstName = nameParts.join(' ');
      
      setShippingInfo(prev => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || '',
      }));
    }

    const fetchCartWithQuantities = async () => {
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
      } catch (error) {
        setCart(storedCart);
      }
    };
    fetchCartWithQuantities();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validation checks
    if (name === 'firstName' || name === 'lastName') {
      // Only allow letters and spaces
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }
    
    if (name === 'middleInitial') {
      // Only allow a single letter
      if (!/^[a-zA-Z]?$/.test(value)) return;
    }
    
    if (name === 'postalCode' || name === 'phone') {
      // Only allow numbers
      if (!/^\d*$/.test(value)) return;
    }
    
    // Handle province selection separately
    if (name === 'province') {
      setSelectedProvince(value);
      setShippingInfo(prev => ({
        ...prev,
        [name]: value,
        // Clear city when province changes
        city: ''
      }));
      return;
    }
    
    // Update state
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      navigate('/Login');
      return;
    }

    try {
      setIsLoading(true);
      const itemsToPurchase = cart.filter(item => item.quantity > 0);
      if (itemsToPurchase.length === 0) {
        alert("Your cart is empty. Add items before purchasing.");
        return;
      }

      // Example API call - you would need to implement this endpoint on your server
      await axios.post(`${API_BASE}/orders`, {
        userId: user._id,
        items: itemsToPurchase,
        shippingInfo,
        totalAmount: calculateCartTotal(cart)
      });

      // Clear cart after successful order
      setCart([]);
      localStorage.removeItem("cart");
      setOrderPlaced(true);
      
      setTimeout(() => {
        navigate('/buyer/Buyer'); // Redirect to main page after successful order
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Order failed: ${error.response.data.message}`);
      } else {
        alert("Order failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarBuyer />
      <div className="p-4 min-h-screen bg-white buyer-container">
        {/* Image section with message */}
        <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-8 rounded-2xl overflow-hidden shadow-lg" style={{height: '320px', maxHeight: '400px', marginTop: '-1rem'}}>
          <img src={checkoutBg} alt="Checkout Background" className="w-full h-full object-cover opacity-80" style={{height: '100%'}} />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">CHECKOUT</h1>
            <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">Complete your purchase and support local artisans.</p>
          </div>
        </div>

        {orderPlaced ? (
          <div className="max-w-5xl mx-auto text-center py-12">
            <div className="text-5xl text-green-600 mb-4">✓</div>
            <h2 className="text-3xl font-bold mb-4 text-[#1b2a41]">Order Placed Successfully!</h2>
            <p className="text-lg text-gray-600 mb-8">Thank you for your order. You will be redirected shortly...</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#1b2a41]">Complete Your Order</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Shipping Information Form */}
              <div className="flex-1">
                <h3 className="text-2xl font-mono font-semibold mb-6 tracking-widest text-black">SHIPPING INFORMATION</h3>
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="lastName" className="block text-md font-mono mb-2 text-[#1b2a41]">Last Name</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        value={shippingInfo.lastName} 
                        onChange={handleInputChange} 
                        required 
                        pattern="[A-Za-z\s]+"
                        inputMode="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="firstName" className="block text-md font-mono mb-2 text-[#1b2a41]">First Name</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        value={shippingInfo.firstName} 
                        onChange={handleInputChange} 
                        required 
                        pattern="[A-Za-z\s]+"
                        inputMode="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black"
                      />
                    </div>
                    <div className="w-20">
                      <label htmlFor="middleInitial" className="block text-md font-mono mb-2 text-[#1b2a41]">M.I.</label>
                      <input 
                        type="text" 
                        id="middleInitial" 
                        name="middleInitial" 
                        value={shippingInfo.middleInitial} 
                        onChange={handleInputChange} 
                        maxLength="1"
                        pattern="[A-Za-z]"
                        inputMode="text"
                        placeholder="."
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-md font-mono mb-2 text-[#1b2a41]">Address</label>
                    <input 
                      type="text" 
                      id="address" 
                      name="address" 
                      value={shippingInfo.address} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="province" className="block text-md font-mono mb-2 text-[#1b2a41]">Province</label>
                      <select 
                        id="province" 
                        name="province" 
                        value={shippingInfo.province} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black"
                      >
                        <option value="" disabled>Select Province</option>
                        {provinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label htmlFor="city" className="block text-md font-mono mb-2 text-[#1b2a41]">City/Municipality</label>
                      <select 
                        id="city" 
                        name="city" 
                        value={shippingInfo.city} 
                        onChange={handleInputChange} 
                        required 
                        disabled={!shippingInfo.province}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black disabled:bg-gray-100"
                      >
                        <option value="" disabled>Select City/Municipality</option>
                        {shippingInfo.province && citiesByProvince[shippingInfo.province] && citiesByProvince[shippingInfo.province].length > 0 ? (
                          citiesByProvince[shippingInfo.province].map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))
                        ) : shippingInfo.province ? (
                          <option value={`${shippingInfo.province} City`}>{shippingInfo.province} City</option>
                        ) : null}
                        {shippingInfo.province && (
                          <option value="Other">Other (not listed)</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="postalCode" className="block text-md font-mono mb-2 text-[#1b2a41]">Postal Code</label>
                      <input 
                        type="text" 
                        id="postalCode" 
                        name="postalCode" 
                        value={shippingInfo.postalCode} 
                        onChange={handleInputChange} 
                        required 
                        pattern="\d*"
                        inputMode="numeric"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="phone" className="block text-md font-mono mb-2 text-[#1b2a41]">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={shippingInfo.phone} 
                        onChange={handleInputChange} 
                        required 
                        pattern="\d*"
                        inputMode="numeric"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-md font-mono mb-2 text-[#1b2a41]">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={shippingInfo.email} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="paymentMethod" className="block text-md font-mono mb-2 text-[#1b2a41]">Payment Method</label>
                    <select 
                      id="paymentMethod" 
                      name="paymentMethod" 
                      value={shippingInfo.paymentMethod} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#bfa181] focus:outline-none text-black"
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="gcash">GCash</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="mt-8">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full px-8 py-3 border-2 border-[#b38664] text-white font-mono font-bold text-lg tracking-widest bg-[#b38664] hover:bg-[#a37553] transition rounded-none disabled:bg-gray-400 disabled:border-gray-400"
                    >
                      {isLoading ? "Processing..." : "PLACE ORDER"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="flex-1">
                <h3 className="text-2xl font-mono font-semibold mb-6 tracking-widest text-black">ORDER SUMMARY</h3>
                <div className="border p-6 bg-gray-50">
                  <h4 className="font-semibold text-lg mb-4 text-[#1b2a41]">Items ({cart.length})</h4>
                  <div className="max-h-96 overflow-y-auto mb-6">
                    {cart.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                          <img src={`${API_BASE}${product.image}`} alt={product.name} className="w-12 h-12 object-contain" />
                          <div>
                            <div className="font-mono text-md text-[#b38664]">{product.name}</div>
                            <div className="text-sm text-gray-600">Quantity: {product.quantity}</div>
                          </div>
                        </div>
                        <div className="font-mono text-md text-black">₱{(product.price * product.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₱{calculateCartTotal(cart)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className="font-semibold">₱0.00</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center">
                      <span className="font-mono text-xl font-semibold text-[#1b2a41]">Total</span>
                      <span className="font-mono text-xl font-semibold text-[#1b2a41]">₱{calculateCartTotal(cart)}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button 
                      onClick={() => navigate('/cart')}
                      className="w-full px-8 py-2 text-[#b38664] font-mono font-bold text-md tracking-widest bg-white border-2 border-[#b38664] hover:bg-[#f5eee6] transition rounded-none"
                    >
                      BACK TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Checkout;

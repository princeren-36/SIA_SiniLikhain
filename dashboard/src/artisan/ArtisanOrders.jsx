import React, { useEffect, useState } from "react";
import ArtisanLayout from "./ArtisanLayout";
import axios from "axios";
import { API_BASE } from "../utils/api";
import { toast } from "react-toastify";
import { format } from "date-fns";
import cartBg from '../images/2.jpg';

const statusColors = {
  pending: "bg-[#f0e0d6] text-[#7d5a50] border border-[#d8bfb9]",
  processing: "bg-[#e6d7d0] text-[#6f4e37] border border-[#c9b5ae]",
  shipped: "bg-[#e0cfc7] text-[#5c3d2e] border border-[#c4b0a9]",
  delivered: "bg-[#d1c0b5] text-[#483429] border border-[#b3a295]",
  cancelled: "bg-[#e8d0c5] text-[#4a2c1b] border border-[#c6b5ad]",
};

const paymentColors = {
  pending: "bg-[#f0e0d6] text-[#7d5a50] border border-[#d8bfb9]",
  paid: "bg-[#d1c0b5] text-[#483429] border border-[#b3a295]",
  failed: "bg-[#e8d0c5] text-[#4a2c1b] border border-[#c6b5ad]",
};

const ArtisanOrders = () => {
  const [orders, setOrders] = useState([]);
  // Removed selectedOrder state, no longer needed
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user._id) return;

    // Fetch all orders for this artisan
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE}/orders/artisan/${user._id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const pollInterval = setInterval(fetchOrders, 30000);
    return () => clearInterval(pollInterval);
  }, [user]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/status`, { status });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status } : order));
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === "all") return true;
    return order.status === selectedFilter;
  });

  return (
    <ArtisanLayout>
      <div className="flex flex-col w-full min-h-screen" style={{ backgroundColor: '#18181b', color: '#fff' }}>
        {/* Image Section */}
        <div className="relative w-full overflow-hidden" style={{height: '280px'}}>
          <img src={cartBg} alt="Orders Background" className="w-full h-full object-cover opacity-80 select-none pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">MY ORDERS</h1>
            <p className="text-base md:text-lg text-white font-mono drop-shadow-lg text-center px-4">View and manage your customer orders here.</p>
          </div>
        </div>
        {/* Main Content */}
        <div className="w-full p-6 md:p-8" style={{ backgroundColor: '#18181b', color: '#fff' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold font-mono tracking-wider">Order Management</h2>
            <span className="text-lg font-mono font-semibold text-[#b38664]">
              Total Orders: {orders.length}
            </span>
          </div>
          {/* Filters */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-6 py-2 transition-colors border-2 font-mono font-medium tracking-widest rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#b38664] ${selectedFilter === "all" ? "bg-[#5c3d2e] text-[#23232b] border-[#5c3d2e]" : "bg-white text-[#5c3d2e] border-[#5c3d2e] hover:bg-[#f8f2ed]"}`}
            >
              ALL ORDERS
            </button>
            <button
              onClick={() => setSelectedFilter("pending")}
              className={`px-6 py-2 transition-colors border-2 font-mono font-medium tracking-widest rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#b38664] ${selectedFilter === "pending" ? "bg-[#b38664] text-[#23232b] border-[#b38664]" : "bg-white text-[#b38664] border-[#b38664] hover:bg-[#f5eee6]"}`}
            >
              PENDING
            </button>
            <button
              onClick={() => setSelectedFilter("processing")}
              className={`px-6 py-2 transition-colors border-2 font-mono font-medium tracking-widest rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#b38664] ${selectedFilter === "processing" ? "bg-[#8b6d5c] text-[#23232b] border-[#8b6d5c]" : "bg-white text-[#8b6d5c] border-[#8b6d5c] hover:bg-[#f0e8e4]"}`}
            >
              PROCESSING
            </button>
            <button
              onClick={() => setSelectedFilter("shipped")}
              className={`px-6 py-2 transition-colors border-2 font-mono font-medium tracking-widest rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#b38664] ${selectedFilter === "shipped" ? "bg-[#6f4e37] text-[#23232b] border-[#6f4e37]" : "bg-white text-[#6f4e37] border-[#6f4e37] hover:bg-[#ece5e0]"}`}
            >
              SHIPPED
            </button>
            <button
              onClick={() => setSelectedFilter("delivered")}
              className={`px-6 py-2 transition-colors border-2 font-mono font-medium tracking-widest rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#b38664] ${selectedFilter === "delivered" ? "bg-[#483429] text-[#f7e7d4] border-[#483429]" : "bg-white text-[#483429] border-[#483429] hover:bg-[#e9e5e3]"}`}
            >
              DELIVERED
            </button>
            <button
              onClick={() => setSelectedFilter("cancelled")}
              className={`px-6 py-2 transition-colors border-2 font-mono font-medium tracking-widest rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#b38664] ${selectedFilter === "cancelled" ? "bg-[#4a2c1b] text-[#f7e7d4] border-[#4a2c1b]" : "bg-white text-[#4a2c1b] border-[#4a2c1b] hover:bg-[#eae0da]"}`}
            >
              CANCELLED
            </button>
          </div>
          {/* Summary (optional) */}
          <div className="flex gap-6 mb-4 flex-wrap font-mono">
            <span className="text-[#f0e0d6]">
              Completed: {orders.filter(o => o.status === "delivered").length}
            </span>
            <span className="text-[#e6d7d0]">
              Pending: {orders.filter(o => o.status === "pending").length}
            </span>
            <span className="text-[#b38664]">
              Processing: {orders.filter(o => o.status === "processing").length}
            </span>
            <span className="text-[#c4b0a9]">
              Shipped: {orders.filter(o => o.status === "shipped").length}
            </span>
            <span className="text-[#d8bfb9]">
              Cancelled: {orders.filter(o => o.status === "cancelled").length}
            </span>
          </div>
          {/* Table/Order List Section */}
          <div className="rounded-lg shadow-sm border border-gray-700 p-4" style={{ backgroundColor: '#23232b', color: '#fff' }}>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-[#23232b] rounded-xl border border-gray-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-xl font-mono text-gray-300 mb-2">
                  {selectedFilter === "all" ? "No orders found" : `No ${selectedFilter} orders found`}
                </p>
                <p className="text-gray-400">New orders will appear here when customers make purchases.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-[#23232b] rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-[#b38664] transition-colors"
                  >
                    <div
                      className="p-5 cursor-pointer flex flex-wrap items-center justify-between border-b border-[#b38664]/20"
                      onClick={() => toggleOrderExpansion(order._id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="font-mono font-medium text-[#b38664]">
                          Order #{order._id.substring(order._id.length - 8)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${paymentColors[order.paymentStatus]}`}>
                          Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {/* Show the number of items in this order */}
                        <span className="text-sm font-mono font-semibold text-[#7d5a50] bg-[#23232b] px-2 py-1 rounded-full mr-3 border border-[#7d5a50] shadow">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className="text-base font-semibold text-[#fff] bg-[#5c3d2e] px-3 py-1 rounded-full mr-2 border border-[#b38664] shadow tracking-wider">
                          ₱{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </span>
                        <svg
                          className={`h-5 w-5 text-[#b38664] transform transition-transform ${expandedOrderId === order._id ? "rotate-180" : ""}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {expandedOrderId === order._id && (
                      <div className="p-8 bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-2">
                            <h3 className="text-xl font-mono font-semibold mb-4 tracking-wider text-[#1b2a41]">Products</h3>
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <div 
                                  key={item._id || item.productId} 
                                  className="flex items-start border-b border-gray-100 pb-4"
                                >
                                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                                    {item.image ? (
                                      <img
                                        src={item.image.startsWith('http') ? item.image : `${API_BASE}${item.image.startsWith('/') ? '' : '/'}${item.image}`}
                                        alt={item.name}
                                        className="h-full w-full object-cover object-center"
                                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80?text=No+Image'; }}
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">No image</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <h4 className="font-mono text-sm text-[#b38664]">
                                      {item.name}
                                    </h4>
                                    <div className="mt-2 flex justify-between text-xs">
                                      <div>
                                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                                      </div>
                                      <p className="font-mono text-sm text-[#5c3d2e] font-medium">
                                        ₱{(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>                              <div className="mt-6 pt-4 border-t border-[#b38664]/20">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-lg font-semibold text-[#5c3d2e]">Total</span>
                                <span className="font-mono text-lg font-semibold text-[#5c3d2e]">
                                  ₱{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="space-y-6">
                              {/* Buyer info */}
                              <div>
                                <h3 className="text-base font-mono font-semibold mb-3 text-[#1b2a41] uppercase tracking-wider">
                                  Buyer Information
                                </h3>
                                <div className="text-sm space-y-2 text-gray-500">
                                  <p className="font-medium text-black">
                                    {order.userId && (order.userId.username || order.userId.email || order.userId._id)}
                                  </p>
                                  {order.userId && order.userId.email && (
                                    <p>Email: {order.userId.email}</p>
                                  )}
                                  {order.userId && order.userId.phone && (
                                    <p>Phone: {order.userId.phone}</p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Shipping info */}
                              <div>
                                <h3 className="text-base font-mono font-semibold mb-3 text-[#1b2a41] uppercase tracking-wider">
                                  Shipping Information
                                </h3>
                                <div className="text-sm space-y-2 text-gray-500">
                                  <p className="font-medium text-black">
                                    {order.shippingInfo.fullName || `${order.shippingInfo.firstName || ''} ${order.shippingInfo.middleInitial ? order.shippingInfo.middleInitial + '.' : ''} ${order.shippingInfo.lastName || ''}`}
                                  </p>
                                  <p>{order.shippingInfo.address}</p>
                                  <p>
                                    {order.shippingInfo.city}, {order.shippingInfo.province} {order.shippingInfo.postalCode}
                                  </p>
                                  <p>Phone: {order.shippingInfo.phone}</p>
                                  <p>Email: {order.shippingInfo.email}</p>
                                </div>
                              </div>
                              
                              {/* Payment method */}
                              <div>
                                <h3 className="text-base font-mono font-semibold mb-3 text-[#1b2a41] uppercase tracking-wider">
                                  Payment Method
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {order.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : order.paymentMethod === "gcash"
                                    ? "GCash"
                                    : order.paymentMethod === "bank"
                                    ? "Bank Transfer"
                                    : order.paymentMethod}
                                </p>
                              </div>
                              
                              {/* Update status */}
                              <div>
                                <h3 className="text-base font-mono font-semibold mb-3 text-[#5c3d2e] uppercase tracking-wider">
                                  Update Status
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {order.status !== "processing" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(order._id, "processing");
                                      }}
                                      className="bg-[#f0e0d6] border border-[#b38664] hover:bg-[#e6d7d0] text-[#5c3d2e] px-3 py-2 font-mono tracking-wider text-sm transition-colors rounded font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-[#b38664]"
                                    >PROCESSING</button>
                                  )}
                                  {order.status !== "shipped" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(order._id, "shipped");
                                      }}
                                      className="bg-[#e6d7d0] border border-[#8b6d5c] hover:bg-[#e0cfc7] text-[#6f4e37] px-3 py-2 font-mono tracking-wider text-sm transition-colors rounded font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8b6d5c]"
                                    >SHIPPED</button>
                                  )}
                                  {order.status !== "delivered" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(order._id, "delivered");
                                      }}
                                      className="bg-[#e0cfc7] border border-[#6f4e37] hover:bg-[#d1c0b5] text-[#483429] px-3 py-2 font-mono tracking-wider text-sm transition-colors rounded font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37]"
                                    >DELIVERED</button>
                                  )}
                                  {order.status !== "cancelled" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(order._id, "cancelled");
                                      }}
                                      className="bg-[#e8d0c5] border border-[#4a2c1b] hover:bg-[#d8c0b5] text-[#4a2c1b] px-3 py-2 font-mono tracking-wider text-sm transition-colors rounded font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-[#4a2c1b]"
                                    >CANCEL</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanOrders;

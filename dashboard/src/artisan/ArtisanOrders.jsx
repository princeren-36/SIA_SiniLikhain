import React, { useEffect, useState } from "react";
import ArtisanLayout from "./ArtisanLayout";
import axios from "axios";
import { API_BASE } from "../utils/api";
import { toast } from "react-toastify";
import { format } from "date-fns";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const ArtisanOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  
  useEffect(() => {
    if (!user || !user._id) {
      return;
    }
    
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE}/orders/artisan/${user._id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders. Please try again later.");
      }
    };
    
    fetchOrders();
    // Poll for updates every 30 seconds
    const pollInterval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(pollInterval);
  }, [user]);
  
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/status`, { status });
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
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
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Orders</h1>
          
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-md ${
                selectedFilter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setSelectedFilter("pending")}
              className={`px-4 py-2 rounded-md ${
                selectedFilter === "pending" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedFilter("processing")}
              className={`px-4 py-2 rounded-md ${
                selectedFilter === "processing" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setSelectedFilter("shipped")}
              className={`px-4 py-2 rounded-md ${
                selectedFilter === "shipped" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setSelectedFilter("delivered")}
              className={`px-4 py-2 rounded-md ${
                selectedFilter === "delivered" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setSelectedFilter("cancelled")}
              className={`px-4 py-2 rounded-md ${
                selectedFilter === "cancelled" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              Cancelled
            </button>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {selectedFilter === "all" 
                  ? "No orders found" 
                  : `No ${selectedFilter} orders found`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div
                    className="p-4 cursor-pointer flex flex-wrap items-center justify-between"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Order #{order._id.substring(order._id.length - 8)}
                      </span>
                      <span className="text-sm">
                        {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${paymentColors[order.paymentStatus]}`}>
                        Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">
                        ₱{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                      <svg
                        className={`ml-2 h-5 w-5 text-gray-500 transform ${
                          expandedOrderId === order._id ? "rotate-180" : ""
                        }`}
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
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <h3 className="font-medium text-gray-800 dark:text-white mb-3">Products</h3>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div 
                                key={item._id || item.productId} 
                                className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-3"
                              >
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  {item.image ? (
                                    <img
                                      src={`${API_BASE}/${item.image}`}
                                      alt={item.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 text-xs">No image</span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4 flex-1">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                  </h4>
                                  <div className="mt-1 flex justify-between text-sm">
                                    <div>
                                      <p className="text-gray-500 dark:text-gray-400">Qty {item.quantity}</p>
                                    </div>
                                    <p className="text-gray-800 dark:text-white">
                                      ₱{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="lg:col-span-1">
                          <div className="space-y-4">
                            {/* Shipping info */}
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                                Shipping Information
                              </h3>
                              <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {order.shippingInfo.fullName}
                                </p>
                                <p>{order.shippingInfo.address}</p>
                                <p>
                                  {order.shippingInfo.city}, {order.shippingInfo.province}{" "}
                                  {order.shippingInfo.postalCode}
                                </p>
                                <p>Phone: {order.shippingInfo.phone}</p>
                                <p>Email: {order.shippingInfo.email}</p>
                              </div>
                            </div>
                            
                            {/* Payment method */}
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                                Payment Method
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
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
                              <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                                Update Status
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                {order.status !== "processing" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(order._id, "processing");
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                  >
                                    Mark Processing
                                  </button>
                                )}
                                {order.status !== "shipped" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(order._id, "shipped");
                                    }}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                                  >
                                    Mark Shipped
                                  </button>
                                )}
                                {order.status !== "delivered" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(order._id, "delivered");
                                    }}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                  >
                                    Mark Delivered
                                  </button>
                                )}
                                {order.status !== "cancelled" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(order._id, "cancelled");
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                  >
                                    Cancel Order
                                  </button>
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
    </ArtisanLayout>
  );
};

export default ArtisanOrders;

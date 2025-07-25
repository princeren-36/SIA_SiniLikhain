import React, { useEffect, useState, useMemo } from "react";
import ArtisanLayout from "./ArtisanLayout";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Line as ChartLine } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/calendar-theme.css';
import { API_BASE } from "../utils/api";
import { getArtisanProducts, getProductSoldCounts } from "../utils/artisan";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#38bdf8", "#facc15"];

const ArtisanDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockView, setStockView] = useState('all'); // 'all', 'low' or 'high'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true); // Force dark mode
  const [soldCounts, setSoldCounts] = useState({});
  const [recentSales, setRecentSales] = useState([]);
  const [artisanOrders, setArtisanOrders] = useState([]);

  // Add state for pagination
  const [recentSalesPage, setRecentSalesPage] = useState(0);
  const RECENT_SALES_PER_PAGE = 10;
  const paginatedRecentSales = recentSales.slice(
    recentSalesPage * RECENT_SALES_PER_PAGE,
    (recentSalesPage + 1) * RECENT_SALES_PER_PAGE
  );
  const canGoPrev = recentSalesPage > 0;
  const canGoNext = (recentSalesPage + 1) * RECENT_SALES_PER_PAGE < recentSales.length;

  // Memoize user to avoid re-parsing on every render
  const user = useMemo(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"))
      );
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "artisan") return;
    setLoading(true);
    
    // Fetch products, sold counts, and artisan orders in parallel
    Promise.all([
      getArtisanProducts(user.username),
      getProductSoldCounts(user.username),
      axios.get(`${API_BASE}/orders/artisan/${user._id}`)
    ])
      .then(([artisanProducts, productSoldCounts, ordersResponse]) => {
        // Merge sold counts with products
        const productsWithSales = artisanProducts.map(product => ({
          ...product,
          sold: productSoldCounts[product._id] || 0
        }));
        
        // Process the artisan orders to extract recent sales
        const orders = ordersResponse.data;
        
        // Sort orders by date (newest first)
        const sortedOrders = [...orders].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Save the complete orders list
        setArtisanOrders(sortedOrders);
        
        // Extract recent sales from the orders
        const recentSalesData = sortedOrders.slice(0, 5).flatMap(order => {
          const orderDate = new Date(order.createdAt);
          const formattedDate = orderDate.toLocaleDateString();
          
          return order.items.map(item => ({
            orderId: order._id,
            orderDate: formattedDate,
            productId: item.productId?._id || item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            buyerUsername: order.userId?.username || 'Unknown'
          }));
        });
        
        setProducts(productsWithSales);
        setSoldCounts(productSoldCounts);
        setRecentSales(recentSalesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setError("Error fetching products");
        setLoading(false);
      });
    
    // Polling: refresh products every 15 seconds
    const poll = setInterval(() => {
      Promise.all([
        getArtisanProducts(user.username),
        getProductSoldCounts(user.username),
        axios.get(`${API_BASE}/orders/artisan/${user._id}`)
      ])
        .then(([artisanProducts, productSoldCounts, ordersResponse]) => {
          // Merge sold counts with products
          const productsWithSales = artisanProducts.map(product => ({
            ...product,
            sold: productSoldCounts[product._id] || 0
          }));
          
          // Process the artisan orders to extract recent sales
          const orders = ordersResponse.data;
          
          // Sort orders by date (newest first)
          const sortedOrders = [...orders].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          
          // Save the complete orders list
          setArtisanOrders(sortedOrders);
          
          // Extract recent sales from the orders
          const recentSalesData = sortedOrders.slice(0, 5).flatMap(order => {
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleDateString();
            
            return order.items.map(item => ({
              orderId: order._id,
              orderDate: formattedDate,
              productId: item.productId?._id || item.productId,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
              buyerUsername: order.userId?.username || 'Unknown'
            }));
          });
          
          setProducts(productsWithSales);
          setSoldCounts(productSoldCounts);
          setRecentSales(recentSalesData);
        });
    }, 15000);
    
    return () => clearInterval(poll);
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000 * 60); // update every minute
    // Remove dark mode detection for now
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Analytics
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0)), 0);

  // Calculate total revenue from delivered orders
  const totalRevenue = artisanOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)
    , 0);

  // Data for charts
  const barData = products.map(p => ({
    name: p.name,
    quantity: parseInt(p.quantity) || 0,
    value: (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0)
  }));
  const pieData = Object.values(products.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || { name: p.category, value: 0 };
    acc[p.category].value += (parseInt(p.quantity) || 0);
    return acc;
  }, {}));

  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    return ['All', ...Array.from(new Set(cats))];
  }, [products]);

  const filteredBarData = useMemo(() => {
    if (selectedCategory === 'All') return barData;
    return barData.filter(p => p.name && products.find(prod => prod.name === p.name && prod.category === selectedCategory));
  }, [barData, selectedCategory, products]);

  const stockOptions = [
    { value: 'low', label: 'Low Stock (≤ 5 units)' },
    { value: 'high', label: 'High Stock (Top 5)' }
  ];
  const stockData = useMemo(() => {
    if (stockView === 'low') {
      return products.filter(p => (parseInt(p.quantity) || 0) <= 5);
    } else if (stockView === 'high') {
      return products
        .slice()
        .sort((a, b) => (parseInt(b.quantity) || 0) - (parseInt(a.quantity) || 0))
        .slice(0, 5);
    } else {
      return products;
    }
  }, [products, stockView]);

  // Mock purchases data
  const purchases = [
    { date: '22/12/2023', reference: 'S-920873850390', supplier: 'Peter', payment: 'Bank', status: 'Complete', amount: '$1282' },
    { date: '23/12/2023', reference: 'S-920873850391', supplier: 'Melinda', payment: 'Cash', status: 'Partial', amount: '$1382' },
    { date: '24/12/2023', reference: 'S-920873850392', supplier: 'Sunaina', payment: 'Cash', status: 'Partial', amount: '$1482' },
    { date: '25/12/2023', reference: 'S-920873850393', supplier: 'David Warner', payment: '----', status: 'Unpaid', amount: '$1582' },
    { date: '26/12/2023', reference: 'S-920873850394', supplier: 'Evarton', payment: 'Bank', status: 'Complete', amount: '$1582' },
    { date: '27/12/2023', reference: 'S-920873850393', supplier: 'David Warner', payment: '----', status: 'Unpaid', amount: '$1582' },
  ];

  // Product status counts
  const approvedCount = products.filter(p => p.status === 'approved').length;
  const pendingCount = products.filter(p => p.status !== 'approved').length;

  // Prepare stock chart data for Chart.js
  const getStockChartData = () => {
    let filtered = products;
    let color = 'rgb(59,130,246)'; // blue default
    if (stockView === 'low') {
      filtered = products.filter(p => (parseInt(p.quantity) || 0) <= 5);
      color = 'rgb(239,68,68)'; // red
    } else if (stockView === 'high') {
      filtered = products.filter(p => (parseInt(p.quantity) || 0) > 5);
      color = 'rgb(34,197,94)'; // green
    }
    return {
      labels: filtered.map(p => p.name),
      datasets: [
        {
          label: 'Stock Quantity',
          data: filtered.map(p => parseInt(p.quantity) || 0),
          borderColor: color,
          backgroundColor: color.replace('rgb', 'rgba').replace(')', ',0.1)'),
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
        }
      ]
    };
  };

  // Prepare Product Quantities chart data for Chart.js
  const getProductQuantitiesChartData = () => {
    return {
      labels: filteredBarData.map(p => p.name),
      datasets: [
        {
          label: 'Quantity',
          data: filteredBarData.map(p => p.quantity),
          borderColor: 'rgb(96,165,250)',
          backgroundColor: 'rgba(96,165,250,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
        }
      ]
    };
  };

  return (
    <ArtisanLayout>
      <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-h-screen ${isDarkMode ? 'bg-[#18181b] text-gray-100' : ''}`}>
        {/* Sticky Top Bar for Mobile */}
        <div className="block sm:hidden sticky top-0 z-30 bg-[#18181b] border-b border-gray-800 shadow-md px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-gray-100">Artisan Dashboard</h2>
        </div>
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 overflow-x-auto pb-24 sm:pb-0">
          {/* Hide duplicate heading on mobile */}
          <h2 className={`hidden sm:flex text-xl sm:text-2xl font-bold mb-4 tracking-tight items-center gap-3 ${isDarkMode ? 'text-gray-100' : 'text-[#1b2a41]'}`}>Artisan Dashboard</h2>
          <p className={`mb-6 text-sm sm:text-base ${isDarkMode ? 'text-gray-500' : ''}`}>Welcome to your dashboard! Here you can see an overview of your activity.</p>
          {/* Product Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8">
            <div className={`p-6 rounded-2xl shadow-lg border-l-8 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#1f1f23] border-green-800' : 'bg-gradient-to-br from-green-100 to-green-50 border-green-500'}`}>
              <div className="absolute right-4 top-4 opacity-10 text-7xl">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex flex-col gap-2 z-10 relative">
                <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Approved Products</span>
                <div className={`text-4xl font-extrabold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{approvedCount}</div>
                <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ready for sale</div>
              </div>
            </div>
            <div className={`p-6 rounded-2xl shadow-lg border-l-8 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#1f1f23] border-amber-800' : 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-500'}`}>
              <div className="absolute right-4 top-4 opacity-10 text-7xl">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col gap-2 z-10 relative">
                <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pending/Rejected Products</span>
                <div className={`text-4xl font-extrabold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>{pendingCount}</div>
                <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Awaiting review</div>
              </div>
            </div>
          </div>
          {loading ? (
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>Loading analytics...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8">
              {/* Main Content (left and center) */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
                  {/* Analytics Cards */}
                  <div className={`p-6 rounded-2xl shadow-lg border-l-8 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#1f1f23] border-blue-800' : 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-500'}`}>
                    <div className="absolute right-4 top-4 opacity-10 text-7xl">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2 z-10 relative">
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Products</span>
                      <div className={`text-4xl font-extrabold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{totalProducts}</div>
                    </div>
                  </div>
                  <div className={`p-6 rounded-2xl shadow-lg border-l-8 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#1f1f23] border-green-800' : 'bg-gradient-to-br from-green-100 to-green-50 border-green-500'}`}>
                    <div className="absolute right-4 top-4 opacity-10 text-7xl">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2 z-10 relative">
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Quantity</span>
                      <div className={`text-4xl font-extrabold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{totalQuantity}</div>
                    </div>
                  </div>
                  <div className={`p-6 rounded-2xl shadow-lg border-l-8 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#1f1f23] border-amber-800' : 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-500'}`}>
                    <div className="absolute right-4 top-4 opacity-10 text-7xl">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2 z-10 relative">
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Revenue</span>
                      <div className={`text-4xl font-extrabold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>₱{totalRevenue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                    </div>
                  </div>
                </div>
                {/* Graphs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8 mb-8">
                  <div className={`p-3 sm:p-8 rounded-2xl shadow-xl border border-gray-800/60 sm:border ${isDarkMode ? 'bg-[#1f1f23] border-blue-900' : 'bg-white border-blue-100'}`}> 
                    <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Product Quantities
                    </h3>
                    <div className="mb-4">
                      <label htmlFor="category-select" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mr-2 font-medium`}>Category:</label>
                      <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className={`rounded px-3 py-1.5 border focus:outline-none focus:ring-2 ${
                          isDarkMode 
                            ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500/40' 
                            : 'bg-white text-gray-800 border-gray-300 focus:ring-blue-500/30'
                        }`}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="h-[180px] sm:h-[250px] w-full">
                      <ChartLine
                        data={getProductQuantitiesChartData()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              backgroundColor: isDarkMode ? '#1f1f23' : 'rgba(255,255,255,0.95)',
                              titleColor: isDarkMode ? '#e5e7eb' : '#111',
                              bodyColor: isDarkMode ? '#e5e7eb' : '#555',
                              borderColor: isDarkMode ? '#333' : '#ddd',
                              borderWidth: 1,
                              padding: 12,
                              boxPadding: 6,
                              usePointStyle: true,
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                              },
                              ticks: {
                                color: isDarkMode ? '#e5e7eb' : undefined,
                                stepSize: 1,
                                callback: function(value) {
                                  if (Number.isInteger(value)) return value;
                                  return null;
                                }
                              }
                            },
                            x: {
                              grid: { display: false },
                              ticks: { color: isDarkMode ? '#e5e7eb' : undefined }
                            }
                          },
                          interaction: { intersect: false, mode: 'index' },
                          elements: { point: { radius: 4, hoverRadius: 7 } }
                        }}
                      />
                    </div>
                  </div>
                  <div className={`p-3 sm:p-8 rounded-2xl shadow-xl border border-gray-800/60 sm:border ${isDarkMode ? 'bg-[#1f1f23] border-green-900' : 'bg-white border-green-100'}`}> 
                    <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                      Products by Category
                    </h3>
                    {pieData.length === 0 ? (
                      <div className={`flex items-center justify-center h-[180px] sm:h-[250px] text-center text-gray-400 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        No category data available.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label={({ name, value }) => `${name}: ${value}`}
                            labelLine={false}
                          >
                            {pieData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            wrapperStyle={{
                              color: isDarkMode ? '#e5e7eb' : '#222',
                              fontWeight: 500,
                              fontSize: 13,
                              marginTop: 10
                            }}
                          />
                          <Tooltip
                            contentStyle={isDarkMode ? { backgroundColor: '#23232b', border: '1px solid #333', color: '#e5e7eb' } : {}}
                            formatter={(value, name) => [`${value} unit${value !== 1 ? 's' : ''}`, 'Quantity']}
                            labelFormatter={label => `Category: ${label}`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                {/* Stock Analysis Section */}
                <div className={`p-3 sm:p-8 rounded-2xl shadow-xl mb-8 border border-gray-800/60 sm:border ${isDarkMode ? 'bg-[#1f1f23] border-blue-900' : 'bg-white border-blue-100'}`}> 
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Stock Analysis
                    </h3>
                    <div className="flex">
                      <button
                        className={`!px-3 !py-1 !rounded-l !border !transition-colors !duration-150 ${stockView === 'all' 
                          ? isDarkMode 
                            ? '!bg-blue-600 !border-blue-700 !text-white !font-semibold' 
                            : '!bg-blue-100 !border-blue-300 !text-blue-700 !font-semibold' 
                          : isDarkMode 
                            ? '!bg-gray-700 !border-gray-600 !text-gray-300' 
                            : '!bg-gray-100 !border-gray-300 !text-gray-700'}`}
                        onClick={() => setStockView('all')}
                      >
                        All
                      </button>
                      <button
                        className={`!px-3 !py-1 !border-t !border-b !transition-colors !duration-150 ${stockView === 'low' 
                          ? isDarkMode 
                            ? '!bg-red-600 !border-red-700 !text-white !font-semibold' 
                            : '!bg-red-100 !border-red-300 !text-red-700 !font-semibold' 
                          : isDarkMode 
                            ? '!bg-gray-700 !border-gray-600 !text-gray-300' 
                            : '!bg-gray-100 !border-gray-300 !text-gray-700'}`}
                        onClick={() => setStockView('low')}
                      >
                        Low Stock
                      </button>
                      <button
                        className={`!px-3 !py-1 !rounded-r !border !transition-colors !duration-150 ${stockView === 'high' 
                          ? isDarkMode 
                            ? '!bg-green-600 !border-green-700 !text-white !font-semibold' 
                            : '!bg-green-100 !border-green-300 !text-green-700 !font-semibold' 
                          : isDarkMode 
                            ? '!bg-gray-700 !border-gray-600 !text-gray-300' 
                            : '!bg-gray-100 !border-gray-300 !text-gray-700'}`}
                        onClick={() => setStockView('high')}
                      >
                        High Stock
                      </button>
                    </div>
                  </div>
                  <div className="h-[180px] sm:h-[250px] w-full">
                    <ChartLine
                      data={getStockChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor: isDarkMode ? '#23232b' : 'rgba(255,255,255,0.95)',
                            titleColor: isDarkMode ? '#e5e7eb' : '#111',
                            bodyColor: isDarkMode ? '#e5e7eb' : '#555',
                            borderColor: isDarkMode ? '#333' : '#ddd',
                            borderWidth: 1,
                            padding: 12,
                            boxPadding: 6,
                            usePointStyle: true,
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                            },
                            ticks: {
                              color: isDarkMode ? '#e5e7eb' : undefined,
                              stepSize: 1,
                              callback: function(value) {
                                if (Number.isInteger(value)) return value;
                                return null;
                              }
                            }
                          },
                          x: {
                            grid: { display: false },
                            ticks: { color: isDarkMode ? '#e5e7eb' : undefined }
                          }
                        },
                        interaction: { intersect: false, mode: 'index' },
                        elements: { point: { radius: 4, hoverRadius: 7 } }
                      }}
                    />
                  </div>
                  <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stockView === 'all' && '* Showing all products by stock level.'}
                    {stockView === 'low' && '* Showing only products with low stock (≤ 5 units).'}
                    {stockView === 'high' && '* Showing only products with high stock levels (> 5 units).'}
                  </p>
                </div>
              </div>
              {/* Top Selling Products (right sidebar) */}
              <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col h-full mt-4 lg:mt-0">
                <div className={`p-3 sm:p-6 rounded-2xl shadow-xl border border-gray-800/60 sm:border flex flex-col ${isDarkMode ? 'bg-[#1f1f23] border-blue-900' : 'bg-white border-blue-100'}`}> 
                  <h3 className={`text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}> 
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"> 
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> 
                    </svg> 
                    Recent Sold Products 
                  </h3>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Recent orders from your customers
                  </p>
                  <div className="flex-1 overflow-x-auto overflow-y-auto relative">
                    <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-[#18181b] to-transparent pointer-events-none block sm:hidden" style={{zIndex:2}}></div>
                    <table className={`w-full min-w-[320px] text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}> 
                      <thead> 
                        <tr className={isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}> 
                          <th className="text-left pb-2 font-semibold">Product</th> 
                          <th className="text-center pb-2 font-semibold">Qty</th>
                          <th className="text-right pb-2 font-semibold">Date</th>
                        </tr> 
                      </thead> 
                      <tbody> 
                        {paginatedRecentSales.length > 0 ? (
                          paginatedRecentSales.map((sale, idx) => ( 
                            <tr key={`${sale.orderId}-${idx}`} className={`${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} hover:bg-opacity-10 hover:bg-gray-500`}> 
                              <td className="py-2 pr-1" title={sale.productName}>
                                {sale.productName.length > 12 ? `${sale.productName.substring(0, 12)}...` : sale.productName}
                              </td> 
                              <td className="py-2 text-center font-medium">
                                <span className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                                  {sale.quantity}
                                </span>
                              </td>
                              <td className="py-2 text-right text-xs" title={`Buyer: ${sale.buyerUsername}`}>{sale.orderDate}</td>
                            </tr> 
                          ))
                        ) : (
                          <tr className={`${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                            <td colSpan="3" className="py-4 text-center text-gray-500">No recent sales data yet</td>
                          </tr>
                        )}
                      </tbody> 
                    </table> 
                  </div>
                  {/* Pagination Controls */}
                  {recentSales.length > RECENT_SALES_PER_PAGE && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                      <button
                        onClick={() => canGoPrev && setRecentSalesPage(recentSalesPage - 1)}
                        disabled={!canGoPrev}
                        className={`p-1 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${canGoPrev ? (isDarkMode ? 'border-blue-700 hover:bg-blue-800 bg-blue-700/10 text-blue-300' : 'border-blue-600 hover:bg-blue-100 bg-blue-50 text-blue-700') : 'border-gray-300 bg-gray-100 text-gray-400 opacity-40 cursor-not-allowed'}`}
                        aria-label="Previous"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700 font-semibold'}`}>Page {recentSalesPage + 1} of {Math.ceil(recentSales.length / RECENT_SALES_PER_PAGE)}</span>
                      <button
                        onClick={() => canGoNext && setRecentSalesPage(recentSalesPage + 1)}
                        disabled={!canGoNext}
                        className={`p-1 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${canGoNext ? (isDarkMode ? 'border-blue-700 hover:bg-blue-800 bg-blue-700/10 text-blue-300' : 'border-blue-600 hover:bg-blue-100 bg-blue-50 text-blue-700') : 'border-gray-300 bg-gray-100 text-gray-400 opacity-40 cursor-not-allowed'}`}
                        aria-label="Next"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {recentSales.length > 0 && artisanOrders.length > recentSales.length && (
                    <div className={`text-xs text-center mt-2 pt-2 border-t ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                      Showing {Math.min(recentSales.length, RECENT_SALES_PER_PAGE)} most recent sales from {artisanOrders.length} orders
                    </div>
                  )}
                </div> 
              </div>
            </div>
          )}
        </div>
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanDashboard;

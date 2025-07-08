import React, { useEffect, useState, useMemo } from "react";
import ArtisanLayout from "./ArtisanLayout";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Line as ChartLine } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/calendar-theme.css';
import { API_BASE } from "../utils/api";
import { getArtisanProducts } from "../utils/artisan";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#38bdf8", "#facc15"];

const ArtisanDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockView, setStockView] = useState('all'); // 'all', 'low' or 'high'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true); // Force dark mode

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
    getArtisanProducts(user.username)
      .then((artisanProducts) => {
        setProducts(artisanProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching products");
        setLoading(false);
      });
    // Polling: refresh products every 15 seconds
    const poll = setInterval(() => {
      getArtisanProducts(user.username)
        .then((artisanProducts) => {
          setProducts(artisanProducts);
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
      <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#18181b] text-gray-100' : ''}`}>
        <div className="p-4 md:p-6 lg:p-8 overflow-x-auto">
          <h2 className={`text-2xl font-bold mb-4 tracking-tight flex items-center gap-3 ${isDarkMode ? 'text-gray-100' : 'text-[#1b2a41]'}`}>Artisan Dashboard</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-500' : ''}`}>Welcome to your dashboard! Here you can see an overview of your activity.</p>
          {/* Product Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
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
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Inventory Value</span>
                      <div className={`text-4xl font-extrabold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>₱{totalValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                    </div>
                  </div>
                </div>
                {/* Graphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className={`p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-[#1f1f23] border-blue-900' : 'bg-white border-blue-100'}`}>
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
                    <div className="h-[250px] w-full">
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
                  <div className={`p-8 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-[#1f1f23] border-green-900' : 'bg-white border-green-100'}`}>
                    <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                      Products by Category
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {pieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip contentStyle={isDarkMode ? { backgroundColor: '#23232b', border: '1px solid #333', color: '#e5e7eb' } : undefined} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Stock Analysis Section */}
                <div className={`p-8 rounded-2xl shadow-xl mb-8 border ${isDarkMode ? 'bg-[#1f1f23] border-blue-900' : 'bg-white border-blue-100'}`}>
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
                  <div className="h-[250px] w-full">
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
              <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col h-full">
                <div className={`p-6 rounded-2xl shadow-xl border flex flex-col ${isDarkMode ? 'bg-[#1f1f23] border-blue-900' : 'bg-white border-blue-100'}`}> 
                  <h3 className={`text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}> 
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"> 
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> 
                    </svg> 
                    Top Selling Products 
                  </h3> 
                  <div className="flex-1 overflow-y-auto"> 
                    <table className={`w-full text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}> 
                      <thead> 
                        <tr className={isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}> 
                          <th className="text-left pb-2 font-semibold">Product</th> 
                          <th className="text-right pb-2 font-semibold">Sold</th> 
                        </tr> 
                      </thead> 
                      <tbody> 
                        {products 
                          .slice() 
                          .sort((a, b) => (parseInt(b.sold) || 0) - (parseInt(a.sold) || 0)) 
                          .slice(0, 5) 
                          .map((p, idx) => ( 
                            <tr key={p._id || p.name || idx} className={`${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} hover:bg-opacity-10 hover:bg-gray-500`}> 
                              <td className="py-2 pr-2">{p.name}</td> 
                              <td className="py-2 text-right font-medium">{p.sold || 0}</td> 
                            </tr> 
                          ))} 
                      </tbody> 
                    </table> 
                  </div> 
                </div> 
                {/* Realtime Calendar as a separate card */} 
                <div className={`p-5 rounded-2xl shadow-xl border flex-1 flex flex-col justify-between mt-2 ${isDarkMode ? 'bg-[#1f1f23] border-purple-900 react-calendar-dark' : 'bg-gradient-to-br from-purple-100 to-purple-50 border-purple-400 react-calendar-light'}`}>  
                  <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}> 
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"> 
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> 
                    </svg> 
                    Calendar 
                  </h4> 
                  <Calendar value={currentDate} className={`${isDarkMode ? 'react-calendar-dark' : 'react-calendar-light'} w-full text-xs md:text-sm flex-1`} />
                  <div className={`text-xs text-center mt-3 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}> 
                    Today: {currentDate.toLocaleDateString()}<br/> 
                    Time: {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  </div> 
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

import React, { useEffect, useState, useMemo } from "react";
import ArtisanLayout from "./ArtisanLayout";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/calendar-theme.css';

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#38bdf8", "#facc15"];

const ArtisanDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockView, setStockView] = useState('low'); // 'low' or 'high'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

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
    axios.get("http://localhost:5000/products")
      .then((res) => {
        const artisanProducts = res.data.filter(p => p.artisan === user.username);
        setProducts(artisanProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching products");
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000 * 60); // update every minute
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handleChange);
    return () => {
      clearInterval(interval);
      mq.removeEventListener('change', handleChange);
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
    } else {
      return products
        .slice()
        .sort((a, b) => (parseInt(b.quantity) || 0) - (parseInt(a.quantity) || 0))
        .slice(0, 5);
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

  return (
    <ArtisanLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Artisan Dashboard</h2>
        <p className="text-white mb-6">Welcome to your dashboard! Here you can see an overview of your activity.</p>
        {loading ? (
          <p className="text-white">Loading analytics...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content (left and center) */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 text-center min-h-[120px]">
                  <div className="text-3xl font-bold text-blue-300">{totalProducts}</div>
                  <div className="text-white mt-2">Total Products</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 text-center min-h-[120px]">
                  <div className="text-3xl font-bold text-green-300">{totalQuantity}</div>
                  <div className="text-white mt-2">Total Quantity</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 text-center min-h-[120px]">
                  <div className="text-3xl font-bold text-yellow-300">₱{totalValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  <div className="text-white mt-2">Total Inventory Value</div>
                </div>
              </div>
              {/* Graphs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Product Quantities</h3>
                  <div className="mb-4">
                    <label htmlFor="category-select" className="text-white mr-2">Category:</label>
                    <select
                      id="category-select"
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="bg-gray-700 text-white rounded px-2 py-1"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={filteredBarData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                      <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} tick={{ fill: '#fff', fontSize: 12 }} height={60} />
                      <YAxis tick={{ fill: '#fff' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="quantity" stroke="#60a5fa" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Products by Category</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Stock Analysis Section */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Stock Analysis</h3>
                  <div>
                    <button
                      className={`px-3 py-1 rounded-l bg-gray-700 text-white border-r border-gray-600 ${stockView === 'low' ? 'bg-red-500 font-bold' : ''}`}
                      onClick={() => setStockView('low')}
                    >
                      Low Stock
                    </button>
                    <button
                      className={`px-3 py-1 rounded-r bg-gray-700 text-white ${stockView === 'high' ? 'bg-green-500 font-bold' : ''}`}
                      onClick={() => setStockView('high')}
                    >
                      High Stock
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stockData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                    <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} tick={{ fill: '#fff', fontSize: 12 }} height={60} />
                    <YAxis tick={{ fill: '#fff' }} />
                    <Tooltip />
                    <Bar dataKey="quantity" fill={stockView === 'low' ? '#f87171' : '#34d399'} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-2 text-sm text-yellow-300">* {stockView === 'low' ? 'Showing products with low stock (≤ 5 units)' : 'Showing top 5 products with highest stock.'}</p>
              </div>
            </div>
            {/* Top Selling Products (right sidebar) */}
            <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
              <div className="bg-gray-800 rounded-lg p-6 mb-0 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-blue-300 mb-4">Top Selling Products</h3>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-white text-sm">
                    <thead>
                      <tr>
                        <th className="text-left pb-1">Product</th>
                        <th className="text-right pb-1">Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .slice()
                        .sort((a, b) => (parseInt(b.sold) || 0) - (parseInt(a.sold) || 0))
                        .slice(0, 5)
                        .map((p, idx) => (
                          <tr key={p._id || p.name || idx} className="border-t border-gray-600">
                            <td className="py-1 pr-2">{p.name}</td>
                            <td className="py-1 text-right">{p.sold || 0}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Realtime Calendar as a separate card */}
              <div className={`bg-gray-800 rounded-lg p-6 ${isDarkMode ? 'react-calendar-dark' : 'react-calendar-light'}`}> 
                <h4 className="text-md font-semibold text-white mb-2">Calendar</h4>
                <Calendar value={currentDate} className={isDarkMode ? 'react-calendar-dark' : 'react-calendar-light'} />
                <div className="text-xs text-white text-center mt-2">
                  Today: {currentDate.toLocaleDateString()}<br/>
                  Time: {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Purchases Table */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Purchases</h3>
          <table className="min-w-full text-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Reference</th>
                <th className="px-4 py-2 text-left">Supplier</th>
                <th className="px-4 py-2 text-left">Payment Mode</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((row, idx) => (
                <tr key={idx} className="border-t border-gray-700">
                  <td className="px-4 py-2">{row.date}</td>
                  <td className="px-4 py-2">{row.reference}</td>
                  <td className="px-4 py-2">{row.supplier}</td>
                  <td className="px-4 py-2">{row.payment}</td>
                  <td className="px-4 py-2">
                    {row.status === 'Complete' && <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">Complete</span>}
                    {row.status === 'Partial' && <span className="bg-purple-400/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold">Partial</span>}
                    {row.status === 'Unpaid' && <span className="bg-red-400/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">Unpaid</span>}
                  </td>
                  <td className="px-4 py-2">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanDashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGaugeHigh, faUser, faPalette, faBoxesStacked, faSignOut, 
  faEdit, faTrash, faSave, faBan, faCheck, faTimes,
  faEye, faEyeSlash, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import AdminDashboard from './AdminDashboard';
import AdminSidebar from './AdminSidebar';
import { Snackbar, Alert } from '@mui/material';
import { API_BASE } from '../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('overview');
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({ username: '', role: '' });
  const [showPasswordId, setShowPasswordId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') !== 'light');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode(d => !d);

  const generateTimeSeriesData = () => {
    const labels = [];
    const approvedData = [];
    const pendingData = [];
    const totalUsers = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      const baseApproved = products.filter(p => p.approved).length;
      const basePending = products.filter(p => !p.approved).length;
      const baseUsers = users.length;

      approvedData.push(Math.max(0, baseApproved - i + Math.floor(Math.random() * 5)));
      pendingData.push(Math.max(0, basePending - Math.floor(i/2) + Math.floor(Math.random() * 3)));
      totalUsers.push(Math.max(0, baseUsers - i + Math.floor(Math.random() * 3)));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Approved Products',
          data: approvedData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Pending Products',
          data: pendingData,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Total Users',
          data: totalUsers,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };
  useEffect(() => {
    axios.get(`${API_BASE}/users/all`).then(res => setUsers(res.data));
    axios.get(`${API_BASE}/products?admin=true`).then(res => setProducts(res.data));
  }, []);

  useEffect(() => {
    if (products.length > 0 || users.length > 0) {
      setChartData(generateTimeSeriesData());
    }
  }, [products, users]);

  useEffect(() => {
    setChartData(generateTimeSeriesData());
  }, [users, products]);

  const handleApprove = async (id) => {
    await axios.patch(`${API_BASE}/products/${id}/approve`);
    setProducts(products => products.map(p => p._id === id ? { ...p, approved: true } : p));
  };

  const handleReject = async (id) => {
    await axios.patch(`${API_BASE}/products/${id}/reject`);
    setProducts(products => products.map(p => p._id === id ? { ...p, approved: false } : p));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setSnackbarOpen(true);
    setTimeout(() => navigate("/Login"), 1200);
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditUserData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      password: user.password || '',
      role: user.role || ''
    });
  };

  const handleEditChange = (e) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    let currentErrors = {};
    let isValid = true;
    if (!editUserData.username.trim()) {
      currentErrors.username = "Username is required.";
      isValid = false;
    } else if (editUserData.username.trim().length < 3) {
      currentErrors.username = "Username must be at least 3 characters long.";
      isValid = false;
    }
    if (!editUserData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUserData.email.trim())) {
      currentErrors.email = "Valid email is required.";
      isValid = false;
    }
    if (!editUserData.phone || !/^\d{10,15}$/.test(editUserData.phone.trim())) {
      currentErrors.phone = "Phone number must be 10-15 digits.";
      isValid = false;
    }
    if (!editUserData.password || editUserData.password.length < 6) {
      currentErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }
    if (!isValid) {
      alert(Object.values(currentErrors).join('\n'));
      return;
    }
    const res = await axios.put(`${API_BASE}/users/${id}`, editUserData);
    setUsers(users.map(u => u._id === id ? res.data : u));
    setEditUserId(null);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Do you want to delete this user?')) return;
    await axios.delete(`${API_BASE}/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };
  const navItems = [
    { label: "Dashboard", value: "overview", icon: faGaugeHigh },
    { label: "Buyers", value: "buyer", icon: faUser },
    { label: "Artisans", value: "artisan", icon: faPalette },
    { label: "Products", value: "crud", icon: faBoxesStacked }
  ];

  const buyers = users.filter(u => u.role === "buyer");
  const artisans = users.filter(u => u.role === "artisan");
  return (
    <div className={`flex h-screen ${darkMode ? 'bg-[#18181b] text-gray-100' : 'bg-gray-100 text-black'} poppins-font`}>
      <AdminSidebar
        view={view}
        setView={setView}
        handleLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        navItems={navItems}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {view === "overview" && (
          <>
            <AdminDashboard
              users={users}
              products={products}
              buyers={buyers}
              artisans={artisans}
              chartData={chartData}
              sidebarOpen={sidebarOpen}
              view={view}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </>
        )}{view === "buyer" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Buyers
            </h1>
            <div className={`bg-white rounded-lg shadow-md overflow-hidden ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-100' : ''}`}>
              <div className="overflow-x-auto">
                <table className={`w-full text-left ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-100' : 'text-black'}`}>
                  <thead className={`bg-gray-50 border-b ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-300' : 'text-black'}`}>
                    <tr>
                      <th className="px-6 py-3 font-medium text-black">Username</th>
                      <th className="px-6 py-3 font-medium text-black">Email</th>
                      <th className="px-6 py-3 font-medium text-black">Phone Number</th>
                      <th className="px-6 py-3 font-medium text-black">Password</th>
                      <th className="px-6 py-3 font-medium text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : ''} text-black`}>
                    {buyers.map(u => (
                      <tr key={u._id} className={`hover:bg-gray-50 ${darkMode ? 'dark:hover:bg-[#23232b] dark:text-gray-100' : ''}`}>
                        <td className="px-6 py-4">
                          {editUserId === u._id ? (
                            <input 
                              className="border rounded px-2 py-1 w-full"
                              name="username" 
                              value={editUserData.username} 
                              onChange={handleEditChange} 
                            />
                          ) : u.username}
                        </td>
                        <td className="px-6 py-4">
                          {editUserId === u._id ? (
                            <input 
                              className="border rounded px-2 py-1 w-full"
                              name="email" 
                              value={editUserData.email || u.email || ''} 
                              onChange={handleEditChange} 
                            />
                          ) : u.email || ''}
                        </td>
                        <td className="px-6 py-4">
                          {editUserId === u._id ? (
                            <input 
                              className="border rounded px-2 py-1 w-full"
                              name="phone" 
                              value={editUserData.phone || u.phone || ''} 
                              onChange={handleEditChange} 
                            />
                          ) : u.phone || ''}
                        </td>
                        <td className="px-6 py-4">
                          <span>{'••••••'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {editUserId === u._id ? (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditSave(u._id)}
                                className={`bg-green-500 hover:bg-green-600 px-3 py-1 rounded flex items-center`}
                                style={{ color: darkMode ? '#fff' : '#000', border: 'none', outline: 'none' }}
                              >
                                <FontAwesomeIcon icon={faSave} className="mr-1 h-3 w-3" style={{ color: darkMode ? '#fff' : '#000' }} />
                                Save
                              </button>
                              <button 
                                onClick={() => setEditUserId(null)}
                                className={`bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded flex items-center`}
                                style={{ color: darkMode ? '#fff' : '#000', border: 'none', outline: 'none' }}
                              >
                                <FontAwesomeIcon icon={faBan} className="mr-1 h-3 w-3" style={{ color: darkMode ? '#fff' : '#000' }} />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              {/* Remove Edit button, only show Delete */}
                              <button 
                                onClick={() => handleDeleteUser(u._id)}
                                className={`bg-red-500 hover:bg-red-600 px-3 py-1 rounded flex items-center`}
                                style={{ color: '#fff', background: '#c1121f', fontWeight: 600, boxShadow: 'none', border: 'none', outline: 'none' }}
                              >
                                <FontAwesomeIcon icon={faTrash} className="mr-1 h-3 w-3" style={{ color: '#fff' }} />
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}{view === "artisan" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faPalette} className="mr-2" />
              Artisans
            </h1>
            <div className={`bg-white rounded-lg shadow-md overflow-hidden ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-100' : ''}`}>
              <div className="overflow-x-auto">
                <table className={`w-full text-left ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-100' : 'text-black'}`}>
                  <thead className={`bg-gray-50 border-b ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-300' : 'text-black'}`}>
                    <tr>
                      <th className="px-6 py-3 font-medium text-black">Username</th>
                      <th className="px-6 py-3 font-medium text-black">Email</th>
                      <th className="px-6 py-3 font-medium text-black">Phone Number</th>
                      <th className="px-6 py-3 font-medium text-black">Password</th>
                      <th className="px-6 py-3 font-medium text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : ''} text-black`}>
                    {artisans.map(u => (
                      <tr key={u._id} className={`hover:bg-gray-50 ${darkMode ? 'dark:hover:bg-[#23232b] dark:text-gray-100' : ''}`}>
                        <td className="px-6 py-4">
                          {editUserId === u._id ? (
                            <input 
                              className="border rounded px-2 py-1 w-full"
                              name="username" 
                              value={editUserData.username} 
                              onChange={handleEditChange} 
                            />
                          ) : u.username}
                        </td>
                        <td className="px-6 py-4">
                          {editUserId === u._id ? (
                            <input 
                              className="border rounded px-2 py-1 w-full"
                              name="email" 
                              value={editUserData.email || u.email || ''} 
                              onChange={handleEditChange} 
                            />
                          ) : u.email || ''}
                        </td>
                        <td className="px-6 py-4">
                          {editUserId === u._id ? (
                            <input 
                              className="border rounded px-2 py-1 w-full"
                              name="phone" 
                              value={editUserData.phone || u.phone || ''} 
                              onChange={handleEditChange} 
                            />
                          ) : u.phone || ''}
                        </td>
                        <td className="px-6 py-4">
                          <span>{'••••••'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {editUserId === u._id ? (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditSave(u._id)}
                                className={`bg-green-500 hover:bg-green-600 px-3 py-1 rounded flex items-center`}
                                style={{ color: darkMode ? '#fff' : '#000', border: 'none', outline: 'none' }}
                              >
                                <FontAwesomeIcon icon={faSave} className="mr-1 h-3 w-3" style={{ color: darkMode ? '#fff' : '#000' }} />
                                Save
                              </button>
                              <button 
                                onClick={() => setEditUserId(null)}
                                className={`bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded flex items-center`}
                                style={{ color: darkMode ? '#fff' : '#000', border: 'none', outline: 'none' }}
                              >
                                <FontAwesomeIcon icon={faBan} className="mr-1 h-3 w-3" style={{ color: darkMode ? '#fff' : '#000' }} />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              {/* Remove Edit button, only show Delete */}
                              <button 
                                onClick={() => handleDeleteUser(u._id)}
                                className={`bg-red-500 hover:bg-red-600 px-3 py-1 rounded flex items-center`}
                                style={{ color: '#fff', background: '#c1121f', fontWeight: 600, boxShadow: 'none', border: 'none', outline: 'none' }}
                              >
                                <FontAwesomeIcon icon={faTrash} className="mr-1 h-3 w-3" style={{ color: '#fff' }} />
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}{view === "crud" && (
          <div>
            <h1 className="text-2xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faBoxesStacked} className="mr-2" />
              Products
            </h1>
            <div className={`bg-white rounded-lg shadow-md overflow-hidden ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-100' : ''}`}>
              <div className="overflow-x-auto">
                <table className={`w-full text-left ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-100' : ''}`} style={{ color: '#000' }}>
                  <thead className={`bg-gray-50 border-b ${darkMode ? 'dark:bg-[#23232b] dark:text-gray-300' : ''}`} style={{ color: '#000' }}>
                    <tr className="text-black" style={{ color: '#000' }}>
                      <th className="px-6 py-3 font-medium" style={{ color: '#000' }}>Name</th>
                      <th className="px-6 py-3 font-medium" style={{ color: '#000' }}>Artisan</th>
                      <th className="px-6 py-3 font-medium" style={{ color: '#000' }}>Category</th>
                      <th className="px-6 py-3 font-medium" style={{ color: '#000' }}>Status</th>
                      <th className="px-6 py-3 font-medium" style={{ color: '#000' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : ''} text-black`} style={{ color: '#000' }}>
                    {products.map(p => (
                      <tr key={p._id} className={`hover:bg-gray-50 ${darkMode ? 'dark:hover:bg-[#23232b]' : ''} text-black`} style={{ color: '#000' }}>
                        <td className="px-6 py-4" style={{ color: '#000' }}>{p.name}</td>
                        <td className="px-6 py-4" style={{ color: '#000' }}>{p.artisan}</td>
                        <td className="px-6 py-4" style={{ color: '#000' }}>{p.category}</td>
                        <td className="px-6 py-4" style={{ color: '#000' }}>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${p.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                            style={{ color: '#000' }}>
                            {p.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#000' }}>
                          <div className="flex space-x-2">
                            {!p.approved && (
                              <button 
                                onClick={() => handleApprove(p._id)} 
                                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded flex items-center"
                                style={{ color: '#fff', border: 'none', outline: 'none', fontWeight: 700, backgroundColor: '#386641' }}
                              >
                                <FontAwesomeIcon icon={faCheck} className="mr-1 h-3 w-3" style={{ color: '#fff' }} />
                                Approve
                              </button>
                            )}
                            {p.approved && (
                              <button 
                                onClick={() => handleReject(p._id)} 
                                className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded flex items-center"
                                style={{ color: '#fff', border: 'none', outline: 'none', fontWeight: 700, backgroundColor: '#926c15' }}
                              >
                                <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" style={{ color: '#fff' }} />
                                Reject
                              </button>
                            )}
                            <button 
                              onClick={async () => {
                                if(window.confirm('Do you want to delete this product?')) {
                                  await axios.delete(`${API_BASE}/products/${p._id}`);
                                  setProducts(products.filter(prod => prod._id !== p._id));
                                }
                              }} 
                              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded flex items-center"
                              style={{ color: '#fff', background: '#c1121f', fontWeight: 600, boxShadow: 'none', border: 'none', outline: 'none' }}
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1 h-3 w-3" style={{ color: '#fff' }} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1200}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: '100%', color: '#fff', backgroundColor: '#16a34a', fontWeight: 700 }}>
          Successfully logged out!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Admin;
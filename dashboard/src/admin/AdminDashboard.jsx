import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faUser, faPalette, faBoxesStacked, faCheck, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';

function AdminDashboard({ users, products, buyers, artisans, chartData, darkMode }) {
  // Prepare data for product and user distribution line graphs
  const days = 7;
  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  // Fake time series for demo (replace with real backend data if available)
  const productApproved = labels.map((_, i) => Math.max(0, products.filter(p => p.approved).length - (days - 1 - i)));
  const productPending = labels.map((_, i) => Math.max(0, products.filter(p => !p.approved).length - Math.floor((days - 1 - i) / 2)));
  const userBuyers = labels.map((_, i) => Math.max(0, buyers.length - (days - 1 - i)));
  const userArtisans = labels.map((_, i) => Math.max(0, artisans.length - (days - 1 - i)));

  const productLineData = {
    labels,
    datasets: [
      {
        label: 'Approved Products',
        data: productApproved,
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.1)',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Pending Products',
        data: productPending,
        borderColor: 'rgb(245,158,11)',
        backgroundColor: 'rgba(245,158,11,0.1)',
        fill: false,
        tension: 0.4
      }
    ]
  };

  const userLineData = {
    labels,
    datasets: [
      {
        label: 'Buyers',
        data: userBuyers,
        borderColor: 'rgb(59,130,246)',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Artisans',
        data: userArtisans,
        borderColor: 'rgb(168,85,247)',
        backgroundColor: 'rgba(168,85,247,0.1)',
        fill: false,
        tension: 0.4
      }
    ]
  };

  return (
    <div className={`space-y-8 poppins-font transition-colors duration-300 ${darkMode ? 'bg-[#18181b] text-gray-100' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-3xl font-extrabold tracking-tight flex items-center gap-3 ${darkMode ? 'text-gray-100' : 'text-[#1b2a41]'}`}> 
          <FontAwesomeIcon icon={faGaugeHigh} className={`h-8 w-8 drop-shadow-md ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          Admin Dashboard
        </h2>
        <span className={`text-lg hidden md:block ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Artisan-made. Culture-inspired.</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className={`p-6 rounded-2xl shadow-lg border-l-8 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden ${darkMode ? 'bg-[#23232b] border-blue-800' : 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-500'}`}> 
          <div className="absolute right-4 top-4 opacity-10 text-7xl"><FontAwesomeIcon icon={faUser} /></div>
          <div className="flex flex-col gap-2 z-10 relative">
            <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Users</span>
            <div className={`text-4xl font-extrabold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{users.length}</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{Math.round(buyers.length)} buyer/s, {Math.round(artisans.length)} artisan/s</div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl shadow-lg border-l-8 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden ${darkMode ? 'bg-[#23232b] border-amber-800' : 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-500'}`}> 
          <div className="absolute right-4 top-4 opacity-10 text-7xl"><FontAwesomeIcon icon={faBoxesStacked} /></div>
          <div className="flex flex-col gap-2 z-10 relative">
            <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Products</span>
            <div className={`text-4xl font-extrabold ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>{products.length}</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{Math.round(products.filter(p => p.approved).length)} approved, {Math.round(products.filter(p => !p.approved).length)} pending</div>
          </div>
        </div>
        <div className={`p-6 rounded-2xl shadow-lg border-l-8 hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden ${darkMode ? 'bg-[#23232b] border-green-800' : 'bg-gradient-to-br from-green-100 to-green-50 border-green-500'}`}> 
          <div className="absolute right-4 top-4 opacity-10 text-7xl"><FontAwesomeIcon icon={faCheck} /></div>
          <div className="flex flex-col gap-2 z-10 relative">
            <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Approval Rate</span>
            <div className={`text-4xl font-extrabold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{products.length > 0 ? Math.round((products.filter(p => p.approved).length / products.length) * 100) : 0}%</div>
            <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{products.filter(p => p.approved).length} of {products.length} products</div>
          </div>
        </div>
      </div>
      <div className={`p-8 rounded-2xl shadow-xl mb-6 border ${darkMode ? 'bg-[#23232b] border-blue-900' : 'bg-white border-blue-100'}`}>
        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          <FontAwesomeIcon icon={faChartLine} className="mr-2" /> Activity Overview
        </h2>
        <div className="h-[300px] w-full">
          <Line 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  align: 'end',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    color: darkMode ? '#e5e7eb' : undefined
                  }
                },
                tooltip: {
                  backgroundColor: darkMode ? '#23232b' : 'rgba(255, 255, 255, 0.95)',
                  titleColor: darkMode ? '#e5e7eb' : '#111',
                  bodyColor: darkMode ? '#e5e7eb' : '#555',
                  borderColor: darkMode ? '#333' : '#ddd',
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
                    color: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.04)'
                  },
                  ticks: {
                    color: darkMode ? '#e5e7eb' : undefined
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: darkMode ? '#e5e7eb' : undefined
                  }
                }
              },
              interaction: {
                intersect: false,
                mode: 'index',
              },
              elements: {
                point: {
                  radius: 4,
                  hoverRadius: 7
                }
              }
            }}
          />
        </div>
      </div>
      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <div className={`p-8 rounded-2xl shadow-lg border ${darkMode ? 'bg-[#23232b] border-green-900' : 'bg-gradient-to-br from-green-50 to-white border-green-100'}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
            <FontAwesomeIcon icon={faBoxesStacked} className="mr-2" /> Product Distribution
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Approved</span>
                <span>{Math.round(products.filter(p => p.approved).length)} products</span>
              </div>
              <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${darkMode ? 'bg-green-500' : 'bg-green-500'}`} 
                  style={{ width: `${products.length > 0 ? (products.filter(p => p.approved).length / products.length) * 100 : 0}%` }} 
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Pending</span>
                <span>{Math.round(products.filter(p => !p.approved).length)} products</span>
              </div>
              <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${darkMode ? 'bg-amber-500' : 'bg-amber-500'}`} 
                  style={{ width: `${products.length > 0 ? (products.filter(p => !p.approved).length / products.length) * 100 : 0}%` }} 
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className={`p-8 rounded-2xl shadow-lg border ${darkMode ? 'bg-[#23232b] border-blue-900' : 'bg-gradient-to-br from-blue-50 to-white border-blue-100'}`}>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            <FontAwesomeIcon icon={faUser} className="mr-2" /> User Distribution
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Buyers</span>
                <span>{Math.round(buyers.length)} users</span>
              </div>
              <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${darkMode ? 'bg-blue-500' : 'bg-blue-500'}`} 
                  style={{ width: `${users.length > 0 ? (buyers.length / users.length) * 100 : 0}%` }} 
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Artisans</span>
                <span>{Math.round(artisans.length)} users</span>
              </div>
              <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${darkMode ? 'bg-purple-500' : 'bg-purple-500'}`} 
                  style={{ width: `${users.length > 0 ? (artisans.length / users.length) * 100 : 0}%` }} 
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product & User Distribution Line Graphs Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Product Distribution Line Graph */}
        <div className={`p-8 rounded-2xl shadow-xl border flex flex-col ${darkMode ? 'bg-[#23232b] border-green-900' : 'bg-white border-green-100'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
            <FontAwesomeIcon icon={faChartLine} className="mr-2" /> Product Distribution Over Time
          </h2>
          <div className="h-[300px] w-full">
            <Line 
              data={productLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                      usePointStyle: true,
                      boxWidth: 8,
                      color: darkMode ? '#e5e7eb' : undefined
                    }
                  },
                  tooltip: {
                    backgroundColor: darkMode ? '#23232b' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: darkMode ? '#e5e7eb' : '#111',
                    bodyColor: darkMode ? '#e5e7eb' : '#555',
                    borderColor: darkMode ? '#333' : '#ddd',
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
                      color: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.04)'
                    },
                    ticks: {
                      color: darkMode ? '#e5e7eb' : undefined,
                      stepSize: 1,
                      callback: function(value) {
                        if (Number.isInteger(value)) return value;
                        return null;
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: darkMode ? '#e5e7eb' : undefined
                    }
                  }
                },
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                elements: {
                  point: {
                    radius: 4,
                    hoverRadius: 7
                  }
                }
              }}
            />
          </div>
        </div>
        {/* User Distribution Line Graph */}
        <div className={`p-8 rounded-2xl shadow-xl border flex flex-col ${darkMode ? 'bg-[#23232b] border-blue-900' : 'bg-white border-blue-100'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            <FontAwesomeIcon icon={faChartLine} className="mr-2" /> User Distribution Over Time
          </h2>
          <div className="h-[300px] w-full">
            <Line 
              data={userLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                      usePointStyle: true,
                      boxWidth: 8,
                      color: darkMode ? '#e5e7eb' : undefined
                    }
                  },
                  tooltip: {
                    backgroundColor: darkMode ? '#23232b' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: darkMode ? '#e5e7eb' : '#111',
                    bodyColor: darkMode ? '#e5e7eb' : '#555',
                    borderColor: darkMode ? '#333' : '#ddd',
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
                      color: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.04)'
                    },
                    ticks: {
                      color: darkMode ? '#e5e7eb' : undefined,
                      stepSize: 1,
                      callback: function(value) {
                        if (Number.isInteger(value)) return value;
                        return null;
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: darkMode ? '#e5e7eb' : undefined
                    }
                  }
                },
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                elements: {
                  point: {
                    radius: 4,
                    hoverRadius: 7
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faUser, faPalette, faBoxesStacked, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faMoon as faMoonRegular, faSun as faSunRegular } from '@fortawesome/free-regular-svg-icons';

function AdminSidebar({ view, setView, handleLogout, sidebarOpen, navItems, darkMode, toggleDarkMode }) {
  const [showLogoutCard, setShowLogoutCard] = useState(false);

  const handleLogoutClick = () => setShowLogoutCard(true);
  const handleCancelLogout = () => setShowLogoutCard(false);
  const handleConfirmLogout = () => {
    setShowLogoutCard(false);
    handleLogout();
  };

  return (
    <div
      className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 shrink-0 shadow-lg font-poppins flex flex-col h-full`}
      style={{
        background: darkMode ? '#181a1b' : '#1b2a41',
        color: darkMode ? '#e0e0e0' : '#ccc9dc',
        minHeight: '100vh',
        boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
      }}
    >
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-xl" style={{ letterSpacing: '1px', color: darkMode ? '#e0e0e0' : '#fff' }}>SiniLikhain Admin Panel</h1>
          <button
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
            className="ml-2 p-2 rounded-full transition-colors duration-150 focus:outline-none"
            style={{ background: darkMode ? '#23272e' : '#22223b' }}
          >
            <FontAwesomeIcon icon={darkMode ? faSunRegular : faMoonRegular} className="w-5 h-5" style={{ color: darkMode ? '#ffd700' : '#ccc9dc' }} />
          </button>
        </div>
        <ul className="space-y-2 flex-1">
          {navItems.map(item => (
            <li key={item.value}>
              <button
                onClick={() => setView(item.value)}
                className={`w-full flex items-center p-2 rounded-lg transition-colors duration-150 ${view === item.value ? '' : ''}`}
                style={{
                  background: view === item.value ? 'rgba(30,64,175,0.18)' : 'transparent',
                  color: view === item.value ? '#60a5fa' : (darkMode ? '#e0e0e0' : '#ccc9dc'),
                  fontWeight: view === item.value ? 600 : 500,
                  boxShadow: view === item.value ? '0 2px 8px rgba(30,64,175,0.08)' : 'none',
                }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="w-5 h-5"
                  style={{ color: view === item.value ? '#60a5fa' : (darkMode ? '#e0e0e0' : '#ccc9dc'), transition: 'color 0.2s' }}
                />
                <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mb-4 text-xs text-center select-none" style={{ color: darkMode ? '#bdbdbd' : '#a0aec0' }}>
          Signed in as <span className="font-semibold" style={{ color: darkMode ? '#fff' : '#f3f4f6' }}>admin@sinilikhain.com</span>
        </div>
        <div className="mt-auto">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center p-2 rounded-lg transition-colors duration-150"
            style={{
              background: 'transparent',
              color: darkMode ? '#e0e0e0' : '#ccc9dc',
              fontWeight: 600,
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(30,64,175,0.12)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <FontAwesomeIcon icon={faSignOut} className="w-5 h-5" style={{ color: darkMode ? '#e57373' : '#ccc9dc' }} />
            <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </div>
      {/* Logout Confirmation Card Modal */}
      {showLogoutCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center border border-gray-300">
            <h2 className="text-lg font-bold mb-4 text-black">Confirm Logout</h2>
            <p className="mb-6 text-black text-center">Do you want to logout?</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={handleConfirmLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow"
              >
                Yes
              </button>
              <button
                onClick={handleCancelLogout}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 rounded-lg shadow"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSidebar;

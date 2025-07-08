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
        color: '#fff',
        minHeight: '100vh',
        boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
      }}
    >
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-xl" style={{ letterSpacing: '1px', color: '#fff' }}>SiniLikhain Admin Panel</h1>
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
                  color: view === item.value ? '#60a5fa' : '#fff',
                  fontWeight: view === item.value ? 600 : 500,
                  boxShadow: view === item.value ? '0 2px 8px rgba(30,64,175,0.08)' : 'none',
                }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="w-5 h-5"
                  style={{ color: view === item.value ? '#60a5fa' : '#fff', transition: 'color 0.2s' }}
                />
                <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mb-4 text-xs text-center select-none" style={{ color: '#fff' }}>
          Signed in as <span className="font-semibold" style={{ color: '#fff' }}>admin@sinilikhain.com</span>
        </div>
        <div className="mt-auto">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center p-2 rounded-lg transition-colors duration-150"
            style={{
              background: 'transparent',
              color: '#fff',
              fontWeight: 600,
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(30,64,175,0.12)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <FontAwesomeIcon icon={faSignOut} className="w-5 h-5" style={{ color: '#fff' }} />
            <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </div>
      {/* Logout Confirmation Card Modal */}
      {showLogoutCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
            <div className="text-lg font-bold mb-3 text-[#1b2a41] flex items-center gap-2" style={{ fontFamily: 'Source Code Pro, monospace' }}>
              <svg className="w-6 h-6 text-[#324a5f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0V7a3 3 0 016 0v1" /></svg>
              Confirm Logout
            </div>
            <div className="mb-5 text-[#1b2a41]" style={{ fontFamily: 'Source Code Pro, monospace' }}>Are you sure you want to log out of your account?</div>
            <div className="flex justify-end gap-3">
              <button onClick={handleCancelLogout} className="px-5 py-2 rounded-lg bg-[#ccc9dc] font-semibold shadow-sm transition cursor-pointer text-[#22223b]" style={{ fontFamily: 'Source Code Pro, monospace' }}>Cancel</button>
              <button onClick={handleConfirmLogout} className="px-5 py-2 rounded-lg !bg-[#660708] hover:!bg-red-700 text-white font-semibold shadow-sm transition cursor-pointer" style={{ fontFamily: 'Source Code Pro, monospace', boxShadow: 'none', outline: 'none', border: 'none' }}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSidebar;

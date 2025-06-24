import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faUser, faPalette, faBoxesStacked, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faMoon as faMoonRegular, faSun as faSunRegular } from '@fortawesome/free-regular-svg-icons';

function AdminSidebar({ view, setView, handleLogout, sidebarOpen, navItems, darkMode, toggleDarkMode }) {
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1b2a41] text-[#ccc9dc] transition-all duration-300 shrink-0 shadow-lg font-poppins flex flex-col h-full`}>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-xl">SiniLikhain Admin Panel</h1>
          <button
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
            className="ml-2 p-2 rounded-full hover:bg-[#22223b] transition-colors duration-150 focus:outline-none"
          >
            <FontAwesomeIcon icon={darkMode ? faSunRegular : faMoonRegular} className="w-5 h-5 text-[#ccc9dc]" />
          </button>
        </div>
        <ul className="space-y-2 flex-1">
          {navItems.map(item => (
            <li key={item.value}>
              <button 
                onClick={() => setView(item.value)} 
                className={`w-full flex items-center p-2 rounded-lg transition-colors duration-150 
                ${view === item.value ? 'bg-blue-900/30 text-blue-400' : 'hover:bg-blue-900/20'}`}
              >
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className={`${view === item.value ? 'text-blue-400' : 'text-[#ccc9dc]'} w-5 h-5`} 
                />
                <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mb-4 text-xs text-gray-400 text-center select-none">
          Signed in as <span className="font-semibold text-gray-300">admin@sinilikhain.com</span>
        </div>
        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-2 rounded-lg hover:bg-blue-900/20 transition-colors duration-150"
          >
            <FontAwesomeIcon icon={faSignOut} className="text-[#ccc9dc] w-5 h-5" />
            <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;

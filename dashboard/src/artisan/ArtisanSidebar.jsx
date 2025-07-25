import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";
import { MdInventory, MdInventory2, MdDashboard } from "react-icons/md";
import { IoMdAdd, IoMdInformationCircle, IoMdInformationCircleOutline } from "react-icons/io";
import { RiProductHuntLine, RiProductHuntFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { BsFillGearFill, BsGear } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { FaRegIdBadge, FaUsersCog, FaShoppingBag } from "react-icons/fa";
import { MdOutlineShoppingBag, MdShoppingBag } from "react-icons/md";



const ArtisanSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");
  const getInitialExpandedMenus = () => {
    const saved = sessionStorage.getItem('artisanSidebarExpandedMenus');
    if (saved) return JSON.parse(saved);
    return { home: false, inventory: false };
  };

  const [expandedMenus, setExpandedMenus] = useState(getInitialExpandedMenus);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Toggle submenu visibility
  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Persist expandedMenus in sessionStorage
  React.useEffect(() => {
    sessionStorage.setItem('artisanSidebarExpandedMenus', JSON.stringify(expandedMenus));
  }, [expandedMenus]);

  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  // Handle logout
  const handleLogout = () => {
    // Clear any auth tokens or user data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    
    // Close dialog and show success message
    setShowLogoutDialog(false);
    setShowLogoutSuccess(true);
    
    // Redirect after a short delay to show the success message
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  // Check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>
        {`
          .hover-item:hover {
            background: #23272e !important;
          }
          .active-item {
            background: rgba(30,64,175,0.18) !important;
            color: #60a5fa !important;
            font-weight: 600 !important;
            box-shadow: 0 2px 8px rgba(30,64,175,0.08);
          }
        `}
      </style>
      <div
        className={`h-screen transition-all duration-300 ease-in-out flex flex-col overflow-hidden fixed top-0 left-0 z-40 bg-[#181a1b]`}
        style={{ width: isOpen ? 320 : 80, color: '#fff', minHeight: '100vh', boxShadow: '2px 0 8px rgba(0,0,0,0.08)' }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center mb-2" style={{ minHeight: 56, width: '100%' }}>
          {isOpen ? (
            <h1 className="font-bold text-xl w-full" style={{ letterSpacing: '1px', color: '#fff', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', textAlign: 'left', lineHeight: 1.2 }}>
              SiniLikhain<br />Artisan Panel
            </h1>
          ) : (
            <span className="font-bold text-xl" style={{ color: '#fff', letterSpacing: '1px' }}>SL</span>
          )}
        </div>
        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {/* Home */}
            <li className="px-4 py-2">
              <div
                className={`flex items-center justify-between cursor-pointer rounded-lg p-2 hover-item ${isActive("/artisan") ? "active-item" : ""}`}
                style={{ color: isActive("/artisan") ? '#60a5fa' : '#fff', fontWeight: isActive("/artisan") ? 600 : 500 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOpen) {
                    toggleSidebar();
                    setTimeout(() => toggleSubmenu("home"), 200);
                  } else {
                    toggleSubmenu("home");
                  }
                }}
              >
                <div className="flex items-center">
                  {isActive("/artisan") ? (
                    <IoHomeSharp className="text-xl" style={{ color: '#60a5fa' }} />
                  ) : (
                    <IoHomeOutline className="text-xl" />
                  )}
                  {isOpen && <span className="ml-3">Home</span>}
                </div>
                {isOpen && (
                  <span>
                    {expandedMenus.home ? <FaCaretUp /> : <FaCaretDown />}
                  </span>
                )}
              </div>
              {/* Home submenu */}
              {isOpen && expandedMenus.home && (
                <ul className="pl-4 mt-2">
                  <li>
                    <Link
                      to="/artisan/dashboard"
                      className={`flex items-center p-2 pl-6 rounded-lg hover-item ${isActive("/artisan/dashboard") ? "active-item" : ""}`}
                      style={{ color: isActive("/artisan/dashboard") ? '#60a5fa' : '#fff', fontWeight: isActive("/artisan/dashboard") ? 600 : 500 }}
                    >
                      <MdDashboard className="text-xl mr-2" style={isActive("/artisan/dashboard") ? { color: '#60a5fa' } : {}} />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* Inventory */}
            <li className="px-4 py-2">
              <div
                className={`flex items-center justify-between cursor-pointer rounded-lg p-2 hover-item ${(isActive("/artisan/inventory") || isActive("/artisan/orders")) ? "active-item" : ""}`}
                style={{ color: (isActive("/artisan/inventory") || isActive("/artisan/orders")) ? '#60a5fa' : '#fff', fontWeight: (isActive("/artisan/inventory") || isActive("/artisan/orders")) ? 600 : 500 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOpen) {
                    toggleSidebar();
                    setTimeout(() => toggleSubmenu("inventory"), 200);
                  } else {
                    toggleSubmenu("inventory");
                  }
                }}
              >
                <div className="flex items-center">
                  {(isActive("/artisan/inventory") || isActive("/artisan/orders")) ? (
                    <MdInventory2 className="text-xl" style={{ color: '#60a5fa' }} />
                  ) : (
                    <MdInventory className="text-xl" />
                  )}
                  {isOpen && <span className="ml-3">My ArtisInventory</span>}
                </div>
                {isOpen && (
                  <span>
                    {expandedMenus.inventory ? <FaCaretUp /> : <FaCaretDown />}
                  </span>
                )}
              </div>
              {/* Inventory submenu */}
              {isOpen && expandedMenus.inventory && (
                <ul className="pl-4 mt-2">
                  <li>
                    <Link
                      to="/artisan/products"
                      className={`flex items-center p-2 pl-6 rounded-lg hover-item ${isActive("/artisan/products") ? "active-item" : ""}`}
                      style={{ color: isActive("/artisan/products") ? '#60a5fa' : '#fff', fontWeight: isActive("/artisan/products") ? 600 : 500 }}
                    >
                      <RiProductHuntLine className="mr-2" style={isActive("/artisan/products") ? { color: '#60a5fa' } : {}} />
                      <span>Product List</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/artisan/add-product"
                      className={`flex items-center p-2 pl-6 rounded-lg hover-item ${isActive("/artisan/add-product") ? "active-item" : ""}`}
                      style={{ color: isActive("/artisan/add-product") ? '#60a5fa' : '#fff', fontWeight: isActive("/artisan/add-product") ? 600 : 500 }}
                    >
                      <IoMdAdd className="mr-2" style={isActive("/artisan/add-product") ? { color: '#60a5fa' } : {}} />
                      <span>Add Product</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/artisan/manage-products"
                      className={`flex items-center p-2 pl-6 rounded-lg hover-item ${isActive("/artisan/manage-products") ? "active-item" : ""}`}
                      style={{ color: isActive("/artisan/manage-products") ? '#60a5fa' : '#fff', fontWeight: isActive("/artisan/manage-products") ? 600 : 500 }}
                    >
                      <BsFillGearFill className="mr-2" style={isActive("/artisan/manage-products") ? { color: '#60a5fa' } : {}} />
                      <span>Manage Products</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/artisan/orders"
                      className={`flex items-center p-2 pl-6 rounded-lg hover-item ${isActive("/artisan/orders") ? "active-item" : ""}`}
                      style={{ color: isActive("/artisan/orders") ? '#60a5fa' : '#fff', fontWeight: isActive("/artisan/orders") ? 600 : 500 }}
                    >
                      <MdShoppingBag className="mr-2" style={isActive("/artisan/orders") ? { color: '#60a5fa' } : {}} />
                      <span>My Orders</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* User Profile Dropdown */}
            <li className="px-4 py-2">
              <div
                className={`flex items-center justify-between cursor-pointer rounded-lg p-2 hover-item ${(isActive("/artisan/profile") || isActive("/artisan/users")) ? "active-item" : ""}`}
                style={{ color: (isActive("/artisan/profile") || isActive("/artisan/users")) ? '#60a5fa' : '#fff', fontWeight: (isActive("/artisan/profile") || isActive("/artisan/users")) ? 600 : 500 }}
                onClick={() => {
                  if (!isOpen) {
                    toggleSidebar();
                    setTimeout(() => toggleSubmenu("userProfile"), 200);
                  } else {
                    toggleSubmenu("userProfile");
                  }
                }}
              >
                <div className="flex items-center">
                  <FaUserCircle className="text-2xl" style={(isActive("/artisan/profile") || isActive("/artisan/users")) ? { color: '#60a5fa' } : {}} />
                  {isOpen && <span className="ml-3">User Profile</span>}
                </div>
                {isOpen && (
                  <span>
                    {expandedMenus.userProfile ? <FaCaretUp /> : <FaCaretDown />}
                  </span>
                )}
              </div>
              {/* User Profile submenu */}
              {isOpen && expandedMenus.userProfile && (
                <ul className="pl-4 mt-2">
                  <li>
                    <Link
                      to="/artisan/profile"
                      className={`flex items-center p-2 pl-6 rounded-lg hover-item ${isActive("/artisan/profile") ? "active-item" : ""}`}
                      style={{ color: isActive("/artisan/profile") ? '#60a5fa' : '#fff', fontWeight: isActive("/artisan/profile") ? 600 : 500 }}
                    >
                      <FaRegIdBadge className="mr-2" style={isActive("/artisan/profile") ? { color: '#60a5fa' } : {}} />
                      <span>Profile</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* About */}
            <li className="px-4 py-2">
              <Link
                to="/aboutartisan"
                className={`flex items-center rounded-lg p-2 hover-item ${isActive("/aboutartisan") ? "active-item" : ""}`}
                style={{ color: isActive("/aboutartisan") ? '#60a5fa' : '#fff', fontWeight: isActive("/aboutartisan") ? 600 : 500 }}
              >
                {isActive("/aboutartisan") ? (
                  <IoMdInformationCircle className="text-xl" style={{ color: '#60a5fa' }} />
                ) : (
                  <IoMdInformationCircleOutline className="text-xl" />
                )}
                {isOpen && <span className="ml-3">About</span>}
              </Link>
            </li>
          </ul>
        </nav>
        {/* Logout at the bottom */}
        <div className="mt-auto px-4 py-2">
          <div
            className="flex items-center cursor-pointer rounded-lg p-2 hover-item"
            style={{ color: '#fff', fontWeight: 500 }}
            onClick={() => setShowLogoutDialog(true)}
          >
            <FiLogOut className="text-xl" />
            {isOpen && <span className="ml-3">Logout</span>}
          </div>
        </div>
        {/* Logout confirmation dialog with buyer style */}
        {showLogoutDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
              <div className="text-lg font-bold mb-3 text-[#1b2a41] flex items-center gap-2" style={{ fontFamily: 'Source Code Pro, monospace' }}>
                <svg className="w-6 h-6 text-[#324a5f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0V7a3 3 0 016 0v1" /></svg>
                Confirm Logout
              </div>
              <div className="mb-5 text-[#1b2a41]" style={{ fontFamily: 'Source Code Pro, monospace' }}>Are you sure you want to log out of your account?</div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowLogoutDialog(false)} 
                  className="px-5 py-2 rounded-lg bg-[#ccc9dc] font-semibold shadow-sm transition cursor-pointer text-black" 
                  style={{ fontFamily: 'Source Code Pro, monospace' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout} 
                  className="px-5 py-2 rounded-lg !bg-[#660708] hover:!bg-red-700 text-white font-semibold shadow-sm transition cursor-pointer" 
                  style={{ fontFamily: 'Source Code Pro, monospace', boxShadow: 'none', outline: 'none', border: 'none' }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success logout notification */}
        {showLogoutSuccess && (
          <div className="fixed left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn" style={{ top: '80px' }}>
            <div className="bg-gradient-to-r from-[#5e503f] to-[#6d5c49] text-white px-6 py-3 rounded-2xl shadow-lg font-semibold border-b-2 border-[#3c2f27] flex items-center gap-3" style={{ fontFamily: 'Source Code Pro, monospace', letterSpacing: '0.5px' }}>
              <div className="bg-[#eaddcf] rounded-full p-1.5 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#5e503f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span>Successfully logged out!</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArtisanSidebar;

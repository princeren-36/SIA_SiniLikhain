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

  // Handle logout
  const handleLogout = () => {
    // Clear any auth tokens or user data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    // Redirect to home page
    window.location.href = "/";
  };

  // Check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>
        {`
          .hover-item:hover {
            background-color: #2a3c56 !important;
          }
          .active-item {
            background-color: #2a3c56 !important;
          }
        `}
      </style>
      <div
        className={`text-white h-screen transition-all duration-300 ease-in-out flex flex-col overflow-hidden fixed top-0 left-0 z-40`}
        style={{ width: isOpen ? 320 : 80, backgroundColor: '#1b2a41' }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-center">
        {isOpen ? (
          <h1 className="text-xl font-bold">SiniLikhain</h1>
        ) : (
          <span className="font-bold text-xl">SL</span>
        )}
      </div>

      <div className="border-t my-2" style={{ borderColor: '#3a4e6b' }}></div>

      {/* Menu items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {/* Home */}
          <li className="px-4 py-2">              <div
              className={`flex items-center justify-between cursor-pointer rounded-md p-2 hover-item ${
                isActive("/artisan") ? "active-item" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSubmenu("home");
              }}
            >
              <div className="flex items-center">
                {isActive("/artisan") ? (
                  <IoHomeSharp className="text-xl" />
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
                    className={`flex items-center p-2 pl-6 rounded-md hover-item ${
                      isActive("/artisan/dashboard") ? "active-item" : ""
                    }`}
                  >
                    <MdDashboard className="text-xl mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Inventory */}
          <li className="px-4 py-2">              <div
              className={`flex items-center justify-between cursor-pointer rounded-md p-2 hover-item ${
                isActive("/artisan/inventory") || isActive("/artisan/orders") ? "active-item" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSubmenu("inventory");
              }}
            >
              <div className="flex items-center">
                {isActive("/artisan/inventory") || isActive("/artisan/orders") ? (
                  <MdInventory2 className="text-xl" />
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
                    className={`flex items-center p-2 pl-6 rounded-md hover-item ${
                      isActive("/artisan/products") ? "active-item" : ""
                    }`}
                  >
                    <RiProductHuntLine className="mr-2" />
                    <span>Product List</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/artisan/add-product"
                    className={`flex items-center p-2 pl-6 rounded-md hover-item ${
                      isActive("/artisan/add-product") ? "active-item" : ""
                    }`}
                  >
                    <IoMdAdd className="mr-2" />
                    <span>Add Product</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/artisan/manage-products"
                    className={`flex items-center p-2 pl-6 rounded-md hover-item ${
                      isActive("/artisan/manage-products") ? "active-item" : ""
                    }`}
                  >
                    <BsFillGearFill className="mr-2" />
                    <span>Manage Products</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/artisan/orders"
                    className={`flex items-center p-2 pl-6 rounded-md hover-item ${
                      isActive("/artisan/orders") ? "active-item" : ""
                    }`}
                  >
                    <MdShoppingBag className="mr-2" />
                    <span>My Orders</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* User Profile Dropdown */}
          <li className="px-4 py-2">
            <div
              className={`flex items-center justify-between cursor-pointer rounded-md p-2 hover-item ${
                isActive("/artisan/profile") || isActive("/artisan/users") ? "active-item" : ""
              }`}
              onClick={() => toggleSubmenu("userProfile")}
            >
              <div className="flex items-center">
                <FaUserCircle className="text-2xl" />
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
                    className={`flex items-center p-2 pl-6 rounded-md hover-item ${
                      isActive("/artisan/profile") ? "active-item" : ""
                    }`}
                  >
                    <FaRegIdBadge className="mr-2" />
                    <span>Profile</span>
                  </Link>
                  {/* Remove the ArtisanProfile component to prevent double rendering */}
                </li>
              </ul>
            )}
          </li>

          {/* About */}
          <li className="px-4 py-2">
            <Link
              to="/aboutartisan"
              className={`flex items-center rounded-md p-2 hover-item ${
                isActive("/aboutartisan") ? "active-item" : ""
              }`}
            >
              {isActive("/aboutartisan") ? (
                <IoMdInformationCircle className="text-xl" />
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
          className="flex items-center cursor-pointer rounded-md p-2 hover-item"
          onClick={() => setShowLogoutDialog(true)}
        >
          <FiLogOut className="text-xl" />
          {isOpen && <span className="ml-3">Logout</span>}
        </div>
      </div>
      {/* Logout confirmation dialog with blur effect on sidebar */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40 dark:bg-gray-900/60 pointer-events-none"></div>
          <div className="relative z-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl p-6 min-w-[300px] pointer-events-auto">
            <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Confirm Logout</h2>
            <p className="mb-6 text-gray-800 dark:text-gray-200">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs border border-gray-300 dark:border-gray-600"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 text-xs border border-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ArtisanSidebar;

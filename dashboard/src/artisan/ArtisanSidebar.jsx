import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";
import { MdInventory, MdInventory2, MdDashboard } from "react-icons/md";
import { IoMdAdd, IoMdInformationCircle, IoMdInformationCircleOutline } from "react-icons/io";
import { RiProductHuntLine, RiProductHuntFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { BsFillGearFill, BsGear } from "react-icons/bs";



const ArtisanSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");
  const getInitialExpandedMenus = () => {
    const saved = sessionStorage.getItem('artisanSidebarExpandedMenus');
    if (saved) return JSON.parse(saved);
    return { home: false, inventory: false };
  };

  const [expandedMenus, setExpandedMenus] = useState(getInitialExpandedMenus);

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
                isActive("/artisan/inventory") ? "active-item" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSubmenu("inventory");
              }}
            >
              <div className="flex items-center">
                {isActive("/artisan/inventory") ? (
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
          onClick={handleLogout}
        >
          <FiLogOut className="text-xl" />
          {isOpen && <span className="ml-3">Logout</span>}
        </div>
      </div>
    </div>
    </>
  );
};

export default ArtisanSidebar;

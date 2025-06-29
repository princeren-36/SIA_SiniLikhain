import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaEnvelope, FaGlobe, FaPlus, FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

function NavbarArtisan({ showLinks = true, toggleSidebar }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [hovered, setHovered] = useState("");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  const handleLogoutClick = () => {
    if (!user) {
      navigate("/Login");
    } else {
      setOpenDialog(true);
    }
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setOpenDialog(false);
    setOpenSnackbar(true);
    setTimeout(() => {
      window.location.href = "/Login";
    }, 1000);
  };
  const handleCancelLogout = () => setOpenDialog(false);

  const navLinks = [
    { to: "/artisan", label: "Home" },
    { to: "/artisan/add-product", label: "Add Product" },
    { to: "/artisanprofile", label: "Profile" },
    { to: "/aboutartisan", label: "About" },
  ];

  const updateUnderline = (key) => {
    const el = navRefs.current[key];
    if (el) {
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentNode.getBoundingClientRect();
      setUnderlineStyle({
        left: rect.left - parentRect.left,
        width: rect.width,
        opacity: 1
      });
    }
  };

  const clearUnderline = () => {
    setUnderlineStyle(s => ({ ...s, opacity: 0 }));
  };

  const handleMouseEnter = (key) => {
    setHovered(key);
    updateUnderline(key);
  };
  const handleMouseLeave = () => {
    setHovered("");
    const activeKey = navLinks.find(l => location.pathname === l.to)?.to || (location.pathname === "/login" ? "logout" : "");
    if (activeKey) updateUnderline(activeKey); else clearUnderline();
  };

  React.useEffect(() => {
    const activeKey = navLinks.find(l => location.pathname === l.to)?.to || (location.pathname === "/login" ? "logout" : "");
    if (activeKey) updateUnderline(activeKey); else clearUnderline();
  }, [location.pathname]);

  const getProfileImage = () => {
    if (user?.profileImage && user.profileImage.trim() !== "") {
      return user.profileImage;
    }
    // Try to use a gender-neutral or generated avatar based on username
    if (user?.username) {
      // Use a free avatar API (e.g., DiceBear)
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}`;
    }
    // Fallback
    return "https://api.dicebear.com/7.x/initials/svg?seed=User";
  };

  React.useEffect(() => {
    // Add blur to body when logout dialog is open
    if (openDialog) {
      document.body.classList.add('blur-logout-overlay');
    } else {
      document.body.classList.remove('blur-logout-overlay');
    }
    // Clean up on unmount
    return () => {
      document.body.classList.remove('blur-logout-overlay');
    };
  }, [openDialog]);

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-black border-b border-gray-800 shadow-sm sticky top-0 left-0 right-0 z-30" style={{position:'sticky'}}>
      {/* Sidebar toggle button */}
      <div className="flex items-center">
        <button 
          onClick={() => toggleSidebar && toggleSidebar()} 
          className="p-2 rounded-md text-white hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <FaBars size={18} />
        </button>
      </div>
      <div className="flex items-center gap-3 relative">
        <div className="flex flex-col items-end mr-2">
          <span className="font-semibold text-white text-sm">{user?.username || "User Name"}</span>
          <span className="text-xs text-gray-300">{user?.role === 'admin' ? 'Admin User' : 'Artisan'}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-black shadow overflow-hidden">
          <img
            src={getProfileImage()}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <button className="ml-1" onClick={() => setDropdownOpen((prev) => !prev)}>
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[150px] z-50">
            <button
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 text-xs"
              onClick={() => { setDropdownOpen(false); navigate('/artisan/profile'); }}
            >
              <FaUserCircle className="text-purple-600 text-sm" /> profile
            </button>
            <button
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 text-xs"
              onClick={() => { setDropdownOpen(false); setOpenDialog(true); }}
            >
              <FiLogOut className="text-red-500 text-sm" /> log out
            </button>
          </div>
        )}
      </div>

      {/* Logout confirmation dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40 dark:bg-gray-900/60 pointer-events-none"></div>
          <div className="relative z-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl p-6 min-w-[300px] pointer-events-auto">
            <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Confirm Logout</h2>
            <p className="mb-6 text-gray-800 dark:text-gray-200">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs border border-gray-300 dark:border-gray-600"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 text-xs border border-red-700 dark:border-red-800"
                onClick={handleConfirmLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarArtisan;


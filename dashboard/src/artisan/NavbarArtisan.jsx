import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

function NavbarArtisan({ showLinks = true, toggleSidebar }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [hovered, setHovered] = useState("");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });
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
  
  // State to track profile updates
  const [profileUpdated, setProfileUpdated] = React.useState(0);
  
  // Listen for profile updates from ArtisanProfile component
  React.useEffect(() => {
    const handleProfileUpdate = () => {
      // Force a refresh of the user data from storage
      const updatedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
      if (updatedUser) {
        // Update the local user state to trigger UI refresh
        setProfileUpdated(prev => prev + 1);
      }
    };
    
    // Listen for custom profile update event
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Helper to get full avatar/profile image URL
  const getFullProfileImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    // Remove leading slash if present
    const cleanPath = img.replace(/^\\|\//, '');
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${cleanPath}`;
  };

  const getProfileImage = () => {
    // Re-get user data on each render to ensure it's fresh
    const currentUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    if (currentUser?.profileImage && currentUser.profileImage.trim() !== "") {
      return getFullProfileImageUrl(currentUser.profileImage);
    }
    if (currentUser?.avatar && currentUser.avatar.trim() !== "") {
      return getFullProfileImageUrl(currentUser.avatar);
    }
    if (currentUser?.username) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.username)}`;
    }
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
          className="p-2 rounded-md text-[#1b2a41] hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <FaBars size={18} color="#1b2a41" />
        </button>
      </div>
      <div className="flex items-center gap-3 relative">
        <div className="flex flex-col items-end mr-2">
          {/* Use latest user data from storage */}
          <span className="font-semibold text-[#1b2a41] text-sm">
            {(() => {
              // Force rerender when profileUpdated changes
              const currentUser = profileUpdated !== undefined ? 
                JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}") : 
                user;
              // Prefer name, fallback to username
              return currentUser?.name || currentUser?.username || "User Name";
            })()}
          </span>
          <span className="text-xs text-gray-500">{user?.role === 'admin' ? 'Admin User' : 'Artisan'}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-black shadow overflow-hidden">
          <img
            src={getProfileImage()}
            alt="profile"
            className="w-full h-full object-cover"
            key={`profile-img-${profileUpdated}`} /* Force re-render of image when profile updates */
          />
        </div>
      </div>

      {/* Logout confirmation dialog */}
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
            <div className="text-lg font-bold mb-3 text-[#1b2a41] flex items-center gap-2" style={{ fontFamily: 'Source Code Pro, monospace' }}>
              <svg className="w-6 h-6 text-[#324a5f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0V7a3 3 0 016 0v1" /></svg>
              Confirm Logout
            </div>
            <div className="mb-5 text-[#1b2a41]" style={{ fontFamily: 'Source Code Pro, monospace' }}>Are you sure you want to log out of your account?</div>
            <div className="flex justify-end gap-3">
              <button onClick={handleCancelLogout} className="px-5 py-2 rounded-lg bg-[#ccc9dc] font-semibold shadow-sm transition cursor-pointer" style={{ fontFamily: 'Source Code Pro, monospace' }}>Cancel</button>
              <button onClick={handleConfirmLogout} className="px-5 py-2 rounded-lg !bg-[#660708] hover:!bg-red-700 text-white font-semibold shadow-sm transition cursor-pointer" style={{ fontFamily: 'Source Code Pro, monospace', boxShadow: 'none', outline: 'none', border: 'none' }}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarArtisan;


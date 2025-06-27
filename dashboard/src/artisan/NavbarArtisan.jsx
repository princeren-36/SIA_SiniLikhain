import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaEnvelope, FaGlobe, FaPlus } from "react-icons/fa";
import SidebarArtisan from "./SidebarArtisan";

function NavbarArtisan({ showLinks = true }) {
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
    { to: "/AddProduct", label: "My Products" },
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

  return (
    <nav className="flex items-center justify-end px-6 py-2 bg-black border-b border-gray-800 shadow-sm sticky top-0 left-0 right-0 z-30" style={{position:'sticky'}}>
      <div className="flex items-center gap-3">
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
        <button className="ml-1">
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
    </nav>
  );
}

export default NavbarArtisan;


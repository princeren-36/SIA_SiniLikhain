import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Add useLayoutEffect to ensure responsive viewport settings
function Navbar({ showLinks = true, onLogoutDialogState }) {
  // Add useLayoutEffect to set viewport meta for proper mobile scaling
  React.useLayoutEffect(() => {
    // Check if viewport meta tag exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      // Create viewport meta tag if it doesn't exist
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    // Set proper viewport settings for responsive design
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    return () => {
      // Optional cleanup if needed
    };
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [hovered, setHovered] = useState("");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  const handleLogoutClick = () => {
    if (!user) {
      navigate("/Login");
    } else {
      setOpenDialog(true);
      if (onLogoutDialogState) onLogoutDialogState(true);
    }
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setOpenDialog(false);
    if (onLogoutDialogState) onLogoutDialogState(false);
    setOpenSnackbar(true);
    setTimeout(() => {
      window.location.href = "/Login";
    }, 1000);
  };
  const handleCancelLogout = () => {
    setOpenDialog(false);
    if (onLogoutDialogState) onLogoutDialogState(false);
  };

  // Modify the navLinks array to include responsive styling
  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/buyer", label: "Products" },
    { to: "/aboutbuyer", label: "About" },
    { to: "/buyerprofile", label: "Profile" },
    { to: "/cart", label: (
      <span className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center" style={{fontSize:'0.7rem',lineHeight:'1rem',background:'#5e503f'}}>
            {cartCount}
          </span>
        )}
      </span>
    ), isIcon: true },
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

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    // Listen for custom event from Buyer.jsx
    window.addEventListener("cart-updated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  React.useEffect(() => {
    const activeKey = navLinks.find(l => location.pathname === l.to)?.to || (location.pathname === "/login" ? "logout" : "");
    if (activeKey) updateUnderline(activeKey); else clearUnderline();
  }, [location.pathname]);

  // Add media query handling for responsive design
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close mobile menu when switching to desktop
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] bg-black backdrop-blur-md" style={{position:'fixed', width:'100%', zIndex:100}}>
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 py-2 md:py-3 gap-3 md:gap-5">
          <div className="select-none text-[#ccc9dc] font-bold tracking-widest text-xl sm:text-2xl flex items-center gap-2 sm:gap-4" style={{ fontFamily: 'Source Code Pro, monospace' }}>
            <Link to="/home" className="focus:outline-none focus:ring-2 focus:ring-[#5e503f] rounded">
              SiniLikhain
            </Link>
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden p-1.5 sm:p-2 group flex items-center justify-center" aria-label="Open menu" onClick={() => setMobileMenuOpen(v => !v)}>
            <span className={`relative block w-5 sm:w-6 h-5 sm:h-6 transition-transform duration-300 ${mobileMenuOpen ? 'scale-110 opacity-80' : 'scale-100 opacity-100'}`}>
              {/* Top bar */}
              <span
                className={`absolute left-0 top-1 w-5 sm:w-6 h-0.5 sm:h-1 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 top-2 sm:top-3' : ''} bg-white`}
              ></span>
              {/* Middle bar */}
              <span
                className={`absolute left-0 top-2 sm:top-3 w-5 sm:w-6 h-0.5 sm:h-1 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''} bg-white`}
              ></span>
              {/* Bottom bar */}
              <span
                className={`absolute left-0 top-3 sm:top-5 w-5 sm:w-6 h-0.5 sm:h-1 rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 top-2 sm:top-3' : ''} bg-white`}
              ></span>
            </span>
          </button>
          {/* Desktop links */}
          {showLinks && (
            <div className="hidden md:flex gap-1 lg:gap-2 items-center relative" onMouseLeave={handleMouseLeave}>
              {/* Home link */}
              <Link
                key={navLinks[0].to}
                to={navLinks[0].to}
                ref={el => navRefs.current[navLinks[0].to] = el}
                className={
                  `px-2 lg:px-4 py-1 transition-colors duration-150 relative z-10 flex items-center justify-center text-sm lg:text-base ` +
                  (location.pathname === navLinks[0].to ? "text-white" : "text-[#ccc9dc]")
                }
                style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500 }}
                onMouseEnter={() => handleMouseEnter(navLinks[0].to)}
                aria-label={typeof navLinks[0].label === 'string' ? navLinks[0].label : 'Home'}
              >
                {navLinks[0].label}
              </Link>
              {/* Render the rest of the nav links */}
              {navLinks.slice(1).map(link => {
                // Always show Profile link, we'll handle authentication in click handler
                if (link.to === "/buyerprofile") {
                  return (
                    <Link
                      key={link.to}
                      to={user ? link.to : "#"} // Only navigate if logged in
                      ref={el => navRefs.current[link.to] = el}
                      onClick={(e) => {
                        if (!user) {
                          e.preventDefault();
                          setOpenProfileDialog && setOpenProfileDialog(true);
                        }
                      }}
                      className={
                        `px-4 py-1 transition-colors duration-150 relative z-10 flex items-center justify-center ` +
                        (location.pathname === link.to ? "text-white" : "text-[#ccc9dc]")
                      }
                      style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500 }}
                      onMouseEnter={() => handleMouseEnter(link.to)}
                      aria-label={typeof link.label === 'string' ? link.label : 'Profile'}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    ref={el => navRefs.current[link.to] = el}
                    className={
                      `px-4 py-1 transition-colors duration-150 relative z-10 flex items-center justify-center ` +
                      (location.pathname === link.to ? "text-white" : "text-[#ccc9dc]")
                    }
                    style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500 }}
                    onMouseEnter={() => handleMouseEnter(link.to)}
                    aria-label={typeof link.label === 'string' ? link.label : 'Cart'}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {/* Username after cart, before logout */}
              {user && user.role === 'buyer' && (
                <span className="text-xs sm:text-sm md:text-base font-semibold text-[#fff] px-2 md:px-3 py-1 rounded-lg truncate max-w-[100px] md:max-w-[120px] lg:max-w-none" style={{fontFamily:'Source Code Pro, monospace', letterSpacing:1, background: '#5e503f'}}>
                  {user.username}
                </span>
              )}
              <button
                ref={el => navRefs.current.logout = el}
                onClick={handleLogoutClick}
                className={`px-2 lg:px-4 py-1 font-semibold text-sm lg:text-base transition-colors duration-150 relative z-10 ` +
                  (location.pathname === "/login" ? "text-white bg-black" : "text-[#ccc9dc]")
                }
                style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 600, background: location.pathname === "/login" ? '#000' : 'transparent', color: location.pathname === "/login" ? '#fff' : '#ccc9dc' }}
                onMouseEnter={() => handleMouseEnter("logout")}
              >
                {user ? "Logout" : "Login"}
              </button>
              {/* Underline bar */}
              <span
                className="absolute bottom-[-8px] h-[3px] transition-all duration-200"
                style={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                  opacity: underlineStyle.opacity,
                  pointerEvents: 'none',
                  background: '#5e503f',
                }}
              />
            </div>
          )}
        </div>
        {/* Mobile menu */}
        {showLinks && mobileMenuOpen && (
          <div className="flex flex-col gap-2 px-3 pb-4 md:hidden bg-black animate-fadeIn border-t border-gray-800">
            {navLinks.map(link => {
              // Always show Profile in mobile menu too
              if (link.to === "/buyerprofile") {
                return (
                  <Link
                    key={link.to}
                    to={user ? link.to : "#"}
                    className={`py-2 px-3 rounded text-base sm:text-lg font-semibold ${location.pathname === link.to ? 'bg-[#5e503f] text-white' : 'text-[#ccc9dc]'}`}
                    style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500 }}
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setOpenProfileDialog && setOpenProfileDialog(true);
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-2 px-3 rounded text-base sm:text-lg font-semibold ${location.pathname === link.to ? 'bg-[#5e503f] text-white' : 'text-[#ccc9dc]'}`}
                  style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            {user && user.role === 'buyer' && (
              <span className="text-sm sm:text-base font-semibold text-[#fff] px-3 py-2 rounded-lg bg-[#5e503f] mt-1 truncate" style={{fontFamily:'Source Code Pro, monospace', letterSpacing:1}}>
                {user.username}
              </span>
            )}
            <button
              onClick={handleLogoutClick}
              className={`py-2 px-3 rounded text-base sm:text-lg font-semibold ${location.pathname === "/login" ? 'bg-black text-white' : 'text-[#ccc9dc]'}`}
              style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 600, background: location.pathname === "/login" ? '#000' : 'transparent', color: location.pathname === "/login" ? '#fff' : '#ccc9dc' }}
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        )}
      </nav>

      {/* Logout Dialog */}
      {openDialog && user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-xs sm:w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
            <div className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-[#1b2a41] flex items-center gap-2" style={{ fontFamily: 'Source Code Pro, monospace' }}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#324a5f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0V7a3 3 0 016 0v1" /></svg>
              Confirm Logout
            </div>
            <div className="mb-4 sm:mb-5 text-sm sm:text-base text-[#1b2a41]" style={{ fontFamily: 'Source Code Pro, monospace' }}>Are you sure you want to log out of your account?</div>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button onClick={handleCancelLogout} className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-[#ccc9dc] font-semibold shadow-sm transition cursor-pointer text-sm sm:text-base" style={{ fontFamily: 'Source Code Pro, monospace' }}>Cancel</button>
              <button onClick={handleConfirmLogout} className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg !bg-[#660708] hover:!bg-red-700 text-white font-semibold shadow-sm transition cursor-pointer text-sm sm:text-base" style={{ fontFamily: 'Source Code Pro, monospace', boxShadow: 'none', outline: 'none', border: 'none' }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {openSnackbar && (
        <div className="fixed left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn px-4 w-full sm:w-auto" style={{ top: '80px' }}>
          <div className="bg-gradient-to-r from-[#5e503f] to-[#6d5c49] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg font-semibold border-b-2 border-[#3c2f27] flex items-center gap-2 sm:gap-3 max-w-[280px] sm:max-w-none mx-auto" style={{ fontFamily: 'Source Code Pro, monospace', letterSpacing: '0.5px' }}>
            <div className="bg-[#eaddcf] rounded-full p-1 sm:p-1.5 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#5e503f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-sm sm:text-base">Successfully logged out!</span>
          </div>
        </div>
      )}
      
      {/* Profile Login Required Dialog */}
      {openProfileDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-xs sm:w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
            <div className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-[#1b2a41]">Login Required</div>
            <div className="mb-4 sm:mb-5 text-sm sm:text-base text-[#1b2a41]">You must be logged in to view your profile. Do you want to log in now?</div>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button 
                onClick={() => setOpenProfileDialog(false)} 
                className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-[#ccc9dc] font-semibold shadow-sm transition cursor-pointer text-sm sm:text-base" 
                style={{ fontFamily: 'Source Code Pro, monospace' }}
              >
                No
              </button>
              <button 
                onClick={() => { 
                  setOpenProfileDialog(false); 
                  navigate('/Login'); 
                }} 
                className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg !bg-[#660708] hover:!bg-red-700 text-white font-semibold shadow-sm transition cursor-pointer text-sm sm:text-base" 
                style={{ fontFamily: 'Source Code Pro, monospace', boxShadow: 'none', outline: 'none', border: 'none' }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ showLinks = true }) {
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
    { to: "/home", label: "Home" },
    { to: "/buyer", label: "Products" },
    { to: "/cart", label: "Cart" },
    { to: "/aboutbuyer", label: "About" },
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

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-3 shadow-none gap-5 fixed top-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-md" style={{position:'relative'}}>
        <div className="select-none text-[#ccc9dc] font-bold tracking-widest font-poppins text-2xl">SiniLikhain</div>
        {showLinks && (
          <div className="flex gap-2 items-center relative" onMouseLeave={handleMouseLeave}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                ref={el => navRefs.current[link.to] = el}
                className={
                  `px-4 py-1 font-poppins font-medium transition-colors duration-150 relative z-10 ` +
                  (location.pathname === link.to ? "text-white" : "text-[#ccc9dc]")
                }
                onMouseEnter={() => handleMouseEnter(link.to)}
              >
                {link.label}
              </Link>
            ))}
            <button
              ref={el => navRefs.current.logout = el}
              onClick={handleLogoutClick}
              className={`px-4 py-1 font-poppins font-semibold transition-colors duration-150 relative z-10 ` +
                (location.pathname === "/login" ? "text-white" : "text-[#ccc9dc]")
              }
              onMouseEnter={() => handleMouseEnter("logout")}
              style={{fontWeight:600}}
            >
              {user ? "Logout" : "Login"}
            </button>
            {/* Underline bar */}
            <span
              className="absolute bottom-[-8px] h-[3px] bg-[#d2a47d] transition-all duration-200"
              style={{
                left: underlineStyle.left,
                width: underlineStyle.width,
                opacity: underlineStyle.opacity,
                pointerEvents: 'none',
              }}
            />
          </div>
        )}
      </nav>

      {/* Logout Dialog */}
      {openDialog && user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
            <div className="text-lg font-bold mb-3 text-[#1b2a41] font-poppins flex items-center gap-2">
              <svg className="w-6 h-6 text-[#324a5f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0V7a3 3 0 016 0v1" /></svg>
              Confirm Logout
            </div>
            <div className="mb-5 text-[#1b2a41] font-poppins">Are you sure you want to log out of your account?</div>
            <div className="flex justify-end gap-3">
              <button onClick={handleCancelLogout} className="px-5 py-2 rounded-lg bg-[#ccc9dc] hover:bg-[#324a5f] hover:text-white text-[#1b2a41] font-poppins font-semibold shadow-sm transition">Cancel</button>
              <button onClick={handleConfirmLogout} className="px-5 py-2 rounded-lg bg-red-400 hover:bg-red-500 text-white font-poppins font-semibold shadow-sm transition">Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {openSnackbar && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-[#324a5f] text-white px-8 py-3 rounded-xl shadow font-poppins font-semibold border-l-4 border-[#1b2a41] flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Successfully logged out!
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

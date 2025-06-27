import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SidebarArtisan() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const navRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  const navLinks = [
    { to: "/artisan", label: "Home" },
    { to: "/artisanprofile", label: "Dashboard" },
    { to: "/AddProduct", label: "My Products" },
    { to: "/aboutartisan", label: "About" },
  ];

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

  return (
    <>
      <aside className="fixed top-0 left-0 h-full w-56 bg-black flex flex-col items-stretch py-8 px-4 z-40 shadow-lg">
        <div className="mb-8 select-none text-[#ccc9dc] font-bold tracking-widest text-2xl text-center" style={{ fontFamily: 'Source Code Pro, monospace' }}>SiniLikhain</div>
        <nav className="flex flex-col gap-2 flex-1">
          <Link
            to="/artisan"
            ref={el => navRefs.current["/artisan"] = el}
            className={`px-4 py-2 rounded-lg transition-colors duration-150 relative z-10 outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 ${location.pathname === "/artisan" ? "bg-[#5e503f] text-white" : "text-[#ccc9dc]"} hover:bg-[#5e503f] hover:text-white focus:text-white active:text-white`}
            style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500, boxShadow: 'none', outline: 'none' }}
            onClick={() => setDashboardOpen(true)}
          >
            Home
            <span className="float-right ml-2">{dashboardOpen ? '▲' : '▼'}</span>
          </Link>
          {/* Dashboard dropdown */}
          {dashboardOpen && (
            <div className="ml-4 flex flex-col gap-1">
              <Link
                to="/artisanprofile"
                ref={el => navRefs.current["/artisanprofile"] = el}
                className={`px-4 py-2 rounded-lg transition-colors duration-150 relative z-10 outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 ${location.pathname === "/artisanprofile" ? "bg-[#5e503f] text-white" : "text-[#ccc9dc]"} hover:bg-[#5e503f] hover:text-white focus:text-white active:text-white`}
                style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500, boxShadow: 'none', outline: 'none' }}
                onClick={() => setDashboardOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          )}
          <Link
            to="/AddProduct"
            ref={el => navRefs.current["/AddProduct"] = el}
            className={`px-4 py-2 rounded-lg transition-colors duration-150 relative z-10 outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 ${location.pathname === "/AddProduct" ? "bg-[#5e503f] text-white" : "text-[#ccc9dc]"} hover:bg-[#5e503f] hover:text-white focus:text-white active:text-white`}
            style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500, boxShadow: 'none', outline: 'none' }}
          >
            My Products
          </Link>
          <Link
            to="/aboutartisan"
            ref={el => navRefs.current["/aboutartisan"] = el}
            className={`px-4 py-2 rounded-lg transition-colors duration-150 relative z-10 outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 ${location.pathname === "/aboutartisan" ? "bg-[#5e503f] text-white" : "text-[#ccc9dc]"} hover:bg-[#5e503f] hover:text-white focus:text-white active:text-white`}
            style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 500, boxShadow: 'none', outline: 'none' }}
          >
            About
          </Link>
        </nav>
        {user && user.role === 'artisan' && (
          <span className="text-base font-semibold text-[#fff] px-3 py-1 rounded-lg mt-4 mb-2 text-center" style={{fontFamily:'Source Code Pro, monospace', letterSpacing:1, background: '#5e503f'}}>
            {user.username}
          </span>
        )}
        <button
          ref={el => navRefs.current.logout = el}
          onClick={handleLogoutClick}
          className={`mt-2 px-4 py-2 font-semibold transition-colors duration-150 !bg-black text-white rounded-lg shadow focus:text-white active:text-white outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0`}
          style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 600, backgroundColor: '#000', boxShadow: 'none', outline: 'none' }}
        >
          {user ? "Logout" : "Login"}
        </button>
      </aside>

      {/* Logout Dialog */}
      {openDialog && user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-80 border-t-4 border-[#1b2a41] animate-fadeIn">
            <div className="text-lg font-bold mb-3 text-[#1b2a41] flex items-center gap-2" style={{ fontFamily: 'Source Code Pro, monospace' }}>
              <svg className="w-6 h-6 text-[#324a5f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0V7a3 3 0 016 0v1" /></svg>
              Confirm Logout
            </div>
            <div className="mb-5 text-[#1b2a41]" style={{ fontFamily: 'Source Code Pro, monospace' }}>Are you sure you want to log out of your account?</div>
            <div className="flex justify-end gap-3">
             <button onClick={handleCancelLogout} className="px-5 py-2 rounded-lg bg-[#ccc9dc] font-semibold shadow-sm transition cursor-pointer" style={{ fontFamily: 'Source Code Pro, monospace' }}>Cancel</button>
              <button onClick={handleConfirmLogout} className="px-5 py-2 rounded-lg !bg-[#660708] hover:!bg-red-700 text-white font-semibold shadow-sm transition cursor-pointer" style={{ fontFamily: 'Source Code Pro, monospace', boxShadow: 'none', outline: 'none', border: 'none', background: '#660708' }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {openSnackbar && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-[#324a5f] text-white px-8 py-3 rounded-xl shadow font-semibold border-l-4 border-[#1b2a41] flex items-center gap-2" style={{ fontFamily: 'Source Code Pro, monospace' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Successfully logged out!
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarArtisan;

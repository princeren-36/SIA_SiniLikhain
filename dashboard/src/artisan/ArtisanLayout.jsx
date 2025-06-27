import React from "react";
import ArtisanSidebar from "./ArtisanSidebar";
import Navbar from "./NavbarArtisan";

const SIDEBAR_WIDTH_OPEN = 320;
const SIDEBAR_WIDTH_CLOSED = 80;

const ArtisanLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex bg-black">
      <ArtisanSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="flex-1 flex flex-col relative z-10 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="relative z-10 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ArtisanLayout;

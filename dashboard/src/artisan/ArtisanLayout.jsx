import React, { useState } from "react";
import ArtisanSidebar from "./ArtisanSidebar";
import NavbarArtisan from "./NavbarArtisan";

const SIDEBAR_WIDTH = 320; // 20rem
const SIDEBAR_COLLAPSED = 80; // 5rem

const ArtisanLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-black">
      <ArtisanSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="flex flex-col relative z-10"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED,
          transition: "margin-left 0.3s",
        }}
      >
        <NavbarArtisan toggleSidebar={toggleSidebar} />
        <main className="relative z-10 flex flex-1 flex-col px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ArtisanLayout;

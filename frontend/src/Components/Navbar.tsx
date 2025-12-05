import React, { useState, useEffect } from "react";

interface NavbarProps {
  activeDropdown: string | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  dropdownMenus: {
    profil: string[];
    layanan: string[];
    publikasi: string[];
  };
  onMenuClick: (menu: string, item: string) => void;
}

// Label khusus untuk judul di dalam dropdown
const dropdownHeaders: { [key: string]: string } = {
  layanan: "Layanan Informasi",
};

// Label khusus untuk tombol menu utama
const menuLabels: { [key: string]: string } = {
  profil: "Profil",
  layanan: "Layanan",
  publikasi: "Publikasi",
};

const Navbar: React.FC<NavbarProps> = ({
  activeDropdown,
  setActiveDropdown,
  dropdownMenus,
  onMenuClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderOverlayDropdown = () => {
    if (!activeDropdown) return null;
    const items = dropdownMenus[activeDropdown as keyof typeof dropdownMenus];

    return (
      <div className="absolute top-full left-0 w-full bg-white shadow-lg z-40 py-6 px-8 animate-slide-down">
        <div className="max-w-7xl mx-auto relative">
          {/* Tombol close */}
          <button
            onClick={() => setActiveDropdown(null)}
            className="absolute top-0 right-0 text-2xl text-gray-600 hover:text-red-500 transition"
          >
            ✖
          </button>

          {/* Judul dropdown */}
          <h3 className="text-2xl font-bold mb-4 text-blue-500 border-b-2 border-blue-300 pb-2">
            {dropdownHeaders[activeDropdown] || menuLabels[activeDropdown] || activeDropdown}
          </h3>

          {/* Isi menu dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveDropdown(null);
                  onMenuClick(activeDropdown, item);
                }}
                className="block text-left w-full px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md transition font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-blue-500 shadow-md h-16" : "bg-transparent backdrop-blur-md h-20"
      } hover:bg-blue-500`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between relative">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2 text-xl font-bold text-white hover:opacity-80 transition">
          <img src="public/images/Logo Disdikbud Palu.png" alt="Logo Dinas Pendidikan" className="h-12 w-auto" />
          <span>Dinas Pendidikan</span>
        </a>

        {/* Menu utama */}
        <div className="space-x-6 flex items-center">
          <button
            onClick={() => onMenuClick("beranda", "Beranda")}
            className="relative px-4 py-2 text-white transition hover:text-blue-100 hover:ring-2 hover:ring-blue-300 hover:shadow-lg hover:rounded-md"
          >
            Beranda
          </button>

          {/* Dropdown trigger buttons */}
          {Object.keys(dropdownMenus).map((menuKey) => (
            <button
              key={menuKey}
              onClick={() =>
                setActiveDropdown(activeDropdown === menuKey ? null : menuKey)
              }
              className="relative px-4 py-2 text-white transition hover:text-blue-100 hover:ring-2 hover:ring-blue-300 hover:shadow-lg hover:rounded-md"
            >
              {menuLabels[menuKey] || menuKey}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown full overlay */}
      {renderOverlayDropdown()}
    </nav>
  );
};

export default Navbar;

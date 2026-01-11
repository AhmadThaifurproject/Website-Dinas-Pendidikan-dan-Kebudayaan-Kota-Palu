import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Home,
  Menu, // Icon Hamburger
  // Icon Item
  BookOpen, Building2, Users, FileText, Globe, MessageSquare, GraduationCap, Briefcase, Landmark, X,
  // Icon Kategori
  Layers, School
} from "lucide-react";

// --- SHADCN IMPORTS ---
// Pastikan path ini benar sesuai struktur foldermu yang baru (huruf kecil 'components')
import { Button } from "@/components/Ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/Ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Ui/accordion";
import { ScrollArea } from "@/components/Ui/scroll-area";
import { Separator } from "@/components/Ui/separator";

// Tipe data
type MenuItems = string[] | { [category: string]: string[] };

interface NavbarProps {
  activeDropdown: string | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  dropdownMenus: { [key: string]: MenuItems };
  onMenuClick: (menu: string, item: string) => void;
}

// 1. HELPER ICON: Item Menu
const getIconForItem = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("paud") || lower.includes("sd") || lower.includes("smp")) return <GraduationCap size={18} />;
  if (lower.includes("sekretariat") || lower.includes("umum") || lower.includes("perencanaan")) return <Briefcase size={18} />;
  if (lower.includes("aset") || lower.includes("keuangan")) return <Building2 size={18} />;
  if (lower.includes("gtk") || lower.includes("ketenagaan")) return <Users size={18} />;
  if (lower.includes("kebudayaan")) return <Landmark size={18} />;
  if (lower.includes("pengaduan")) return <MessageSquare size={18} />;
  if (lower.includes("visi") || lower.includes("sejarah")) return <BookOpen size={18} />;
  if (lower.includes("berita")) return <Globe size={18} />;
  return <FileText size={18} />;
};

// 2. HELPER ICON: Kategori
const getIconForCategory = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes("akademik")) return <School size={16} />;
  if (lower.includes("birokrasi") || lower.includes("sdm")) return <Building2 size={16} />;
  if (lower.includes("publik") || lower.includes("budaya")) return <Users size={16} />;
  return <Layers size={16} />;
};

// Deskripsi
const menuDescriptions: { [key: string]: string } = {
  profil: "Mengenal identitas resmi, visi misi, dan struktur organisasi.",
  layanan: "Pilih kategori layanan di bawah ini untuk melihat detail.",
  publikasi: "Pusat informasi publik, berita, dan dokumen resmi.",
};

const Navbar: React.FC<NavbarProps> = ({
  activeDropdown,
  setActiveDropdown,
  dropdownMenus,
  onMenuClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk Sheet Mobile

  // Efek Scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efek Reset Stabil
  useEffect(() => {
    if (activeDropdown) {
      const currentMenu = dropdownMenus[activeDropdown];
      if (currentMenu && !Array.isArray(currentMenu)) {
        const keys = Object.keys(currentMenu);
        if (keys.length > 0) {
          setActiveSubCategory(keys[0]);
        }
      }
    } else {
      setActiveSubCategory(null);
    }
  }, [activeDropdown, dropdownMenus]);

  // --- Render Item Desktop ---
  const renderMenuItem = (item: string, index: number) => (
    <button
      key={index}
      onClick={() => {
        setActiveDropdown(null);
        onMenuClick(activeDropdown!, item);
      }}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-all w-full text-left border border-transparent hover:border-indigo-100 animate-in fade-in slide-in-from-right-4 duration-300 fill-mode-both"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
        {getIconForItem(item)}
      </div>
      <div>
        <span className="block text-sm font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors">
          {item}
        </span>
        <span className="text-[11px] text-gray-500 line-clamp-1 group-hover:text-indigo-500/80">
          Akses informasi terkait
        </span>
      </div>
    </button>
  );

  // --- MEGA MENU DESKTOP ---
  const renderMegaMenu = () => {
    if (!activeDropdown) return null;
    const items = dropdownMenus[activeDropdown];
    const title = activeDropdown.charAt(0).toUpperCase() + activeDropdown.slice(1);
    const isCategorized = !Array.isArray(items);

    return (
      <div
        className="absolute top-full left-0 w-full pt-4 z-40 animate-in fade-in slide-in-from-top-2 duration-300 hidden lg:block" 
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="mx-auto w-[95%] max-w-7xl bg-white rounded-2xl shadow-2xl shadow-indigo-900/20 ring-1 ring-black/5 overflow-hidden flex flex-col md:flex-row min-h-[350px]">
          {/* SIDEBAR KATEGORI (KIRI) */}
          <div className="md:w-1/4 bg-gradient-to-b from-indigo-800 to-indigo-950 p-6 text-white relative flex flex-col gap-6">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <div className="w-8 h-1 bg-yellow-400 rounded-full mb-3"></div>
              <p className="text-indigo-200 text-xs leading-relaxed">
                {menuDescriptions[activeDropdown]}
              </p>
            </div>

            {isCategorized && (
              <div className="flex flex-col gap-2 relative z-10 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">
                  Kategori Pilihan
                </span>
                {Object.keys(items).map((catKey) => {
                  const isActive = activeSubCategory === catKey;
                  return (
                    <button
                      key={catKey}
                      onClick={() => setActiveSubCategory(catKey)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 text-left w-full cursor-pointer
                        ${isActive
                          ? "bg-white/10 text-white shadow-lg border-l-4 border-yellow-400 pl-3"
                          : "text-indigo-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                        }`}
                    >
                      {getIconForCategory(catKey)}
                      {catKey}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none"></div>
          </div>

          {/* KONTEN MENU (KANAN) */}
          <div className="md:w-3/4 p-8 bg-white flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
               <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 {isCategorized && activeSubCategory ? (
                   <>
                    <span className="text-indigo-500">{getIconForCategory(activeSubCategory)}</span>
                    {activeSubCategory}
                   </>
                 ) : (
                   <>Semua Menu {title}</>
                 )}
               </h4>
               <button onClick={() => setActiveDropdown(null)} className="text-gray-400 hover:text-red-500 lg:hidden">
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[50vh] md:max-h-none pr-2">
              {isCategorized ? (
                <div key={activeSubCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSubCategory && (items as any)[activeSubCategory]?.map((item: string, idx: number) =>
                    renderMenuItem(item, idx)
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(items as string[]).map((item, idx) => renderMenuItem(item, idx))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- STYLE NAVBAR ---
  const navContainerStyle = isScrolled
    ? "w-full rounded-none mt-0 py-3 px-4 md:px-8 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200"
    : "w-[95%] max-w-7xl rounded-full mt-6 py-3 px-6 bg-indigo-900/80 backdrop-blur-sm border border-white/10 shadow-xl";

  const textColor = isScrolled ? "text-indigo-900" : "text-white";
  const hoverBg = isScrolled ? "hover:bg-indigo-50 hover:text-indigo-700" : "hover:bg-white/10 hover:text-white";
  const hamburgerColor = isScrolled ? "text-indigo-900" : "text-white";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none font-sans">
      <div className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-between ${navContainerStyle}`}>
        
        {/* --- LOGO --- */}
        <a href="/" className="flex items-center gap-3 group">
          <img src="/images/Logo Disdikbud Palu.png" alt="Logo" className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-none tracking-tight transition-colors duration-300 ${textColor}`}>
              DINAS PENDIDIKAN
            </span>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${isScrolled ? "text-gray-500" : "text-indigo-200"}`}>
              Kota Palu
            </span>
          </div>
        </a>

        {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
        <div className="hidden lg:flex items-center gap-1">
          <button onClick={() => onMenuClick("beranda", "Beranda")} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeDropdown === null ? (isScrolled ? "text-gray-600" : "text-white") : "text-gray-400"} ${hoverBg}`}>
            <Home size={16} /> Beranda
          </button>
          {Object.keys(dropdownMenus).map((menuKey) => {
            const isActive = activeDropdown === menuKey;
            const btnClass = isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : (isScrolled ? "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50" : "text-white hover:bg-white/10");
            return (
              <button key={menuKey} onClick={() => setActiveDropdown(isActive ? null : menuKey)} className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${btnClass}`}>
                {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isActive ? "rotate-180" : ""}`} />
              </button>
            );
          })}
        </div>

        {/* --- MOBILE MENU (SHADCN SHEET) --- */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={hamburgerColor}>
                <Menu size={28} />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[85%] sm:w-[380px] p-0">
               <SheetHeader className="p-6 bg-gradient-to-br from-indigo-900 to-indigo-800 text-white">
                 <SheetTitle className="text-white flex items-center gap-3">
                   <img src="/images/Logo Disdikbud Palu.png" alt="Logo" className="h-8 w-auto bg-white rounded-full p-0.5" />
                   <div className="text-left">
                     <div className="font-bold text-sm">MENU NAVIGASI</div>
                     <div className="text-[10px] font-normal text-indigo-200">Disdikbud Kota Palu</div>
                   </div>
                 </SheetTitle>
               </SheetHeader>

               {/* Scroll Area agar menu panjang aman di HP */}
               <ScrollArea className="h-[calc(100vh-100px)]">
                 <div className="p-6 flex flex-col gap-2">
                   
                   {/* Menu 1: Beranda */}
                   <Button 
                     variant="ghost" 
                     className="justify-start w-full text-base font-semibold text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
                     onClick={() => {
                       onMenuClick("beranda", "Beranda");
                       setIsMobileMenuOpen(false);
                     }}
                   >
                     <Home size={18} className="mr-3 text-indigo-500" />
                     Beranda
                   </Button>

                   <Separator className="my-2" />

                   {/* Menu Dropdown (Accordion) */}
                   <Accordion type="single" collapsible className="w-full">
                     {Object.keys(dropdownMenus).map((menuKey) => {
                       const items = dropdownMenus[menuKey];
                       const isCategorized = !Array.isArray(items);
                       
                       return (
                         <AccordionItem key={menuKey} value={menuKey} className="border-b-0">
                           <AccordionTrigger className="hover:no-underline hover:text-indigo-600 py-3 text-base font-semibold text-gray-700">
                             <div className="flex items-center gap-3">
                               <div className="text-indigo-500">
                                  {/* Ikon untuk header menu utama */}
                                  {menuKey === 'profil' ? <Users size={18}/> : 
                                   menuKey === 'layanan' ? <Briefcase size={18}/> : 
                                   <Globe size={18}/>}
                               </div>
                               {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
                             </div>
                           </AccordionTrigger>
                           
                           <AccordionContent className="pb-2">
                             <div className="pl-4 border-l-2 border-indigo-100 ml-5 space-y-4 mt-2">
                               {isCategorized ? (
                                  // Jika punya Kategori (seperti Layanan)
                                  Object.keys(items).map((catKey) => (
                                    <div key={catKey}>
                                      <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        {getIconForCategory(catKey)} {catKey}
                                      </h5>
                                      <div className="flex flex-col gap-1 pl-2">
                                        {(items as any)[catKey].map((subItem: string, idx: number) => (
                                          <button 
                                            key={idx}
                                            onClick={() => {
                                              onMenuClick(menuKey, subItem);
                                              setIsMobileMenuOpen(false);
                                            }}
                                            className="text-left text-sm text-gray-600 py-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-md px-2 transition-colors flex items-center gap-2"
                                          >
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            {subItem}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                               ) : (
                                 // Jika List Biasa (seperti Profil)
                                 <div className="flex flex-col gap-1">
                                    {(items as string[]).map((subItem, idx) => (
                                      <button 
                                        key={idx}
                                        onClick={() => {
                                          onMenuClick(menuKey, subItem);
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className="text-left text-sm text-gray-600 py-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-md px-2 transition-colors flex items-center gap-2"
                                      >
                                        {getIconForItem(subItem)}
                                        {subItem}
                                      </button>
                                    ))}
                                 </div>
                               )}
                             </div>
                           </AccordionContent>
                         </AccordionItem>
                       );
                     })}
                   </Accordion>

                 </div>
               </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

      </div>
      
      {/* Container Mega Menu Desktop */}
      <div className="absolute top-0 left-0 w-full pointer-events-none hidden lg:block">
         <div className={`w-full transition-all duration-500 ${isScrolled ? "mt-20" : "mt-28"} pointer-events-auto`}>
            {renderMegaMenu()}
         </div>
      </div>
    </nav>
  );
};

export default Navbar;
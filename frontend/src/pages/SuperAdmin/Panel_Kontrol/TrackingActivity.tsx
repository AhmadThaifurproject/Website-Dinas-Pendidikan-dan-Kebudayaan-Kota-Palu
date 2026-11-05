// src/pages/SuperAdmin/Panel_Kontrol/TrackingActivity.tsx

import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import axios from 'axios';
import { 
  Activity, Search, Filter, AlertTriangle, ShieldAlert, 
  TerminalSquare, Clock, User, HardDrive, ServerCrash, 
  CheckCircle2, Edit3, Trash2, LogIn, LogOut, FileJson,
  Layers, Loader2, ChevronDown, MessageSquare, Check
} from 'lucide-react';

// --- IMPORT THEME & FLOATING CHAT COMPONENT ---
import { ThemeContextAdmin } from "../../Admin/bagian/theme/ThemeContextAdmin.tsx";
import FloatingChat from "../../../feature/chat/FloatingChat.tsx"; 

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ActivityLog {
  id: string;
  admin_id: number;
  admin_name: string;
  action_type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ERROR' | 'ABNORMAL';
  module: string;
  description: string;
  created_at: string;
  payload_data?: string; 
  ip_address?: string;
  user_agent?: string;
}

interface AdminActivityGroup {
  admin_id: number;
  admin_name: string;
  isOnline: boolean;
  last_active: string;
  activities: ActivityLog[];
}

// --- HELPER MENGHITUNG WAKTU REALTIME (INDONESIA) ---
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "baru saja";
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " thn yg lalu";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bln yg lalu";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari yg lalu";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam yg lalu";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mnt yg lalu";
  
  return "baru saja";
};

// --- DATA OPTIONS UNTUK DROPDOWN ---
const actionOptions = [
  { value: "ALL", label: "Semua Tipe Aksi" },
  { value: "CREATE", label: "CREATE (Tambah Data)" },
  { value: "UPDATE", label: "UPDATE (Ubah Data)" },
  { value: "DELETE", label: "DELETE (Hapus Data)" },
  { value: "LOGIN", label: "LOGIN" },
  { value: "ERROR", label: "ERROR / ABNORMAL" }
];

const moduleOptions = [
  { value: "ALL", label: "Semua Modul" },
  { value: "Auth", label: "Auth / Login" },
  { value: "Berita", label: "Berita" },
  { value: "Perencanaan", label: "Perencanaan" },
  { value: "Kebudayaan", label: "Kebudayaan" },
  { value: "Aset dan Keuangan", label: "Aset dan Keuangan" },
  { value: "System", label: "System Internal" }
];

export default function TrackingActivity() {
  const context = useContext(ThemeContextAdmin) as any;
  const theme = context?.theme || "light";
  const isLight = theme === "light";

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Real-time Tick 
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000); 
    return () => clearInterval(timer);
  }, []);

  // Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");
  const [filterModule, setFilterModule] = useState("ALL");

  // State & Ref Custom Dropdown
  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);
  
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const moduleRef = useRef<HTMLDivElement>(null);

  const [expandedAdminId, setExpandedAdminId] = useState<number | null>(null);

  // STATE UNTUK FLOATING CHAT WIDGET
  const [activeChatAdmin, setActiveChatAdmin] = useState<{id: number, name: string, isOnline: boolean} | null>(null);

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) setIsActionOpen(false);
      if (moduleRef.current && !moduleRef.current.contains(event.target as Node)) setIsModuleOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- STYLE HELPERS ---
  const mainBg = isLight ? "bg-[#f4f7fc]" : "bg-[#0b1120]";
  const cardBg = isLight ? "bg-white border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" : "bg-[#131b2f] border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.4)]";
  const textMain = isLight ? "text-slate-800" : "text-slate-100";
  const textMuted = isLight ? "text-slate-500" : "text-slate-400";
  const inputBg = isLight ? "bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-400" : "bg-[#1c2438] border-slate-700 focus:bg-[#1e293b] focus:border-indigo-500";

  // --- FETCH DATA ---
  const fetchActivityLogs = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setLogs([
          { id: "LOG001", admin_id: 1, admin_name: "Budi Santoso", action_type: "LOGIN", module: "Auth", description: "Melakukan otentikasi login ke panel admin Disdikbud.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
          { id: "LOG002", admin_id: 1, admin_name: "Budi Santoso", action_type: "CREATE", module: "Berita", description: "Mempublikasikan berita baru berjudul: 'Porseni 2024 Tingkat Kota'.", payload_data: '{"judul": "Porseni 2024 Tingkat Kota", "kategori": "SD"}', created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
          { id: "LOG003", admin_id: 2, admin_name: "Siti Aminah", action_type: "UPDATE", module: "Perencanaan", description: "Memperbarui konfigurasi Juknis Layanan NUPTK dan file unduhan.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
          { id: "LOG003_OUT", admin_id: 2, admin_name: "Siti Aminah", action_type: "LOGOUT", module: "Auth", description: "Keluar dari sesi dashboard admin.", created_at: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString() },
          { id: "LOG004", admin_id: 3, admin_name: "Unknown / Hacker", action_type: "ABNORMAL", module: "System", description: "Terdeteksi mencoba mengakses endpoint terlarang atau injeksi SQL pada /api/superadmin/delete-all.", payload_data: '{"attempt": "SQL Injection pattern detected", "severity": "CRITICAL"}', created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
          { id: "LOG005", admin_id: 4, admin_name: "Andi Wijaya", action_type: "ERROR", module: "Aset dan Keuangan", description: "Gagal menyimpan konten form: Request Timeout dari Server Database.", payload_data: '{"error_code": 504, "stack": "Database Lock"}', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
          { id: "LOG005_OUT", admin_id: 4, admin_name: "Andi Wijaya", action_type: "LOGOUT", module: "Auth", description: "Sesi berakhir otomatis (Timeout).", created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // --- LOGIC GROUPING & FILTERING ---
  const groupedAdmins = useMemo(() => {
    const groups: Record<number, AdminActivityGroup> = {};

    const filtered = logs.filter(log => {
      const matchSearch = log.admin_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isErrorAction = log.action_type === 'ERROR' || log.action_type === 'ABNORMAL';
      const matchAction = filterAction === "ALL" 
                          ? true 
                          : filterAction === "ERROR" ? isErrorAction : log.action_type === filterAction;
      
      const matchModule = filterModule === "ALL" || log.module === filterModule;
      return matchSearch && matchAction && matchModule;
    });

    filtered.forEach(log => {
      if (!groups[log.admin_id]) {
        const allAdminLogs = logs.filter(l => l.admin_id === log.admin_id).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const isOnline = allAdminLogs.length > 0 && allAdminLogs[0].action_type !== 'LOGOUT';
        
        groups[log.admin_id] = {
          admin_id: log.admin_id,
          admin_name: log.admin_name,
          isOnline: isOnline,
          last_active: log.created_at,
          activities: []
        };
      }
      groups[log.admin_id].activities.push(log);
      
      if (new Date(log.created_at).getTime() > new Date(groups[log.admin_id].last_active).getTime()) {
        groups[log.admin_id].last_active = log.created_at;
      }
    });

    Object.values(groups).forEach(g => {
      g.activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });

    return Object.values(groups).sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime());
  }, [logs, searchQuery, filterAction, filterModule, tick]); 

  // --- LOGIC UI BADGE COLORS ---
  const getActionStyles = (type: string) => {
    switch (type) {
      case 'CREATE': return { icon: <CheckCircle2 className="w-3.5 h-3.5"/>, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' };
      case 'UPDATE': return { icon: <Edit3 className="w-3.5 h-3.5"/>, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' };
      case 'DELETE': return { icon: <Trash2 className="w-3.5 h-3.5"/>, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' };
      case 'LOGIN': 
      case 'LOGOUT': return { icon: type === 'LOGIN' ? <LogIn className="w-3.5 h-3.5"/> : <LogOut className="w-3.5 h-3.5"/>, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600' };
      case 'ERROR': return { icon: <ServerCrash className="w-3.5 h-3.5"/>, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]' };
      case 'ABNORMAL': return { icon: <ShieldAlert className="w-3.5 h-3.5"/>, color: 'text-red-600 dark:text-red-500', bg: 'bg-red-100 dark:bg-red-500/20 border-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.4)]' };
      default: return { icon: <Activity className="w-3.5 h-3.5"/>, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' };
    }
  };

  const toggleAccordion = (id: number) => {
    setExpandedAdminId(prev => prev === id ? null : id);
  };

  const errorCount = logs.filter(l => l.action_type === 'ERROR' || l.action_type === 'ABNORMAL').length;
  const activeAdminsCount = new Set(logs.filter(l => l.action_type === 'LOGIN').map(l => l.admin_id)).size;

  return (
    <div className={`w-full min-h-screen ${mainBg} transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 relative`}>
      
      {/* WIDGET FLOATING CHAT */}
      <AnimatePresence>
        {activeChatAdmin && (
          <FloatingChat 
            admin={activeChatAdmin} 
            isLight={isLight} 
            onClose={() => setActiveChatAdmin(null)} 
          />
        )}
      </AnimatePresence>

      <div className="max-w-[85rem] mx-auto space-y-8">
        
        {/* ================= HEADER & SUMMARY ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black tracking-widest uppercase mb-3">
                  <TerminalSquare className="w-3.5 h-3.5" /> System Control Panel
              </div>
              <h1 className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${textMain}`}>
                Tracking <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Activity Admin</span>
              </h1>
              <p className={`text-sm ${textMuted} mt-2 max-w-xl`}>
                Pantau seluruh rekam jejak sesi, aktivitas operasional, dan perubahan data admin pada sistem secara real-time.
              </p>
           </div>
           
           <div className="flex gap-3">
              <button onClick={fetchActivityLogs} className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isLight ? "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700" : "bg-[#1e293b] border border-slate-700 hover:bg-slate-800 text-slate-300"} shadow-sm`}>
                <Activity className="w-4 h-4" /> Refresh Logs
              </button>
           </div>
        </div>

        {/* ================= METRICS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className={`${cardBg} rounded-2xl p-6 flex items-center gap-5 border-l-4 border-l-blue-500`}>
                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl"><HardDrive className="w-8 h-8" /></div>
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Total Aktivitas (Hari Ini)</p>
                    <p className={`text-3xl font-black ${textMain} mt-1`}>{logs.length}</p>
                </div>
            </div>
            <div className={`${cardBg} rounded-2xl p-6 flex items-center gap-5 border-l-4 ${errorCount > 0 ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                <div className={`p-4 rounded-xl ${errorCount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                   {errorCount > 0 ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
                </div>
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Error / Anomali</p>
                    <p className={`text-3xl font-black ${textMain} mt-1`}>{errorCount}</p>
                </div>
            </div>
            <div className={`${cardBg} rounded-2xl p-6 flex items-center gap-5 border-l-4 border-l-indigo-500`}>
                <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-xl"><User className="w-8 h-8" /></div>
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Admin Aktif Terdeteksi</p>
                    <p className={`text-3xl font-black ${textMain} mt-1`}>{activeAdminsCount}</p>
                </div>
            </div>
        </div>

        {/* ================= CONTROLS & FILTER (CUSTOM DROPDOWN MODERN) ================= */}
        <div className={`${cardBg} rounded-2xl p-4 border flex flex-col md:flex-row gap-4 items-center`}>
            
            {/* Search Input */}
            <div className="relative w-full md:w-2/5">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 z-10"><Search className="h-4 w-4" /></span>
                <input 
                  type="text" placeholder="Cari nama admin atau deskripsi..." 
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className={`relative w-full py-3 pl-11 pr-4 rounded-xl text-sm border transition-all outline-none ${inputBg} ${textMain}`} 
                />
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-3/5 gap-4">
                
                {/* Custom Dropdown Tipe Aksi */}
                <div className="relative w-full" ref={actionRef}>
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 z-10 pointer-events-none"><Filter className="h-4 w-4" /></span>
                    <div 
                      onClick={() => { setIsActionOpen(!isActionOpen); setIsModuleOpen(false); }}
                      className={`w-full py-3 pl-11 pr-4 rounded-xl text-sm border transition-all cursor-pointer flex justify-between items-center ${inputBg} ${textMain} ${isActionOpen ? (isLight ? 'border-indigo-400 ring-2 ring-indigo-500/20' : 'border-indigo-500 ring-2 ring-indigo-500/20') : ''}`}
                    >
                        <span className="truncate select-none">{actionOptions.find(o => o.value === filterAction)?.label}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isActionOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    <AnimatePresence>
                        {isActionOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute z-50 w-full mt-2 rounded-2xl shadow-xl border overflow-hidden ${isLight ? "bg-white border-slate-200 shadow-indigo-500/10" : "bg-[#1e293b] border-slate-700 shadow-black/50"}`}
                            >
                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                                    {actionOptions.map(opt => (
                                        <div
                                            key={opt.value}
                                            onClick={() => { setFilterAction(opt.value); setIsActionOpen(false); }}
                                            className={`px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-colors flex items-center justify-between group ${filterAction === opt.value ? (isLight ? "bg-indigo-50 text-indigo-700" : "bg-indigo-500/20 text-indigo-400") : (isLight ? "text-slate-700 hover:bg-slate-50 hover:text-indigo-600" : "text-slate-300 hover:bg-slate-800 hover:text-indigo-400")}`}
                                        >
                                            {opt.label}
                                            {filterAction === opt.value && <Check className="w-4 h-4" />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Custom Dropdown Modul */}
                <div className="relative w-full" ref={moduleRef}>
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 z-10 pointer-events-none"><Layers className="h-4 w-4" /></span>
                    <div 
                      onClick={() => { setIsModuleOpen(!isModuleOpen); setIsActionOpen(false); }}
                      className={`w-full py-3 pl-11 pr-4 rounded-xl text-sm border transition-all cursor-pointer flex justify-between items-center ${inputBg} ${textMain} ${isModuleOpen ? (isLight ? 'border-indigo-400 ring-2 ring-indigo-500/20' : 'border-indigo-500 ring-2 ring-indigo-500/20') : ''}`}
                    >
                        <span className="truncate select-none">{moduleOptions.find(o => o.value === filterModule)?.label}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isModuleOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    <AnimatePresence>
                        {isModuleOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute z-50 w-full mt-2 rounded-2xl shadow-xl border overflow-hidden ${isLight ? "bg-white border-slate-200 shadow-indigo-500/10" : "bg-[#1e293b] border-slate-700 shadow-black/50"}`}
                            >
                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                                    {moduleOptions.map(opt => (
                                        <div
                                            key={opt.value}
                                            onClick={() => { setFilterModule(opt.value); setIsModuleOpen(false); }}
                                            className={`px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-colors flex items-center justify-between group ${filterModule === opt.value ? (isLight ? "bg-indigo-50 text-indigo-700" : "bg-indigo-500/20 text-indigo-400") : (isLight ? "text-slate-700 hover:bg-slate-50 hover:text-indigo-600" : "text-slate-300 hover:bg-slate-800 hover:text-indigo-400")}`}
                                        >
                                            {opt.label}
                                            {filterModule === opt.value && <Check className="w-4 h-4" />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>

        {/* ================= ADMIN LIST & ACTIVITY DROPDOWN ================= */}
        <div className="space-y-4">
            {isLoading ? (
                <div className={`${cardBg} flex flex-col items-center justify-center h-64 rounded-3xl border space-y-4`}>
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className={`font-semibold ${textMuted}`}>Mengekstrak log aktivitas...</p>
                </div>
            ) : groupedAdmins.length === 0 ? (
                <div className={`${cardBg} flex flex-col items-center justify-center h-64 rounded-3xl border text-center`}>
                    <ShieldAlert className={`w-12 h-12 ${isLight ? 'text-slate-300' : 'text-slate-700'} mb-4`} />
                    <h3 className={`text-lg font-bold ${textMain}`}>Tidak Ada Rekam Jejak</h3>
                    <p className={`text-sm ${textMuted} mt-1`}>Admin atau aktivitas sesuai pencarian Anda tidak ditemukan.</p>
                </div>
            ) : (
                <AnimatePresence>
                    {groupedAdmins.map((group) => {
                        const isExpanded = expandedAdminId === group.admin_id;

                        return (
                            <motion.div 
                                key={group.admin_id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isExpanded 
                                      ? (isLight ? 'bg-white border-indigo-200 shadow-lg shadow-indigo-500/5' : 'bg-[#1c2438] border-indigo-500/50 shadow-lg shadow-indigo-900/20') 
                                      : (isLight ? 'bg-white border-slate-200 hover:shadow-md' : 'bg-[#131b2f] border-slate-700/60 hover:border-slate-600 shadow-sm')
                                }`}
                            >
                                {/* --- 1. HEADER HORIZONTAL --- */}
                                <div className="flex items-center justify-between p-4 px-5">
                                    
                                    {/* Kiri: Profil & Status */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                                            <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className={`text-sm font-extrabold truncate ${textMain}`}>
                                                {group.admin_name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${group.isOnline ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${group.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                    {group.isOnline ? 'Online' : `Offline • ${getTimeAgo(group.last_active)}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kanan: Tombol Message & Dropdown */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button 
                                            onClick={() => setActiveChatAdmin({ id: group.admin_id, name: group.admin_name, isOnline: group.isOnline })}
                                            className={`p-2.5 rounded-xl border transition-all ${isLight ? 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 shadow-sm' : 'bg-[#182136] border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 shadow-sm'}`}
                                            title="Chat Admin Ini"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>

                                        <button 
                                            onClick={() => toggleAccordion(group.admin_id)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${isExpanded ? 'bg-indigo-600 text-white shadow-md' : (isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700')}`}
                                        >
                                            {isExpanded ? 'Tutup Detail' : 'Detail Activity'}
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* --- 2. DROPDOWN TIRAI (TABEL MODERN) --- */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`p-6 border-t ${isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-700/50 bg-[#0b1120]/50'}`}>
                                                
                                                <div className={`w-full rounded-2xl overflow-hidden border ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700/50 bg-[#1c2438]'}`}>
                                                    
                                                    {/* Header Tabel */}
                                                    <div className={`grid grid-cols-12 gap-4 px-6 py-4 border-b ${isLight ? 'border-slate-200 bg-slate-100/50 text-slate-500' : 'border-slate-700/50 bg-[#131b2f] text-slate-400'} text-[10px] font-black uppercase tracking-widest`}>
                                                        <div className="col-span-3 lg:col-span-2 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Modul</div>
                                                        <div className="col-span-3 lg:col-span-2 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Aksi</div>
                                                        <div className="col-span-6 lg:col-span-8 flex items-center gap-1.5">Keterangan Riwayat Sesi</div>
                                                    </div>

                                                    {/* Body Tabel (Map Semua Aktivitas Admin Ini) */}
                                                    <div className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-700/50'}`}>
                                                        {group.activities.map(act => {
                                                            const actStyles = getActionStyles(act.action_type);
                                                            const isActAbnormal = act.action_type === 'ERROR' || act.action_type === 'ABNORMAL';

                                                            return (
                                                                <div key={act.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                                    
                                                                    {/* Kolom Modul */}
                                                                    <div className="col-span-3 lg:col-span-2">
                                                                        <span className={`inline-flex px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase ${isLight ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                                                            {act.module}
                                                                        </span>
                                                                    </div>

                                                                    {/* Kolom Aksi (Badge Berada di Sini) */}
                                                                    <div className="col-span-3 lg:col-span-2">
                                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${actStyles.bg} ${actStyles.color} ${isActAbnormal ? 'animate-pulse' : ''}`}>
                                                                            {actStyles.icon} {act.action_type}
                                                                        </span>
                                                                    </div>

                                                                    {/* Kolom Keterangan */}
                                                                    <div className="col-span-6 lg:col-span-8 flex flex-col justify-center">
                                                                        <span className={`text-[10px] font-bold ${textMuted} mb-1 flex items-center gap-1.5`}>
                                                                            <Clock className="w-3 h-3" /> {new Date(act.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                                                                        </span>
                                                                        <p className={`text-sm font-semibold leading-snug ${isActAbnormal ? 'text-red-600 dark:text-red-400' : textMain}`}>
                                                                            {act.description}
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            )}
        </div>

      </div>
    </div>
  );
}
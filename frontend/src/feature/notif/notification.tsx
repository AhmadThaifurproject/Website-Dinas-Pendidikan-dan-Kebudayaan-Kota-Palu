// src/components/Layout/Admin/Topbar/Notification.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CheckCheck, Trash2, MessageSquare, 
  ShieldAlert, Settings, Info, CheckCircle2,
  Clock
} from 'lucide-react';

interface NotificationProps {
  theme: "light" | "dark";
  userRole: string;
}

// Tipe data Notifikasi
type NotifType = 'CHAT' | 'ALERT' | 'SYSTEM' | 'SUCCESS' | 'INFO';

interface NotificationItem {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetRoles: string[]; // 'all', 'admin', 'teknisi', 'super_admin'
}

// --- DUMMY DATA BERDASARKAN ROLE ---
const initialNotifications: NotificationItem[] = [
  // Khusus Teknisi / Super Admin
  { id: 'n1', type: 'ALERT', title: 'Peringatan Keamanan', message: 'Gagal login beruntun terdeteksi pada akun Admin Aset.', timestamp: 'Baru saja', isRead: false, targetRoles: ['teknisi', 'super_admin'] },
  { id: 'n2', type: 'CHAT', title: 'Pesan Baru (Admin Berita)', message: '"Halo teknisi, saya tidak bisa upload foto..."', timestamp: '5 mnt lalu', isRead: false, targetRoles: ['teknisi', 'super_admin'] },
  
  // Khusus Admin Biasa
  { id: 'n3', type: 'SYSTEM', title: 'Fitur Dikunci', message: 'Modul Perencanaan saat ini dikunci oleh Teknisi untuk pemeliharaan.', timestamp: '1 jam lalu', isRead: false, targetRoles: ['admin'] },
  { id: 'n4', type: 'CHAT', title: 'Balasan IT Support', message: '"Pesan diterima. Tim teknisi sedang mengecek..."', timestamp: '10 mnt lalu', isRead: false, targetRoles: ['admin'] },
  { id: 'n5', type: 'SUCCESS', title: 'Sinkronisasi Berhasil', message: 'Data layanan SD telah berhasil disinkronkan dengan Dapodik.', timestamp: 'Kemarin', isRead: true, targetRoles: ['admin'] },
  
  // Untuk Semua Role
  { id: 'n6', type: 'INFO', title: 'Pembaruan Sistem v2.1', message: 'Sistem telah diupdate. Cek fitur baru di Dashboard Anda.', timestamp: '2 hari lalu', isRead: true, targetRoles: ['all'] },
];

export default function Notification({ theme, userRole }: NotificationProps) {
  const isLight = theme === "light";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleNormalized = userRole.toLowerCase().trim();

  // Filter notifikasi berdasarkan role user yang login
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return initialNotifications.filter(n => 
      n.targetRoles.includes('all') || n.targetRoles.includes(roleNormalized)
    );
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle klik di luar untuk menutup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const clearAllHistory = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // --- STYLE HELPERS ---
  const getIconData = (type: NotifType) => {
    switch (type) {
      case 'CHAT': return { icon: <MessageSquare className="w-4 h-4"/>, bg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' };
      case 'ALERT': return { icon: <ShieldAlert className="w-4 h-4"/>, bg: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' };
      case 'SYSTEM': return { icon: <Settings className="w-4 h-4"/>, bg: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' };
      case 'SUCCESS': return { icon: <CheckCircle2 className="w-4 h-4"/>, bg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' };
      case 'INFO': return { icon: <Info className="w-4 h-4"/>, bg: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' };
      default: return { icon: <Bell className="w-4 h-4"/>, bg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* --- BELL ICON TRIGGER --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${
          isOpen 
            ? (isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/20 text-indigo-400') 
            : (isLight ? 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600' : 'text-slate-400 hover:bg-slate-800 hover:text-indigo-400')
        }`}
      >
        <Bell className="w-5 h-5" />
        
        {/* Unread Badge Ping */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white dark:border-[#0a0a0a]"></span>
          </span>
        )}
      </button>

      {/* --- DROPDOWN PANEL --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
            className={`absolute right-0 mt-3 w-[380px] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border overflow-hidden z-50 flex flex-col ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#131b2f] border-slate-700/80'
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${isLight ? 'border-slate-100' : 'border-slate-700/50'}`}>
              <div>
                <h3 className={`font-extrabold text-base ${isLight ? 'text-slate-800' : 'text-white'}`}>Notifikasi</h3>
                <p className={`text-[11px] font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Anda memiliki <span className="font-bold text-indigo-500">{unreadCount}</span> info baru
                </p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-bold ${isLight ? 'text-indigo-600 hover:bg-indigo-50' : 'text-indigo-400 hover:bg-indigo-500/20'}`}
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Tandai Dibaca
                </button>
              )}
            </div>

            {/* Body / List */}
            <div className={`max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col ${isLight ? 'bg-slate-50/50' : 'bg-[#0b1120]/50'}`}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${isLight ? 'bg-slate-100 text-slate-300' : 'bg-slate-800 text-slate-600'}`}>
                    <Bell className="w-8 h-8" />
                  </div>
                  <h4 className={`text-sm font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>Semua Bersih!</h4>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tidak ada riwayat notifikasi saat ini.</p>
                </div>
              ) : (
                <div className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/50'}`}>
                  {notifications.map((notif) => {
                    const iconData = getIconData(notif.type);
                    return (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`flex gap-3 p-4 transition-colors cursor-pointer relative group ${
                          !notif.isRead 
                            ? (isLight ? 'bg-indigo-50/30' : 'bg-indigo-500/5') 
                            : (isLight ? 'hover:bg-slate-50' : 'hover:bg-[#182136]')
                        }`}
                      >
                        {/* Unread Indicator Dot (Kiri Keras) */}
                        {!notif.isRead && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-500"></div>
                        )}

                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconData.bg}`}>
                          {iconData.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold truncate leading-tight ${
                            !notif.isRead 
                              ? (isLight ? 'text-slate-900' : 'text-white') 
                              : (isLight ? 'text-slate-700' : 'text-slate-300')
                          }`}>
                            {notif.title}
                          </h4>
                          <p className={`text-xs mt-1 leading-snug line-clamp-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {notif.message}
                          </p>
                          <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-semibold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            <Clock className="w-3 h-3" /> {notif.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`p-3 border-t shrink-0 flex justify-center ${isLight ? 'border-slate-100 bg-white' : 'border-slate-700/50 bg-[#131b2f]'}`}>
                <button 
                  onClick={clearAllHistory}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    isLight ? 'text-rose-600 hover:bg-rose-50' : 'text-rose-500 hover:bg-rose-500/10'
                  }`}
                >
                  <Trash2 className="w-4 h-4" /> Clear All History
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
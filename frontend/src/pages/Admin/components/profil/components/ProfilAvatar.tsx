// src/pages/Admin/components/profil/components/ProfilAvatar.tsx

import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Mail, MapPin, CheckCircle2, Shield, 
  Fingerprint, Building2, Pencil, X, Save, User
} from 'lucide-react';

// --- IMPORT THEME CONTEXT ---
import { ThemeContextAdmin } from "../../theme/ThemeContextAdmin";

interface ProfileAvatarProps {
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'busy';
}

export default function ProfileAvatar({
  avatarUrl = "https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff",
  status = 'online'
}: ProfileAvatarProps) {
  const context = useContext(ThemeContextAdmin) as any;
  const theme = context?.theme || "light";
  const isLight = theme === "light";

  // --- 1. DETEKSI ROLE DARI SESSION STORAGE ---
  const rawRole = sessionStorage.getItem('userRole') || 'admin';
  const userRole = rawRole.toLowerCase().trim();
  const isTeknisi = userRole === 'teknisi' || userRole === 'super_admin';

  // --- 2. STATE DATA PROFIL DINAMIS ---
  const [profileData, setProfileData] = useState({
    name: isTeknisi ? "Super Administrator" : "Admin Disdikbud",
    roleLabel: isTeknisi ? "IT Support & Super Admin" : "Operator Layanan Publik",
    location: "Disdikbud Kota Palu",
    email: isTeknisi ? "teknisi.pusat@disdikbud.palukota.go.id" : "admin.layanan@disdikbud.palukota.go.id",
    nip: isTeknisi ? "19900515 201504 1 008" : "19850212 201001 1 015",
    avatar: `https://ui-avatars.com/api/?name=${isTeknisi ? 'Super+Admin' : 'Admin+Disdikbud'}&background=${isTeknisi ? 'e11d48' : '6366f1'}&color=fff`
  });

  // State untuk Modal Edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  // --- HANDLER SIMPAN PROFIL ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Nama dan Email wajib diisi!' });
      return;
    }

    setProfileData(formData);
    setIsEditOpen(false);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Profil berhasil diperbarui!',
      showConfirmButton: false,
      timer: 2000,
      background: isLight ? '#ffffff' : '#1e293b',
      color: isLight ? '#1e293b' : '#ffffff'
    });
  };

  const statusColor = {
    online: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]",
    offline: "bg-slate-400",
    busy: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]",
  };

  // --- STYLE HELPERS ---
  const cardBg = isLight ? "bg-white border-slate-200" : "bg-[#131b2f] border-slate-700/80";
  const textMain = isLight ? "text-slate-800" : "text-white";
  const textMuted = isLight ? "text-slate-500" : "text-slate-400";
  const labelBg = isLight ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
  const labelTeknisiBg = isLight ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-rose-500/10 text-rose-400 border-rose-500/20";
  const iconBg = isLight ? "bg-slate-50 text-slate-400" : "bg-[#1c2438] text-slate-500";
  const inputClass = `w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${isLight ? 'bg-slate-50 border-slate-200 focus:border-indigo-400 focus:bg-white text-slate-800' : 'bg-[#0f172a] border-slate-700 focus:border-indigo-500/50 text-white'}`;

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      
      {/* ========================================================= */}
      {/* 1. KARTU PROFIL UTAMA */}
      {/* ========================================================= */}
      <div className={`rounded-3xl shadow-xl overflow-hidden border transition-all duration-500 relative ${cardBg} ${isLight ? 'shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50' : 'shadow-black/20 hover:shadow-black/40'}`}>
        
        <div className="flex flex-col md:flex-row">
          
          {/* --- Bagian Kiri: Avatar Container --- */}
          <div className={`w-full md:w-2/5 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r relative overflow-hidden ${isLight ? (isTeknisi ? 'bg-gradient-to-br from-rose-50 to-orange-50/50 border-slate-100' : 'bg-gradient-to-br from-indigo-50 to-blue-50/50 border-slate-100') : 'bg-gradient-to-br from-[#0f172a] to-[#131b2f] border-slate-700/50'}`}>
             
             {/* Dekorasi Background Blob */}
             <div className={`absolute top-[-20%] left-[-20%] w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob ${isLight ? (isTeknisi ? 'bg-rose-200' : 'bg-indigo-200') : 'bg-indigo-900/40'}`}></div>
             <div className={`absolute bottom-[-20%] right-[-20%] w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 ${isLight ? (isTeknisi ? 'bg-orange-200' : 'bg-blue-200') : 'bg-blue-900/40'}`}></div>

            <div className="relative z-10 group mt-2">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className={`w-36 h-36 md:w-44 md:h-44 object-cover rounded-full border-[6px] shadow-lg transition-transform duration-500 group-hover:scale-105 ${isLight ? 'border-white' : 'border-[#1e293b]'}`}
                />
                {/* Status Indicator */}
                <div className={`absolute bottom-3 right-3 w-5 h-5 ${statusColor[status]} border-4 rounded-full transition-transform duration-300 group-hover:scale-110 ${isLight ? 'border-white' : 'border-[#1e293b]'}`}></div>
              </div>
            </div>

            {/* Badge Role Utama (Bawah Foto) */}
            <div className="mt-6 text-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-black uppercase tracking-widest ${isTeknisi ? labelTeknisiBg : labelBg}`}>
                 <Shield size={14} /> {profileData.roleLabel}
              </span>
            </div>
          </div>

          {/* --- Bagian Kanan: Informasi Detail Formal --- */}
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
            
            <div>
              {/* Header Kanan (Nama Tampil Penuh) */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  {/* FIX: Tidak ada class truncate agar nama bisa wrap dengan leluasa */}
                  <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight break-words leading-tight ${textMain}`}>
                    {profileData.name}
                  </h2>
                  {status === 'online' && (
                     <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/20">
                        <CheckCircle2 size={10} /> Active
                     </span>
                  )}
                </div>
                <p className={`text-sm font-medium ${textMuted} flex items-center gap-1.5`}>
                   <Building2 size={16} /> Pemerintah Kota Palu
                </p>
              </div>

              {/* List Info Kontak & Lokasi */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted} mb-0.5`}>Unit Kerja / Lokasi</p>
                    <p className={`text-sm font-semibold truncate ${textMain}`}>{profileData.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted} mb-0.5`}>Email Instansi</p>
                    <p className={`text-sm font-semibold truncate ${textMain}`}>{profileData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    <Fingerprint size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted} mb-0.5`}>ID Sistem / NIP</p>
                    <p className={`text-sm font-mono font-semibold truncate ${textMain}`}>{profileData.nip}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- FOOTER ACTION (Security Note & Edit Button) --- */}
            <div className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${isLight ? 'border-slate-100' : 'border-slate-700/50'}`}>
              <div className="flex items-start gap-2 pr-2">
                <Shield size={16} className={`${isTeknisi ? 'text-rose-500' : 'text-emerald-500'} shrink-0 mt-0.5`} />
                <p className={`text-[10px] font-medium leading-relaxed ${textMuted}`}>
                  Akun terverifikasi, dilindungi enkripsi sistem pusat Dinas Pendidikan & Kebudayaan Kota Palu.
                </p>
              </div>

              {/* FIX: Tombol diletakkan di bawah dengan proporsional */}
              <button 
                onClick={() => setIsEditOpen(true)}
                className={`shrink-0 px-5 py-2.5 rounded-xl border transition-all flex items-center gap-2 group shadow-sm ${isLight ? 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50' : 'bg-[#1c2438] border-slate-700 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-[#1e293b]'}`}
              >
                <Pencil size={14} className="transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold whitespace-nowrap">Edit Profil</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MODAL FORM EDIT PROFIL (OVERLAY) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border ${isLight ? 'bg-white border-slate-200' : 'bg-[#131b2f] border-slate-700'}`}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 flex items-center justify-between border-b ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800 bg-[#0f172a]/50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isLight ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${textMain}`}>Edit Data Profil</h3>
                    <p className={`text-[10px] uppercase tracking-widest font-semibold ${textMuted}`}>Perbarui informasi identitas Anda</p>
                  </div>
                </div>
                <button onClick={() => setIsEditOpen(false)} className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}>
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSaveProfile} className="p-6">
                <div className="space-y-5">
                  
                  {/* Field Nama */}
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={inputClass}
                      placeholder="Masukkan nama lengkap..."
                    />
                  </div>

                  {/* Grid 2 Kolom untuk NIP & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Nomor Induk Pegawai (NIP)</label>
                      <input 
                        type="text" 
                        value={formData.nip}
                        onChange={(e) => setFormData({...formData, nip: e.target.value})}
                        className={inputClass}
                        placeholder="Contoh: 19850212..."
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Email Instansi</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={inputClass}
                        placeholder="email@disdikbud.go.id"
                      />
                    </div>
                  </div>

                  {/* Field Lokasi / Unit Kerja */}
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Unit Kerja / Penempatan</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className={inputClass}
                      placeholder="Contoh: Bidang Pembinaan SD"
                    />
                  </div>

                </div>

                {/* Modal Footer / Action */}
                <div className={`mt-8 pt-5 border-t flex items-center justify-end gap-3 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                  <button 
                    type="button" 
                    onClick={() => setIsEditOpen(false)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${isLight ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                  >
                    <Save size={16} /> Simpan Perubahan
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
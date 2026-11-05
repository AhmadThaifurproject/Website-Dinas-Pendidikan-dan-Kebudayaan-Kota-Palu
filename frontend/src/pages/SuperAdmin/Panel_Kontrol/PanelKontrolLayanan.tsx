import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ToggleLeft, ToggleRight, Settings, Info, Lock, 
  Layout, MousePointerClick, FileImage, ListChecks, GitMerge, 
  DownloadCloud, Phone, Clock, MapPin, Search, UserCheck, ChevronDown, Check, Loader2, ListTree, Layers, MessageSquareWarning
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

// --- KONFIGURASI API ---
const API_URL = import.meta.env.VITE_API_URL;

// --- DATA MASTER ---
const KATEGORI_BIDANG = [
  { id: 'paud', label: 'PAUD' },
  { id: 'sd', label: 'SD' },
  { id: 'smp', label: 'SMP' },
  { id: 'kepegawaian', label: 'Kepegawaian' },
  { id: 'ketenagaan', label: 'Ketenagaan GTK' },
  { id: 'perencanaan', label: 'Perencanaan' },
  { id: 'asetdankeuangan', label: 'Aset & Keuangan' },
  { id: 'kebudayaan', label: 'Kebudayaan' },
  { id: 'sub-sekretariat', label: 'Sub Sekretariat' }, 
];

const baseLayananSekolah = [
    { id: "bos", label: "Layanan BOS" },
    { id: "datasekolah", label: "Layanan Data Sekolah" },
    { id: "legalisir", label: "Layanan Legalisir" },
    { id: "mutasi", label: "Layanan Mutasi Siswa" },
    { id: "ppdb", label: "Layanan PPDB" },
    { id: "sapras", label: "Layanan Sarana & Prasarana" },
    { id: "suket", label: "Layanan Surat Keterangan" },
    { id: "suket-gantijazah", label: "Layanan Ganti Ijazah" },
];

const layananPaud = [
  { id: "bos-satuan-pendidikan", label: "Layanan BOS Satuan Pendidikan" },
  { id: "ujian-kesetaraan-paket", label: "Layanan Ujian Kesetaraan Paket" },
  { id: "dak", label: "Layanan Dana DAK" },
  { id: "rekomendasi-lembaga-kursus", label: "Layanan Rekomendasi Lembaga Kursus" },
  { id: "izin-penyelenggaraan", label: "Layanan Izin Penyelenggaraan" },
  { id: "legalisir-skhu", label: "Layanan Legalisir SKHU" },
  { id: "dapodik", label: "Layanan Dapodik" },
  { id: "rekomendasi-pendirian-sekolah", label: "Layanan Rekomendasi Pendirian Sekolah" },
  { id: "bos-sekolah", label: "Layanan BOS Sekolah" },
];

const layananKepegawaian = [
  { id: "cuti", label: "Pelayanan Cuti (Umroh, Haji, Melahirkan)" },
  { id: "izin-belajar", label: "Pelayanan Izin Belajar" },
  { id: "izin-cerai", label: "Pelayanan Izin Perceraian" },
  { id: "bup", label: "Pelayanan Batas Usia Pensiun (BUP)" },
  { id: "kenaikan-pangkat", label: "Pelayanan Kenaikan Pangkat" },
  { id: "mutasi-guru", label: "Pelayanan Mutasi Guru" },
  { id: "pensiun", label: "Pelayanan Pensiun" },
  { id: "rekomendasi-izin-penelitian", label: "Pelayanan Rekomendasi Izin Penelitian" },
  { id: "satya-lencana-karya-satya", label: "Pelayanan Satya Lencana Karya Satya" },
  { id: "sk-gaji-berkala", label: "Pelayanan SK Gaji Berkala" },
  { id: "sk-jabatan-guru", label: "Pelayanan SK Jabatan Guru" },
  { id: "sk-jabatan-kenaikan-fungsional", label: "Pelayanan SK Kenaikan Jabatan Fungsional" },
];

const layananKetenagaan = [
  { id: "nuptk", label: "Pengajuan NUPTK" },
  { id: "sertifikasi-pendidik", label: "Sertifikasi Pendidik" },
];

const layananPerencanaan = [
  { id: "approval-nuptk", label: "Layanan Approval NUPTK" },
  { id: "dapodik", label: "Layanan Dapodik" },
  { id: "nisn", label: "Layanan NISN" },
  { id: "nosapen", label: "Layanan Nomor Satuan Pendidikan" },
  { id: "nosaya", label: "Layanan Nomor Satuan Yayasan" },
];

const layananAsetDanKeuangan = [
  { id: "ajuan-gaji", label: "Layanan Pengajuan Gaji" },
  { id: "ubah-password-pajak", label: "Layanan Perubahan Password Pajak" },
  { id: "verif-dana-bop", label: "Layanan Verifikasi Dana BOP" },
];

const layananKebudayaan = [
  { id: "izin-berkunjung", label: "Izin Berkunjung Cagar Budaya" },
  { id: "penggunaan-halaman", label: "Penggunaan Halaman Cagar Budaya" },
  { id: "informasi-sosial", label: "Informasi via Medsos" },
  { id: "informasi-kantor", label: "Informasi Langsung di Kantor" },
  { id: "pendataan", label: "Pendataan Cagar Budaya" },
  { id: "nomor-induk", label: "Nomor Induk Cagar Budaya" },
  { id: "penemuan-objek", label: "Penemuan Objek Cagar Budaya" },
  { id: "pengembangan-situs", label: "Pengembangan Situs" },
];

const layananSubSekretariat = [
  { id: "tugas-fungsi", label: "Tugas dan Fungsi (SOTK)" },
  { id: "program-kerja", label: "Program Kerja & Anggaran" },
];

const LAYANAN_OPTIONS = {
  paud: layananPaud,
  sd: baseLayananSekolah,
  smp: baseLayananSekolah,
  kepegawaian: layananKepegawaian,
  ketenagaan: layananKetenagaan, 
  perencanaan: layananPerencanaan, 
  asetdankeuangan: layananAsetDanKeuangan,
  kebudayaan: layananKebudayaan,
  'sub-sekretariat': layananSubSekretariat,
};

const FITUR_EDITOR = [
  { id: "tab_navigasi", label: "Pengaturan Tab Navigasi", icon: Layout, desc: "Atur judul dan icon pada menu tab." },
  { id: "portal", label: "Tombol Masuk Portal", icon: MousePointerClick, desc: "Tombol navigasi ke website luar/portal khusus." },
  { id: "file_preview", label: "File Preview Utama", icon: FileImage, desc: "Dokumen PDF/Gambar yang langsung tampil." },
  { id: "persyaratan", label: "Persyaratan Berkas", icon: ListChecks, desc: "Daftar list syarat yang harus disiapkan." },
  { id: "alur", label: "Alur Singkat", icon: GitMerge, desc: "Tahapan grafis untuk mengurus layanan." },
  { id: "download", label: "Area Download", icon: DownloadCloud, desc: "Daftar file yang bisa diunduh publik." },
  { id: "kontak", label: "Kontak Layanan", icon: Phone, desc: "Nomor WhatsApp/Telp penanggung jawab." },
  { id: "jam_operasional", label: "Jam Operasional", icon: Clock, desc: "Jadwal buka/tutup pelayanan." },
  { id: "peta", label: "Link Peta Lokasi", icon: MapPin, desc: "Tautan integrasi ke Google Maps." },
];

interface AdminData {
  id: number | string;
  name: string;
  email: string;
  role?: string;
}

interface FiturState {
    isActive: boolean;
    catatan?: string | null;
}

export default function PanelKontrolLayanan() {
  const isLight = true;

  const [globalLock, setGlobalLock] = useState(false);
  const [selectedBidang, setSelectedBidang] = useState('sd');
  const [selectedLayanan, setSelectedLayanan] = useState('bos');
  
  const [adminList, setAdminList] = useState<AdminData[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  
  const [targetAdmin, setTargetAdmin] = useState<string>("all");
  
  const [isDropdownAdminOpen, setIsDropdownAdminOpen] = useState(false);
  const [isDropdownBidangOpen, setIsDropdownBidangOpen] = useState(false);
  const [isDropdownLayananOpen, setIsDropdownLayananOpen] = useState(false);

  const [fiturStatus, setFiturStatus] = useState<Record<string, FiturState>>({});

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoadingAdmins(true);
      try {
        const response = await axios.get(`${API_URL}/admin/users?role=admin`);
        setAdminList(response.data);
      } catch (error) {
        console.error("Gagal mengambil data admin:", error);
      } finally {
        setIsLoadingAdmins(false);
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchCurrentLocks = async () => {
        try {
            // Jika "all", maka ambil setting umum (misalnya menggunakan referensi all_admin di backend jika ada)
            // Namun idealnya, jika milih all, load state default atau biarkan kosong, karena state per-admin bisa beda-beda.
            // Untuk aman, kita fetch state milik "all" jika backend mendukungnya, atau default kosong.
            const fetchId = targetAdmin === "all" ? "all" : targetAdmin;

            const response = await axios.get(`${API_URL}/admin/feature-lock-teknisi?bidang=${selectedBidang}&layanan=${selectedLayanan}&admin_id=${fetchId}`);
            
            if(response.data) {
                const loadedStatus: Record<string, FiturState> = {};
                
                Object.keys(response.data).forEach(key => {
                    const baseKey = `${selectedBidang}_${selectedLayanan}_${key}`;
                    loadedStatus[`${targetAdmin}_${baseKey}`] = {
                        isActive: !response.data[key].is_locked, 
                        catatan: response.data[key].catatan 
                    };
                });

                setFiturStatus(prev => ({ ...prev, ...loadedStatus }));
            }
        } catch (error) {
            console.error("Gagal mengambil status kunci saat ini", error);
        }
    };

    fetchCurrentLocks();
  }, [selectedBidang, selectedLayanan, targetAdmin]);

  const getTargetAdminLabel = () => {
    if (targetAdmin === "all") return "Semua Admin (All Admin)";
    const admin = adminList.find(a => String(a.id) === targetAdmin);
    return admin ? admin.name : "Pilih Admin";
  };

  const getFeatureData = (fiturId: string): FiturState => {
    const key = `${targetAdmin}_${selectedBidang}_${selectedLayanan}_${fiturId}`;
    return fiturStatus[key] || { isActive: true, catatan: null }; 
  };

  const handleToggleFitur = async (fiturId: string, fiturLabel: string) => {
    if (globalLock) return;
    
    const baseKey = `${selectedBidang}_${selectedLayanan}_${fiturId}`;
    const currentData = getFeatureData(fiturId);
    const isCurrentlyActive = currentData.isActive;
    const targetState = !isCurrentlyActive; 
    
    let teksCatatan = "";

    if (!targetState) {
        const { value: text, isConfirmed } = await Swal.fire({
            title: `Blokir ${fiturLabel}`,
            input: 'textarea',
            inputLabel: 'Tinggalkan catatan untuk Admin (Opsional)',
            inputPlaceholder: 'Ketik catatan mengapa fitur ini dikunci...',
            inputAttributes: {
              'aria-label': 'Ketik catatan di sini'
            },
            showCancelButton: true,
            confirmButtonText: 'Gembok Fitur',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b'
        });

        if (!isConfirmed) return;
        teksCatatan = text || "Diblokir oleh sistem pusat."; 
    }

    // --- FIX LOGIC: Jika target "all", maka state semua list admin di-update ---
    setFiturStatus(prev => {
      const newState = { ...prev };
      const newFeatureData = { isActive: targetState, catatan: !targetState ? teksCatatan : null };

      if (targetAdmin === "all") {
        newState[`all_${baseKey}`] = newFeatureData;
        adminList.forEach(admin => {
            newState[`${admin.id}_${baseKey}`] = newFeatureData;
        });
      } else {
        newState[`${targetAdmin}_${baseKey}`] = newFeatureData;
      }
      return newState;
    });

    try {
        await axios.post(`${API_URL}/admin/feature-lock-teknisi/toggle`, {
            admin_id: targetAdmin, // Di backend harus handle logic jika admin_id == "all", update ke semua user id ber-role admin
            bidang: selectedBidang,
            layanan: selectedLayanan,
            fitur_id: fiturId,
            is_locked: !targetState,
            catatan: !targetState ? teksCatatan : null 
        });
    } catch (error) {
        console.error("Gagal menyimpan perubahan status", error);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Koneksi gagal. Perubahan tidak tersimpan.',
            showConfirmButton: false,
            timer: 3000
        });
        
        // Revert State jika API gagal
        setFiturStatus(prev => {
            const revertState = { ...prev };
            if (targetAdmin === "all") {
               revertState[`all_${baseKey}`] = currentData;
               adminList.forEach(admin => { revertState[`${admin.id}_${baseKey}`] = currentData; });
            } else {
               revertState[`${targetAdmin}_${baseKey}`] = currentData;
            }
            return revertState;
        });
    }
  };

  const currentLayananList = LAYANAN_OPTIONS[selectedBidang as keyof typeof LAYANAN_OPTIONS] || [{id: 'general', label: 'Layanan Umum'}];
  
  const cardClass = `p-6 rounded-2xl shadow-sm border transition-all ${isLight ? "bg-white border-slate-200" : "bg-slate-800 border-slate-700"}`;
  const modernSelectClass = `w-full px-4 py-3 rounded-xl border-2 cursor-pointer font-bold flex items-center justify-between transition-all bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300 overflow-hidden`;
  const modernSelectActive = `border-indigo-500 bg-white ring-4 ring-indigo-500/20`;

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SUPER ADMIN */}
      <div className={`${cardClass} bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-none text-white overflow-hidden relative shadow-2xl shadow-indigo-900/20`}>
        <div className="absolute top-0 right-10 p-8 opacity-5 pointer-events-none">
          <ShieldAlert size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-inner">
                Akses Eksklusif Teknisi
              </span>
              <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Deep Control Panel</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Manajemen Presisi Editor</h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Kendalikan secara mikro fitur apa saja yang boleh diisi oleh Admin. Anda dapat memblokir fitur tertentu dan memberikan <b>catatan blokir</b> kepada mereka.
            </p>
          </div>
          
          <div className="flex items-center gap-5 bg-black/40 p-5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner shrink-0">
            <div className="text-right">
              <p className="text-base font-black text-white mb-0.5">Master Lock</p>
              <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Kunci Seluruh Sistem</p>
            </div>
            <button 
              onClick={() => setGlobalLock(!globalLock)}
              className={`p-4 rounded-xl transition-all duration-300 ${globalLock ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)] scale-105' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
            >
              {globalLock ? <Lock size={28} /> : <Settings size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & TARGET SELECTION */}
      <div className="relative z-50 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        
        {/* DROPDOWN 1: TARGET ADMIN */}
        <div className="relative min-w-0">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">1. Pilih Target Admin</label>
          <div 
            onClick={() => {
                if(!isLoadingAdmins){
                    setIsDropdownAdminOpen(!isDropdownAdminOpen);
                    setIsDropdownBidangOpen(false);
                    setIsDropdownLayananOpen(false);
                }
            }}
            className={`${modernSelectClass} ${isDropdownAdminOpen ? modernSelectActive : ''} ${isLoadingAdmins ? 'opacity-70 cursor-wait' : ''}`}
          >
             <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                {isLoadingAdmins ? (
                   <Loader2 size={18} className="animate-spin text-indigo-600 shrink-0" />
                ) : (
                   <UserCheck size={18} className={`shrink-0 ${targetAdmin === "all" ? "text-indigo-600" : "text-emerald-600"}`} />
                )}
                <span className="truncate block w-full text-left">{isLoadingAdmins ? "Memuat data admin..." : getTargetAdminLabel()}</span>
             </div>
             <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${isDropdownAdminOpen ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {isDropdownAdminOpen && !isLoadingAdmins && (
              <>
                <div className="fixed inset-0 z-[55]" onClick={() => setIsDropdownAdminOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[60] overflow-hidden"
                >
                  <div className="p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                    {/* --- FIX: OPTION 'ALL ADMIN' --- */}
                    <div 
                      onClick={() => { setTargetAdmin("all"); setIsDropdownAdminOpen(false); }}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${targetAdmin === "all" ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex-1 pr-2 min-w-0">
                         <p className={`text-sm font-bold whitespace-normal break-words leading-snug ${targetAdmin === "all" ? 'text-indigo-700' : 'text-slate-700'}`}>Semua Admin (All Admin)</p>
                         <p className="text-[10px] font-medium text-slate-400 mt-0.5 whitespace-normal break-words">Terapkan aturan ke semua operator</p>
                      </div>
                      <div className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center ${targetAdmin === "all" ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                         {targetAdmin === "all" && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>

                    <div className="my-1 border-t border-slate-100"></div>

                    {adminList.length > 0 ? (
                      adminList.map(admin => (
                        <div 
                          key={admin.id}
                          onClick={() => { setTargetAdmin(String(admin.id)); setIsDropdownAdminOpen(false); }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${targetAdmin === String(admin.id) ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-slate-50'}`}
                        >
                          <div className="flex-1 pr-2 min-w-0">
                             <p className={`text-sm font-bold whitespace-normal break-words leading-snug ${targetAdmin === String(admin.id) ? 'text-emerald-700' : 'text-slate-700'}`}>{admin.name}</p>
                             <p className="text-[10px] font-medium text-slate-500 mt-0.5 whitespace-normal break-words">{admin.email}</p>
                          </div>
                          <div className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center ${targetAdmin === String(admin.id) ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'}`}>
                             {targetAdmin === String(admin.id) && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 italic">Tidak ada data admin ditemukan.</div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* DROPDOWN 2: BIDANG UTAMA */}
        <div className="relative min-w-0">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">2. Pilih Bidang Utama</label>
          <div 
            onClick={() => {
                setIsDropdownBidangOpen(!isDropdownBidangOpen);
                setIsDropdownAdminOpen(false);
                setIsDropdownLayananOpen(false);
            }}
            className={`${modernSelectClass} ${isDropdownBidangOpen ? modernSelectActive : ''}`}
          >
             <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                <Layers size={18} className="text-sky-500 shrink-0" />
                <span className="truncate block w-full text-left">Bidang {KATEGORI_BIDANG.find(b => b.id === selectedBidang)?.label}</span>
             </div>
             <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${isDropdownBidangOpen ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {isDropdownBidangOpen && (
              <>
                <div className="fixed inset-0 z-[55]" onClick={() => setIsDropdownBidangOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[60] overflow-hidden"
                >
                  <div className="p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                    {KATEGORI_BIDANG.map(b => (
                        <div 
                          key={b.id}
                          onClick={() => { 
                              setSelectedBidang(b.id); 
                              const firstLayanan = LAYANAN_OPTIONS[b.id as keyof typeof LAYANAN_OPTIONS]?.[0]?.id || 'general';
                              setSelectedLayanan(firstLayanan);
                              setIsDropdownBidangOpen(false); 
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedBidang === b.id ? 'bg-sky-50 border border-sky-100' : 'hover:bg-slate-50'}`}
                        >
                          <div className="flex-1 pr-2 min-w-0">
                            <p className={`text-sm font-bold whitespace-normal break-words leading-snug ${selectedBidang === b.id ? 'text-sky-700' : 'text-slate-700'}`}>Bidang {b.label}</p>
                          </div>
                          <div className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center ${selectedBidang === b.id ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 bg-white'}`}>
                             {selectedBidang === b.id && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* DROPDOWN 3: SPESIFIK LAYANAN */}
        <div className="relative min-w-0">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">3. Pilih Spesifik Layanan</label>
          <div 
            onClick={() => {
                setIsDropdownLayananOpen(!isDropdownLayananOpen);
                setIsDropdownAdminOpen(false);
                setIsDropdownBidangOpen(false);
            }}
            className={`${modernSelectClass} ${isDropdownLayananOpen ? modernSelectActive : ''}`}
          >
             <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                <ListTree size={18} className="text-amber-500 shrink-0" />
                <span className="truncate block w-full text-left">{currentLayananList.find((l:any) => l.id === selectedLayanan)?.label || 'Layanan Umum'}</span>
             </div>
             <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${isDropdownLayananOpen ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {isDropdownLayananOpen && (
              <>
                <div className="fixed inset-0 z-[55]" onClick={() => setIsDropdownLayananOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[60] overflow-hidden"
                >
                  <div className="p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                    {currentLayananList.map((l: any) => (
                        <div 
                          key={l.id}
                          onClick={() => { setSelectedLayanan(l.id); setIsDropdownLayananOpen(false); }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedLayanan === l.id ? 'bg-amber-50 border border-amber-100' : 'hover:bg-slate-50'}`}
                        >
                          <div className="flex-1 pr-2 min-w-0">
                             <p className={`text-sm font-bold whitespace-normal break-words leading-snug ${selectedLayanan === l.id ? 'text-amber-700' : 'text-slate-700'}`}>{l.label}</p>
                          </div>
                          <div className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center ${selectedLayanan === l.id ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'}`}>
                             {selectedLayanan === l.id && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* GRID KONTROL MIKRO */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3 min-w-0">
                <Search className="text-indigo-600 w-6 h-6 shrink-0" />
                <div className="min-w-0">
                   <h2 className="text-xl font-extrabold text-slate-800 truncate">
                     Konfigurasi: <span className="text-indigo-600">{currentLayananList.find((l:any) => l.id === selectedLayanan)?.label || 'Layanan Umum'}</span>
                   </h2>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">
                      TARGET: {targetAdmin === 'all' ? <span className="text-indigo-500">SEMUA ADMIN</span> : <span className="text-emerald-600">{adminList.find(a=>String(a.id) === targetAdmin)?.name}</span>}
                   </p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {FITUR_EDITOR.map((fitur) => {
            const featureData = getFeatureData(fitur.id);
            const isFiturActive = featureData.isActive;
            const catatanBlokir = featureData.catatan; 
            const Icon = fitur.icon;

            return (
              <motion.div 
                key={`${targetAdmin}_${fitur.id}`}
                layout 
                className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 p-6 flex flex-col min-h-[190px]
                  ${!isFiturActive 
                    ? 'bg-rose-50/50 border-rose-200' 
                    : 'bg-white border-indigo-100 shadow-sm hover:shadow-md'
                  }
                `}
              >
                <div className="relative z-20 flex justify-between items-start mb-4">
                  <div className={`p-4 rounded-2xl shrink-0 transition-colors ${isFiturActive ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-100 text-rose-600'}`}>
                    <Icon size={24} />
                  </div>
                  
                  <button 
                    onClick={() => handleToggleFitur(fitur.id, fitur.label)}
                    disabled={globalLock}
                    className={`relative z-30 transition-transform active:scale-90 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isFiturActive ? (
                      <ToggleRight size={44} className="text-emerald-500 drop-shadow-md" strokeWidth={1.5} />
                    ) : (
                      <ToggleLeft size={44} className="text-rose-500 drop-shadow-sm" strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                <div className="relative z-0 min-w-0 flex-1">
                  <h3 className={`font-bold text-base mb-1.5 leading-tight transition-colors ${isFiturActive ? 'text-slate-800' : 'text-rose-900'}`}>
                    {fitur.label}
                  </h3>
                  <p className={`text-xs font-medium leading-relaxed transition-colors ${isFiturActive ? 'text-slate-500' : 'text-rose-700/80'}`}>
                    {fitur.desc}
                  </p>
                </div>

                <AnimatePresence>
                  {!isFiturActive && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }} 
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="bg-white/80 border border-rose-200 rounded-xl p-3.5 flex gap-3 items-start shadow-sm">
                          <Lock size={16} className="text-rose-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                              <span className="block text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">
                                Status: Diblokir
                              </span>
                              <p className="text-xs text-rose-600 font-medium italic break-words leading-relaxed">
                                  "{catatanBlokir || 'Tanpa catatan'}"
                              </p>
                          </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
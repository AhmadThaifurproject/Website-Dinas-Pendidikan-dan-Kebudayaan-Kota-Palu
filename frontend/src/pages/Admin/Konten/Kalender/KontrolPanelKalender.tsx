import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Calendar as CalendarIcon, MapPin, 
  Image as ImageIcon, Search, X, Save, ChevronLeft, ChevronRight,
  History, Clock, MessageSquare, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8000/storage';

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const WEEK_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// --- ATURAN KETAT KATEGORI & WARNA ---
const CATEGORY_RULES = [
  { color: '#ef4444', label: 'Libur Nasional' },
  { color: '#10b981', label: 'Akademik' },
  { color: '#4f46e5', label: 'Rapat Dinas' },
];

interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string; 
  color: string;
  location?: string;
  category: string;
  image?: string; 
}

interface ActionLog {
  id: string;
  type: 'POST' | 'UPDATE' | 'DELETE';
  title: string;
  detail: string; // TAMBAHAN: Untuk menyimpan rincian aktivitas
  time: string;
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#ffffff',
  color: '#1e293b',
  iconColor: '#4f46e5',
  customClass: {
    popup: 'rounded-2xl shadow-xl border border-slate-100 p-4',
    title: 'font-bold text-sm tracking-tight font-sans',
    timerProgressBar: 'bg-indigo-600'
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

function KontrolPanelKalender() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [history, setHistory] = useState<ActionLog[]>([]);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // TAMBAHAN: Untuk menyimpan data lama sebelum diedit guna perbandingan
  const [originalData, setOriginalData] = useState<EventItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formLocName, setFormLocName] = useState("");
  const [formLocUrl, setFormLocUrl] = useState("");

  const [formData, setFormData] = useState<Omit<EventItem, 'id'>>({
    title: '', description: '', date: '', color: '#10b981', location: '', category: 'Akademik', image: ''
  });

  const formatTanggalLengkap = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split('-');
      const d = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      const y = parseInt(parts[2]);
      const dateObj = new Date(y, m - 1, d);
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(dateObj);
    } catch (e) {
      return dateStr;
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('data:image')) return imagePath;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    const baseUrl = IMAGE_BASE_URL.replace(/\/$/, '');
    const cleanPath = imagePath.replace(/^\//, '');
    return `${baseUrl}/${cleanPath}`;
  };

  const parseLocation = (locStr: string | undefined) => {
    if (!locStr) return { name: 'Kota Palu', url: null };
    if (locStr.includes('||')) {
      const parts = locStr.split('||');
      return { name: parts[0] || 'Lihat Lokasi', url: parts[1] };
    }
    if (locStr.startsWith('http')) return { name: 'Buka di Maps', url: locStr };
    return { name: locStr, url: null };
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/kalenders`);
      setEvents(response.data);
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Gagal memuat data dari server' });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- FUNGSI HISTORY YANG DIPERBARUI ---
  const addHistory = (type: ActionLog['type'], title: string, detail: string) => {
    const newLog: ActionLog = {
      id: Math.random().toString(36).substr(2, 9),
      type, title, detail,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setHistory(prev => [newLog, ...prev].slice(0, 10)); // Tampilkan 10 riwayat terakhir
  };

  const { firstDay, days } = (() => {
    const fDay = new Date(year, month, 1).getDay();
    const dCount = new Date(year, month + 1, 0).getDate();
    return { firstDay: fDay, days: dCount };
  })();

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (event?: EventItem) => {
    if (event) {
      setEditingId(event.id);
      setOriginalData(event); // Simpan data asli untuk pembanding
      setFormData({ ...event });
      
      const parsedLoc = parseLocation(event.location);
      setFormLocName(parsedLoc.name === 'Buka di Maps' || parsedLoc.name === 'Kota Palu' ? '' : parsedLoc.name);
      setFormLocUrl(parsedLoc.url || '');

    } else {
      setEditingId(null);
      setOriginalData(null);
      const dateStr = `${selectedDate.getDate()}-${month + 1}-${year}`;
      setFormData({
        title: '', description: '', 
        date: dateStr,
        color: '#10b981', location: '', category: 'Akademik', image: '' 
      });
      setFormLocName("");
      setFormLocUrl("");
    }
    setIsModalOpen(true);
  };

  const handleColorSelect = (rule: typeof CATEGORY_RULES[0]) => {
    setFormData(prev => ({
      ...prev,
      color: rule.color,
      category: rule.label 
    }));
  };

  const handleSave = async () => {
    if (!formData.title) {
      return Toast.fire({ icon: 'warning', title: 'Judul agenda tidak boleh kosong!' });
    }

    const finalLocation = formLocUrl ? `${formLocName}||${formLocUrl}` : formLocName;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description || '');
    data.append('date', formData.date); 
    data.append('color', formData.color);
    data.append('category', formData.category); 
    data.append('location', finalLocation);
    
    // Periksa apakah ada gambar baru yang dipilih
    const isImageChanged = !!fileInputRef.current?.files?.[0];
    if (isImageChanged && fileInputRef.current?.files) {
      data.append('image', fileInputRef.current.files[0]);
    }

    Toast.fire({ icon: 'info', title: 'Memproses data...', timer: 10000 });

    try {
      if (editingId && originalData) {
        data.append('_method', 'PUT'); 
        await axios.post(`${API_URL}/admin/kalenders/${editingId}`, data);
        
        // --- LOGIKA PELACAKAN PERUBAHAN (TRACKING) ---
        let changes = [];
        if (originalData.title !== formData.title) changes.push("Judul");
        if (originalData.date !== formData.date) changes.push("Tanggal");
        if (originalData.category !== formData.category) changes.push("Klasifikasi");
        if (originalData.description !== formData.description) changes.push("Deskripsi");
        if (originalData.location !== finalLocation) changes.push("Lokasi");
        if (isImageChanged) changes.push("Dokumentasi Visual");

        const detailMsg = changes.length > 0 
            ? `Mengubah: ${changes.join(', ')}` 
            : `Menyimpan ulang tanpa perubahan spesifik`;

        addHistory('UPDATE', formData.title, detailMsg);
        Toast.fire({ icon: 'success', title: 'Agenda berhasil diperbarui!' });

      } else {
        await axios.post(`${API_URL}/admin/kalenders`, data);
        addHistory('POST', formData.title, `Menambahkan jadwal baru untuk tanggal ${formData.date}`);
        Toast.fire({ icon: 'success', title: 'Agenda baru berhasil ditambahkan!' });
      }
      fetchEvents();
      setIsModalOpen(false);
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Terjadi kesalahan sistem saat menyimpan.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    Swal.fire({
      title: 'Hapus Agenda?',
      text: `Anda akan menghapus secara permanen agenda "${title}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-[2rem] p-6',
        title: 'text-slate-800 font-bold',
        confirmButton: 'rounded-xl font-bold px-6',
        cancelButton: 'rounded-xl font-bold px-6 text-slate-700'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/admin/kalenders/${id}`);
          addHistory('DELETE', title, "Menghapus agenda dari database kalender");
          fetchEvents();
          Toast.fire({ icon: 'success', title: 'Agenda telah dihapus.' });
        } catch (error) {
          Toast.fire({ icon: 'error', title: 'Gagal menghapus agenda.' });
        }
      }
    });
  };

  const filteredEvents = events.filter((ev: EventItem) => 
    ev.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-700 p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900 tracking-tight leading-none uppercase">Kontrol Panel Agenda</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Monitoring Agenda Pendidikan & Berita Acara</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 text-indigo-700 font-bold text-sm">
            <Clock size={16} />
            <span>{new Date().toLocaleTimeString('id-ID')} WITA</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-indigo-900 text-lg uppercase tracking-widest">{MONTH_NAMES[month]} {year}</h2>
            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-2 hover:bg-white rounded-lg transition-all text-indigo-600"><ChevronLeft size={20}/></button>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-2 hover:bg-white rounded-lg transition-all text-indigo-600"><ChevronRight size={20}/></button>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-7 mb-6">
              {WEEK_DAYS.map(day => <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="h-20 md:h-28 opacity-10" />)}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const dateKey = `${day}-${month + 1}-${year}`; 
                const dayEvents = events.filter(e => e.date === dateKey);
                const isS = selectedDate.getDate() === day && selectedDate.getMonth() === month;
                return (
                  <button key={day} onClick={() => handleDateClick(day)} className={`h-20 md:h-28 rounded-2xl border-2 transition-all flex flex-col p-3 items-start justify-between ${isS ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50/50 border-slate-100 hover:border-indigo-300 text-slate-600 hover:bg-white'}`}>
                    <span className="text-sm font-bold">{day}</span>
                    <div className="w-full flex gap-1 flex-wrap">
                      {dayEvents.slice(0, 3).map((ev, idx) => (<div key={idx} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: isS ? 'rgba(255,255,255,0.4)' : ev.color }} />))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{selectedDate.getDate()}</div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Agenda Terpilih</p>
             </div>
             <button onClick={() => handleOpenModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all"><Plus size={18} /> Tambah Agenda</button>
          </div>
        </div>

        {/* --- UI HISTORY YANG DIPERBARUI --- */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-full min-h-[500px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-slate-100 rounded-2xl text-slate-600"><History size={20} /></div>
            <h3 className="font-bold text-indigo-900 uppercase text-sm tracking-widest">Riwayat Aktivitas</h3>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {history.length > 0 ? (
              history.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl border border-slate-50 bg-[#f8fafc] flex gap-4 items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent opacity-50" />
                  <div className={`w-2.5 h-2.5 rounded-full shadow-sm mt-1 shrink-0 ${log.type === 'DELETE' ? 'bg-red-400' : log.type === 'UPDATE' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${log.type === 'DELETE' ? 'bg-red-50 text-red-500' : log.type === 'UPDATE' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>{log.type}</span>
                       <span className="text-[9px] font-bold text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-xs font-bold text-indigo-950 mb-0.5 leading-tight">{log.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">"{log.detail}"</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-20"><MessageSquare size={40} className="mb-3" /><p className="text-[10px] font-black uppercase tracking-widest">Belum ada aktivitas terekam</p></div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-6 justify-between items-center">
          <h3 className="font-bold text-indigo-900 uppercase text-sm tracking-widest">Database Kalender</h3>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari agenda..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-3 text-sm focus:border-indigo-500 outline-none transition-all shadow-inner" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Visual & Judul</th>
                <th className="px-8 py-5">Pelaksanaan</th>
                <th className="px-8 py-5">Kategori</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((event: EventItem) => {
                const loc = parseLocation(event.location);

                return (
                  <tr key={event.id} className="hover:bg-indigo-50/20 transition-all">
                    <td className="px-8 py-5 flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                        {event.image ? (
                           <img 
                              src={getImageUrl(event.image) || ""} 
                              className="w-full h-full object-cover" 
                              alt="visual"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.parentElement) target.parentElement.innerHTML = '<div class="text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                              }} 
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={24} /></div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-base leading-tight">{event.title}</p>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1.5 flex items-center gap-1.5 truncate max-w-[250px]">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          {loc.url ? (
                            <a href={loc.url} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline transition-all flex items-center gap-1">
                              {loc.name} <ExternalLink size={10} className="text-blue-400"/>
                            </a>
                          ) : (
                            <span>{loc.name}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-black text-indigo-900 text-xs block leading-tight uppercase tracking-tight">
                        {formatTanggalLengkap(event.date)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-black mt-1 block uppercase">
                        {event.date}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span 
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                          event.color === '#ef4444' ? 'bg-red-50 text-red-600 border-red-200' : 
                          event.color === '#10b981' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                          'bg-indigo-50 text-indigo-600 border-indigo-200'
                        }`}
                      >
                        {event.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(event)} className="p-3 bg-white text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100 rounded-xl transition-all"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(event.id, event.title)} className="p-3 bg-white text-slate-400 hover:text-red-600 shadow-sm border border-slate-100 rounded-xl transition-all"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-indigo-950/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-100">
              <div className="px-12 py-8 border-b border-slate-100 flex justify-between items-center bg-white">
                <div><h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter leading-none">{editingId ? 'Edit Data' : 'Agenda Baru'}</h2><p className="text-[10px] text-slate-400 font-black uppercase mt-2">Pilih Penanda untuk Menentukan Kategori</p></div>
                <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"><X size={24}/></button>
              </div>
              <div className="px-12 py-8 overflow-y-auto space-y-10 scrollbar-hide">
                <div className="space-y-3"><label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em] px-1">Judul Agenda</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] px-8 py-4 outline-none focus:border-indigo-500 transition-all font-bold text-slate-700" /></div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em] px-1">Dokumentasi</label>
                  <div className="flex items-center gap-8 p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-[#fcfdfe]">
                    <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-[1.8rem] bg-white border-2 border-slate-100 flex items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:ring-8 hover:ring-indigo-50 transition-all shrink-0">
                      {formData.image ? <img src={getImageUrl(formData.image) || ""} className="w-full h-full object-cover" alt="preview" /> : <Plus size={32} className="text-slate-300" />}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <div><p className="text-sm font-black text-indigo-900 uppercase tracking-tight mb-1">Pilih Gambar</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Format JPG/PNG • Maks 10MB</p></div>
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em] px-1">Nama Lokasi</label>
                       <input type="text" value={formLocName} onChange={e => setFormLocName(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] px-8 py-4 outline-none focus:border-indigo-500 font-bold text-slate-700" placeholder="Taman Vatulemo..." />
                     </div>
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em] px-1">Tautan Maps (Opsional)</label>
                       <input type="url" value={formLocUrl} onChange={e => setFormLocUrl(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] px-8 py-4 outline-none focus:border-indigo-500 font-bold text-slate-700" placeholder="https://maps.app.goo.gl/..." />
                     </div>
                   </div>
                </div>

                <div className="space-y-3"><label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em] px-1">Deskripsi Lengkap</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] px-8 py-4 outline-none focus:border-indigo-500 transition-all font-medium text-slate-700 resize-none scrollbar-hide" placeholder="Detail deskripsi kegiatan..." /></div>
                
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.3em] block text-center">Klasifikasi Agenda</label>
                  <div className="grid grid-cols-3 gap-4">
                    {CATEGORY_RULES.map(rule => (
                      <button 
                        key={rule.color} 
                        type="button" 
                        onClick={() => handleColorSelect(rule)} 
                        className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all text-center ${formData.color === rule.color ? 'border-indigo-500 bg-indigo-50 shadow-md ring-8 ring-indigo-500/5' : 'border-slate-50 bg-slate-50 hover:bg-white'}`}
                      >
                        <div className="w-12 h-12 rounded-full shadow-inner" style={{ backgroundColor: rule.color }} />
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">{rule.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-12 border-t border-slate-50 bg-white">
                <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-[2rem] font-bold shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all text-xs uppercase tracking-[0.3em]"><Save size={22} /> Konfirmasi Simpan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default KontrolPanelKalender;
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Info, MapPin, Tag, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- CONFIG API & IMAGE URL DINAMIS ---
const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8000/storage';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEK_DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string; // Format: "D-M-YYYY"
  color: string;
  location?: string;
  category: string;
  image?: string;
}

function KalenderPublicPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // --- HELPER SINKRONISASI ---
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
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

    const baseUrl = IMAGE_BASE_URL.replace(/\/$/, '');
    const cleanPath = imagePath.replace(/^\//, '');

    return `${baseUrl}/${cleanPath}`;
  };

  const parseLocation = (locStr: string | undefined) => {
    if (!locStr) return { name: 'Kota Palu', url: null };
    if (locStr.includes('||')) {
      const parts = locStr.split('||');
      return { name: parts[0] || 'Lihat Peta', url: parts[1] };
    }
    if (locStr.startsWith('http')) return { name: 'Buka di Maps', url: locStr };
    return { name: locStr, url: null };
  };

  // --- FETCH DATA DARI DATABASE (SINKRONISASI PREFIX PUBLIC) ---
  const fetchPublicEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/public/kalenders`);
      setEvents(response.data);
      
      if (response.data.length > 0) {
        setSelectedEvent(response.data[0]);
      }
    } catch (error) {
      console.error("Gagal memuat agenda publik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicEvents();
  }, []);

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isToday = (day: number | null) => {
    const now = new Date();
    return day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* ================= HEADER / BANNER ================= */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-44 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

            <div className="relative container mx-auto max-w-5xl text-center z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-6">
                    <span className="text-xs">Dinas Pendidikan Kota Palu</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-blue-400 text-xs">Informasi Agenda Publik</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                    Kalender <br className="hidden md:block"/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">Pendidikan Dinas</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
                    Pantau agenda kegiatan, berita acara, dan jadwal akademik penting dalam satu platform terpadu.
                </motion.p>
                <motion.div initial={{ width: 0 }} animate={{ width: "6rem" }} className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></motion.div>
            </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT SECTION ================= */}
      <div className="relative z-30 -mt-32 px-4 container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- KIRI: DETAIL INFORMATION VIEWER --- */}
          <div className="w-full lg:flex-1 min-h-[600px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="h-[400px] bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl border border-slate-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : selectedEvent ? (
                <motion.div 
                  key={selectedEvent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden sticky top-8"
                >
                  {selectedEvent.image && (
                    <div className="h-80 w-full relative bg-slate-100 flex items-center justify-center">
                      <img 
                         src={getImageUrl(selectedEvent.image) || ""} 
                         className="w-full h-full object-cover" 
                         alt="visual-agenda"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.style.display = 'none';
                           if (target.parentElement) target.parentElement.innerHTML = '<div class="text-slate-300 flex flex-col items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span class="text-xs font-bold uppercase tracking-widest">Gambar Tidak Tersedia</span></div>';
                         }} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20 pointer-events-none"></div>
                      <div className="absolute bottom-6 left-8 z-10">
                        <span 
                          className="px-4 py-1.5 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg" 
                          style={{ backgroundColor: selectedEvent.color }}
                        >
                          {selectedEvent.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-8 md:p-12">
                    <div className="flex flex-wrap gap-4 mb-6 text-slate-400 text-sm font-semibold">
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl text-indigo-600 font-bold">
                        <Calendar className="w-4 h-4" />
                        <span>{formatTanggalLengkap(selectedEvent.date)}</span>
                      </div>
                      
                      {/* SINKRONISASI LOKASI MAPS */}
                      {selectedEvent.location && (() => {
                        const loc = parseLocation(selectedEvent.location);
                        return (
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl text-slate-600">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            {loc.url ? (
                              <a href={loc.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-all flex items-center gap-1.5 font-bold">
                                {loc.name} <ExternalLink size={12} className="text-blue-400"/>
                              </a>
                            ) : (
                              <span className="font-bold">{loc.name}</span>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight uppercase tracking-tighter">
                      {selectedEvent.title}
                    </h2>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 text-lg leading-relaxed bg-slate-50 p-8 rounded-[2rem] border border-slate-100 whitespace-pre-line shadow-inner italic font-medium">
                        "{selectedEvent.description || "Tidak ada rincian yang dilampirkan untuk agenda ini."}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[400px] bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-20 text-center">
                  <Info className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-400 font-medium">Pilih salah satu berita acara di kalender untuk melihat detail informasi.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* --- KANAN: CALENDAR NAVIGATOR --- */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 sticky top-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">
                  {MONTH_NAMES[month]} <span className="text-indigo-600">{year}</span>
                </h3>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors text-indigo-600"><ChevronLeft className="w-5 h-5"/></button>
                  <button onClick={handleNextMonth} className="p-2 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors text-indigo-600"><ChevronRight className="w-5 h-5"/></button>
                </div>
              </div>

              <div className="grid grid-cols-7 mb-4 text-center">
                {WEEK_DAYS.map((d, i) => (
                  <span key={i} className={`text-[10px] font-black uppercase tracking-widest ${i === 6 ? 'text-red-500' : 'text-slate-300'}`}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const dateKey = `${day}-${month + 1}-${year}`; // SINKRONISASI FORMAT D-M-YYYY
                  const dayEvents = events.filter(e => e.date === dateKey);
                  const isSActive = selectedEvent?.date === dateKey;

                  return (
                    <div 
                      key={index}
                      onClick={() => day && dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                      className={`
                        relative h-11 flex flex-col items-center justify-center rounded-xl transition-all text-sm font-bold cursor-pointer
                        ${!day ? 'invisible' : ''}
                        ${isSActive ? 'bg-indigo-600 text-white shadow-lg scale-110 z-10' : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md'}
                        ${isToday(day) && !isSActive ? 'border-2 border-indigo-200' : ''}
                        ${day && dayEvents.length === 0 ? 'opacity-40 cursor-default' : ''}
                      `}
                    >
                      {day}
                      {dayEvents.length > 0 && (
                        <span 
                            className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full shadow-sm"
                            style={{ backgroundColor: isSActive ? '#fff' : dayEvents[0].color }}
                        ></span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Agenda {MONTH_NAMES[month]}</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                  {/* SINKRONISASI FILTER BULAN BERDASARKAN FORMAT BARU D-M-YYYY */}
                  {events.filter(e => {
                    const parts = e.date.split('-');
                    return parseInt(parts[1]) === month + 1 && parseInt(parts[2]) === year;
                  }).length > 0 ? (
                    events.filter(e => {
                      const parts = e.date.split('-');
                      return parseInt(parts[1]) === month + 1 && parseInt(parts[2]) === year;
                    }).map(e => (
                        <div 
                          key={e.id}
                          onClick={() => setSelectedEvent(e)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3
                            ${selectedEvent?.id === e.id ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}
                          `}
                        >
                          <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: e.color }}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{e.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{e.date.split('-')[0]} {MONTH_NAMES[month]}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center py-6 opacity-30">
                        <Calendar className="w-8 h-8 mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Tidak ada agenda</p>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default KalenderPublicPage;
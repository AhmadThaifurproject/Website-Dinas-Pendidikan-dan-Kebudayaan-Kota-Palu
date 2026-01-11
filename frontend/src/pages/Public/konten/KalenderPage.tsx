import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEK_DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

interface EventItem {
  title: string;
  description?: string;
  color?: string;
}

function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Record<string, EventItem[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState<EventItem | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', color: '#2563eb' });
  const [realTimeDate, setRealTimeDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const daysInMonth = lastDayOfMonth.getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const today = new Date();
  const isToday = (day: number | null) => {
    if (day === null) return false;
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number | null) => {
    if (!selectedDate || day === null) return false;
    const [selectedMonth, selectedDay] = selectedDate.split('-').map(Number);
    return selectedMonth === month + 1 && selectedDay === day;
  };

  const isRealTimeMidnight = (day: number | null) => {
    if (day === null) return false;
    const now = realTimeDate;
    return now.getHours() === 0 && now.getDate() === day && now.getMonth() === month && now.getFullYear() === year;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeDate(new Date());
    }, 60000); // update setiap menit
    return () => clearInterval(interval);
  }, []);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleAddEvent = () => {
    if (!selectedDate || newEvent.title.trim() === '') return;
    const updated = { ...events };
    if (!updated[selectedDate]) updated[selectedDate] = [];
    updated[selectedDate].push({ ...newEvent });
    setEvents(updated);
    setShowModal(false);
    setNewEvent({ title: '', description: '', color: '#2563eb' });
  };

  const handleDeleteEvent = (dateKey: string, index: number) => {
    const updated = { ...events };
    updated[dateKey].splice(index, 1);
    if (updated[dateKey].length === 0) delete updated[dateKey];
    setEvents(updated);
    setShowDetails(null);
  };

  const renderEvents = (dateKey: string) => {
    const items = events[dateKey];
    if (!items) return null;
    return (
      <div className="mt-1 flex gap-1 justify-center flex-wrap px-1">
        {items.map((e, i) => (
          <div
            key={`${dateKey}-${e.title}-${i}`}
            className="w-1.5 h-1.5 rounded-full cursor-pointer shadow-sm"
            style={{ backgroundColor: e.color }}
            onClick={(ev) => {
                ev.stopPropagation(); 
                setShowDetails(e);
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* ================= HEADER / BANNER SECTION ================= */}
      {/* Visual Design: Mengadopsi style referensi (Dark Theme, Glow Effects, Motion) */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-44 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
            
            {/* --- Background Effects --- */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

            {/* --- Content Container --- */}
            <div className="relative container mx-auto max-w-5xl text-center z-10">
                
                {/* Breadcrumb / Label (Animasi Motion) */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-6"
                >
                    <span className="hover:text-white transition-colors cursor-pointer">Beranda</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-blue-400">Agenda Akademik</span>
                </motion.div>

                {/* Main Title (Gradient & Motion) */}
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
                >
                    Kalender <br className="hidden md:block"/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                    Pendidikan Dinas
                    </span>
                </motion.h1>
                
                {/* Description */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
                >
                    Jadwal akademik, hari libur nasional, dan agenda kegiatan penting Dinas Pendidikan Kota Palu Tahun Ajaran 2024/2025.
                </motion.p>

                {/* Decorative Element (Garis bawah animasi) */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "6rem" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"
                ></motion.div>
            </div>
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      {/* Negative Margin (-mt-32) untuk efek floating card yang menumpuk di atas banner */}
      <div className="relative z-30 -mt-32 pb-20 px-4">
        <div className="container mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col lg:flex-row gap-8 justify-center items-start"
          >
            
            {/* --- KALENDER UTAMA --- */}
            <div className="flex-1 w-full lg:max-w-3xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
               {/* Background accent tipis pada card */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
              
              {/* Header Kalender */}
              <div className="relative z-10 mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">{MONTH_NAMES[month]} <span className="text-indigo-600">{year}</span></h2>
                    <p className="text-slate-500 text-sm mt-1">Kelola jadwal kegiatan anda.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"><ChevronLeft className="h-6 w-6" /></button>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"><ChevronRight className="h-6 w-6" /></button>
                </div>
              </div>

              {/* Nama Hari */}
              <div className="relative z-10 grid grid-cols-7 text-center mb-4">
                {WEEK_DAYS.map((d, i) => (
                    <div key={i} className={`text-sm font-bold uppercase tracking-wider py-2 ${i === 6 ? 'text-red-500' : 'text-slate-400'}`}>
                        {d}
                    </div>
                ))}
              </div>

              {/* Grid Tanggal */}
              <div className="relative z-10 grid grid-cols-7 gap-2 md:gap-4">
                {days.map((day, index) => {
                  const dateKey = `${month + 1}-${day}`;
                  const isCurrentDay = isToday(day);
                  const isSelectedDay = isSelected(day);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => day && setSelectedDate(dateKey)}
                      className={`
                        relative min-h-[80px] md:min-h-[100px] rounded-2xl p-2 transition-all duration-300 cursor-pointer border
                        ${!day ? 'invisible border-none' : ''}
                        ${isSelectedDay 
                            ? 'bg-indigo-50 border-indigo-500 shadow-md transform scale-105 z-10' 
                            : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1'
                        }
                      `}
                    >
                      {day && (
                          <>
                            <div className="flex justify-between items-start">
                                <span className={`
                                    text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                                    ${isCurrentDay ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'text-slate-700'}
                                `}>
                                    {day}
                                </span>
                                {isRealTimeMidnight(day) && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                )}
                            </div>
                            
                            {/* Render Dots Event */}
                            {renderEvents(dateKey)}
                          </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tombol Tambah */}
              <div className="mt-8 flex justify-end relative z-10">
                <button
                  onClick={() => selectedDate && setShowModal(true)}
                  disabled={!selectedDate}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all
                    ${selectedDate 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-indigo-500/30 hover:scale-105' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                  `}
                >
                  <Plus className="h-5 w-5" /> Tambah Acara
                </button>
              </div>
            </div>

            {/* --- SIDEBAR LIST EVENT --- */}
            <div className="w-full lg:w-96">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Agenda Bulan Ini</h3>
                            <p className="text-xs text-slate-500">Daftar kegiatan {MONTH_NAMES[month]}</p>
                        </div>
                    </div>
                    
                    <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(events)
                        .filter(([key]) => key.startsWith(`${month + 1}-`))
                        .flatMap(([key, eventList]) => {
                            const date = key.split('-')[1];
                            return eventList.map((e, i) => (
                            <li key={`${key}-${e.title}-${i}`} className="group relative bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 p-4 rounded-2xl transition-all shadow-sm hover:shadow-md">
                                <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full" style={{ backgroundColor: e.color }}></div>
                                <div className="pl-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">
                                            {date} {MONTH_NAMES[month]}
                                        </span>
                                        <button
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                handleDeleteEvent(key, i);
                                            }}
                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <span className="text-lg leading-none">×</span>
                                        </button>
                                    </div>
                                    <h4 
                                        className="font-semibold text-slate-700 group-hover:text-indigo-700 cursor-pointer transition-colors"
                                        onClick={() => setShowDetails(e)}
                                    >
                                        {e.title}
                                    </h4>
                                </div>
                            </li>
                            ));
                        }) || <li className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">Belum ada acara bulan ini.</li>}
                        
                        {/* Pesan Empty State jika filter kosong */}
                        {Object.entries(events).filter(([key]) => key.startsWith(`${month + 1}-`)).length === 0 && (
                             <li className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">Belum ada acara bulan ini.</li>
                        )}
                    </ul>
                </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* --- MODALS (Tetap Minimalis) --- */}
      {/* Modal Tambah Acara */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-200">
            <button className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-500 transition-all" onClick={() => setShowModal(false)}>✕</button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-2">Buat Agenda Baru</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan</label>
                <input
                    type="text"
                    placeholder="Contoh: Rapat Koordinasi"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                <textarea
                    placeholder="Detail kegiatan..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Label Warna</label>
                <div className="flex gap-3">
                    {['#2563eb', '#16a34a', '#dc2626', '#d97706', '#9333ea'].map((c) => (
                        <button
                            key={c}
                            onClick={() => setNewEvent({ ...newEvent, color: c })}
                            className={`w-8 h-8 rounded-full border-2 ${newEvent.color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
              </div>
              <button
                onClick={handleAddEvent}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all mt-2"
              >
                Simpan Agenda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Acara */}
      {showDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200 border-t-8" style={{ borderColor: showDetails.color }}>
            <button className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all" onClick={() => setShowDetails(null)}>✕</button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pr-8">{showDetails.title}</h2>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                {showDetails.description ? (
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{showDetails.description}</p>
                ) : (
                <p className="text-slate-400 italic text-center">Tidak ada deskripsi tambahan.</p>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KalenderPage;
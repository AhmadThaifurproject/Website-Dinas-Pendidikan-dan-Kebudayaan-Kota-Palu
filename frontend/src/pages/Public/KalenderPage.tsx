import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

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
      <div className="mt-1 flex gap-1 justify-center">
        {items.map((e, i) => (
          <div
            key={`${dateKey}-${e.title}-${i}`}
            className="w-2 h-2 rounded-full cursor-pointer"
            style={{ backgroundColor: e.color }}
            onClick={() => setShowDetails(e)}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[45vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">Kalender Pendidikan</h1>
          <p className="text-xl">Tahun Ajaran 2024/2025</p>
        </div>
      </section>

      {/* Konten */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kelola Acara Pendidikan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tambahkan dan tandai acara penting untuk pengelolaan kegiatan sepanjang tahun ajaran.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 justify-center">
            {/* Kalender */}
            <div className="max-w-xl w-full rounded-xl bg-white p-6 shadow-xl border border-gray-200">
              <div className="mb-6 flex items-center justify-between">
                <button onClick={handlePrevMonth}><ChevronLeft className="h-5 w-5 text-gray-700" /></button>
                <h2 className="text-lg font-semibold uppercase">{MONTH_NAMES[month]} {year}</h2>
                <button onClick={handleNextMonth}><ChevronRight className="h-5 w-5 text-gray-700" /></button>
              </div>
              <div className="grid grid-cols-7 text-center text-sm font-bold text-gray-600">
                {WEEK_DAYS.map((d, i) => <div key={i} className="py-1">{d}</div>)}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-y-2 text-center text-sm">
                {days.map((day, index) => {
                  const dateKey = `${month + 1}-${day}`;
                  return (
                    <div
                      key={index}
                      onClick={() => day && setSelectedDate(dateKey)}
                      className={`relative py-2 px-1 rounded-full transition-all cursor-pointer
                        ${day ? 'hover:bg-indigo-100' : 'text-transparent'}
                        ${isToday(day) ? 'bg-yellow-400' : ''}
                        ${isSelected(day) ? 'border-2 border-indigo-600' : ''}
                      `}
                    >
                      {isRealTimeMidnight(day) && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 w-1.5 h-1.5 rounded-full animate-pulse"></div>
                      )}
                      <div>{day || '.'}</div>
                      {day && renderEvents(dateKey)}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => selectedDate && setShowModal(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" /> Tambah Acara
                </button>
              </div>
            </div>

            {/* List Event */}
            <div className="max-w-sm w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Acara Bulan Ini</h3>
              <ul className="space-y-2 text-gray-700">
                {Object.entries(events)
                  .filter(([key]) => key.startsWith(`${month + 1}-`))
                  .flatMap(([key, eventList]) => {
                    const date = key.split('-')[1];
                    return eventList.map((e, i) => (
                      <li key={`${key}-${e.title}-${i}`} className="border-l-4 pl-3 relative" style={{ borderColor: e.color }}>
                        <span className="font-semibold cursor-pointer" onClick={() => setShowDetails(e)}>
                          {date} {MONTH_NAMES[month]}:
                        </span> {e.title}
                        <button
                          onClick={() => handleDeleteEvent(key, i)}
                          className="absolute top-1 right-1 text-xs text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </li>
                    ));
                  }) || <li className="text-gray-400 italic">Tidak ada acara bulan ini</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Acara */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>✕</button>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Tambah Acara Baru</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Judul acara..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Deskripsi (opsional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Warna Penanda</label>
                <input
                  type="color"
                  value={newEvent.color}
                  onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                  className="h-10 w-20 border border-gray-300 rounded"
                />
              </div>
              <button
                onClick={handleAddEvent}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
              >Tambah Acara</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Acara */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setShowDetails(null)}>✕</button>
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">{showDetails.title}</h2>
            {showDetails.description ? (
              <p className="text-gray-700 whitespace-pre-wrap">{showDetails.description}</p>
            ) : (
              <p className="text-gray-400 italic">Tidak ada deskripsi.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default KalenderPage;

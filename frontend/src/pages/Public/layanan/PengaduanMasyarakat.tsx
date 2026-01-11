import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  Clock, 
  FileCheck, 
  Send, 
  UploadCloud, 
  User, 
  Phone, 
  FileText, 
  Briefcase,
  Info
} from "lucide-react";

const PengaduanMasyarakat = () => {
  const [formData, setFormData] = useState<{
    nama: string;
    kontak: string;
    jenisPemohon: string;
    judul: string;
    isiLaporan: string;
    identitas: File | null;
    dokumenOrganisasi: File | null;
    buktiPendukung: File | null;
  }>({
    nama: "",
    kontak: "",
    jenisPemohon: "Individu",
    judul: "",
    isiLaporan: "",
    identitas: null,
    dokumenOrganisasi: null,
    buktiPendukung: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("kontak", formData.kontak);
    formPayload.append("jenis_pemohon", formData.jenisPemohon);
    formPayload.append("judul", formData.judul);
    formPayload.append("isi_laporan", formData.isiLaporan);
    if (formData.identitas) formPayload.append("identitas", formData.identitas);
    if (formData.dokumenOrganisasi)
      formPayload.append("dokumenOrganisasi", formData.dokumenOrganisasi);
    if (formData.buktiPendukung)
      formPayload.append("buktiPendukung", formData.buktiPendukung);

    try {
      // Simulasi API call (ganti dengan endpoint asli Anda)
      // const response = await axios.post("/api/pengaduan", formPayload, ...);
      console.log("Mengirim data...");
      alert("Laporan Anda telah dikirim. Terima kasih.");

      setFormData({
        nama: "",
        kontak: "",
        jenisPemohon: "Individu",
        judul: "",
        isiLaporan: "",
        identitas: null,
        dokumenOrganisasi: null,
        buktiPendukung: null,
      });
    } catch (error) {
      console.error("Gagal mengirim laporan:", error);
      alert("Gagal mengirim laporan. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* ================= HEADER / BANNER SECTION ================= */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-44 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          
          {/* --- Background Effects --- */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

          {/* --- Content Container --- */}
          <div className="relative container mx-auto max-w-5xl text-center z-10">
            
            {/* Breadcrumb */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-6"
            >
              <Link to="/" className="hover:text-white transition-colors duration-300">Beranda</Link>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">Pengaduan Masyarakat</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Layanan Pengaduan <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                & Aspirasi Publik
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Saluran resmi untuk menyampaikan aspirasi, keluhan, dan saran terkait layanan Dinas Pendidikan Kota Palu demi peningkatan kualitas pendidikan.
            </motion.p>

             {/* Decorative Element */}
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
      <div className="relative z-30 -mt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
            
            {/* --- Info Cards (Jam & Syarat) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Jam Operasional */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-yellow-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Jam Operasional</h2>
                        </div>
                        <div className="space-y-3 text-slate-600">
                            <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                                <span>Senin – Jumat</span>
                                <span className="font-semibold text-slate-800">08.00 – 16.00 WITA</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                                <span>Waktu Istirahat</span>
                                <span className="font-semibold text-slate-800">12.00 – 13.00 WITA</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sabtu & Minggu</span>
                                <span className="font-semibold text-red-500">Tutup</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Persyaratan */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-blue-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                                <FileCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Persyaratan Berkas</h2>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                <span><strong>Individu:</strong> Scan KTP/SIM/Paspor pemohon.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                <span><strong>Kelompok:</strong> Scan Identitas seluruh anggota.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                <span><strong>Organisasi:</strong> Legalitas Hukum, KTP Pengurus, AD/ART.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                <span><strong>Bukti:</strong> Foto, Dokumen, atau Rekaman terkait.</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>

            {/* --- Formulir Pengaduan --- */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden"
            >
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide mb-3 border border-indigo-100">
                            FORMULIR ONLINE
                        </span>
                        <h2 className="text-3xl font-bold text-slate-800">Sampaikan Laporan Anda</h2>
                        <p className="text-slate-500 mt-2">Identitas pelapor akan kami jaga kerahasiaannya.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama */}
                            <div>
                                <label htmlFor="nama" className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        id="nama"
                                        type="text"
                                        name="nama"
                                        value={formData.nama}
                                        onChange={handleChange}
                                        required
                                        placeholder="Sesuai kartu identitas"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"
                                    />
                                </div>
                            </div>

                            {/* Kontak */}
                            <div>
                                <label htmlFor="kontak" className="block text-sm font-semibold text-slate-700 mb-2">Nomor Telepon / Email</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        id="kontak"
                                        type="text"
                                        name="kontak"
                                        value={formData.kontak}
                                        onChange={handleChange}
                                        required
                                        placeholder="08xxxxxxxxxx / email@contoh.com"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Jenis Pemohon */}
                        <div>
                            <label htmlFor="jenisPemohon" className="block text-sm font-semibold text-slate-700 mb-2">Jenis Pemohon</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <select
                                    id="jenisPemohon"
                                    name="jenisPemohon"
                                    value={formData.jenisPemohon}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700 appearance-none"
                                >
                                    <option value="Individu">Individu</option>
                                    <option value="Kelompok Orang">Kelompok Orang</option>
                                    <option value="Organisasi Berbadan Hukum">Organisasi Berbadan Hukum</option>
                                </select>
                            </div>
                        </div>

                        {/* Judul */}
                        <div>
                            <label htmlFor="judul" className="block text-sm font-semibold text-slate-700 mb-2">Judul Laporan</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    id="judul"
                                    type="text"
                                    name="judul"
                                    value={formData.judul}
                                    onChange={handleChange}
                                    required
                                    placeholder="Singkat dan jelas"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Isi Laporan */}
                        <div>
                            <label htmlFor="isiLaporan" className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Lengkap</label>
                            <div className="relative">
                                <textarea
                                    id="isiLaporan"
                                    name="isiLaporan"
                                    value={formData.isiLaporan}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                    placeholder="Jelaskan kronologi, lokasi, dan pihak yang terlibat..."
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700 resize-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {/* Upload Identitas */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Identitas (Wajib)</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200 group-hover:border-indigo-400 transition-colors pointer-events-none"></div>
                                    <input
                                        id="identitas"
                                        type="file"
                                        name="identitas"
                                        onChange={handleFileChange}
                                        accept=".jpg,.png,.pdf"
                                        required
                                        className="relative z-10 w-full p-8 opacity-0 cursor-pointer"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <UploadCloud className="w-8 h-8 text-indigo-400 mb-1" />
                                        <span className="text-xs text-slate-500 text-center px-4">
                                            {formData.identitas ? formData.identitas.name : "Klik untuk upload KTP/SIM (Max 2MB)"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Bukti */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bukti Pendukung (Opsional)</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 group-hover:border-slate-400 transition-colors pointer-events-none"></div>
                                    <input
                                        id="buktiPendukung"
                                        type="file"
                                        name="buktiPendukung"
                                        onChange={handleFileChange}
                                        accept=".jpg,.png,.pdf,.doc,.docx,.mp4"
                                        className="relative z-10 w-full p-8 opacity-0 cursor-pointer"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <Info className="w-8 h-8 text-slate-400 mb-1" />
                                        <span className="text-xs text-slate-500 text-center px-4">
                                            {formData.buktiPendukung ? formData.buktiPendukung.name : "Upload Foto/Dokumen Pendukung"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {formData.jenisPemohon === "Organisasi Berbadan Hukum" && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Dokumen Organisasi</label>
                                <input
                                    id="dokumenOrganisasi"
                                    type="file"
                                    name="dokumenOrganisasi"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        )}

                        <div className="pt-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Kirim Laporan Sekarang
                            </motion.button>
                        </div>

                    </form>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
};

export default PengaduanMasyarakat;
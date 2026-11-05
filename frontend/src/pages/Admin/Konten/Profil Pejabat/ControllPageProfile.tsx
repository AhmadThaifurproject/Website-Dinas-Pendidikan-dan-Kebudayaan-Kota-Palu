import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  User, 
  Briefcase, 
  Image as ImageIcon, 
  List,
  Upload,
} from 'lucide-react';

// 1. Interface Data
interface Profile {
  id: string;
  name: string;
  title: string;
  // Subtitle SUDAH HILANG
  image: string; 
  description: string[]; 
  category: 'pimpinan' | 'bidang';
}

const ControllPageProfile: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<'pimpinan' | 'bidang'>('pimpinan');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Profile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '', title: '', image: '', description: [''], category: 'pimpinan'
  });

  // --- ENVIRONMENT VARIABLES ---
  const API_URL = import.meta.env.VITE_API_URL; 
  // Base URL untuk gambar (menghapus /api di belakang)
  const STORAGE_BASE = API_URL?.replace(/\/api$/, '') || ''; 

  // --- HELPER GAMBAR DENGAN DEBUG (UPDATE) ---
  const getFullImageUrl = (path: string | undefined) => {
    if (!path) return "";
    
    // 1. Preview Base64 (Saat upload baru)
    if (path.startsWith('data:')) return path; 
    
    // 2. URL Lengkap (Jika database sudah menyimpan full path)
    if (path.startsWith('http')) return path;

    // 3. Gabungkan URL & Bersihkan Slash
    // Hapus slash depan agar tidak double // (misal: /profiles/img.jpg jadi profiles/img.jpg)
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const finalUrl = `${STORAGE_BASE}/storage/${cleanPath}`;

    // --- DEBUG: UNCOMMENT BARIS INI UNTUK MELIHAT URL DI CONSOLE (F12) ---
    // console.log("Request Gambar:", finalUrl); 
    
    return finalUrl;
  };

  // --- FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Gunakan timestamp agar browser tidak men-cache request (gambar selalu fresh)
      const res = await axios.get(`${API_URL}/public/profiles?t=${new Date().getTime()}`);
      setProfiles(res.data);
    } catch (err) { 
      console.error("Gagal mengambil data profil:", err); 
    }
  };

  // --- HANDLERS ---
  const handleOpenModal = (profile?: Profile) => {
    if (profile) {
      setCurrentEdit(profile);
      setFormData({ 
        ...profile,
        // Pastikan description dibaca sebagai array
        description: Array.isArray(profile.description) 
          ? profile.description 
          : JSON.parse((profile.description as any) || '[]')
      });
    } else {
      setCurrentEdit(null);
      // Reset form bersih
      setFormData({ 
        name: '', title: '', image: '', 
        description: [''], category: activeTab 
      });
    }
    setIsModalOpen(true);
  };

  // Preview Gambar Lokal
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simpan Base64 ke state agar muncul di preview modal SEGERA
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Description Logic
  const updateDescriptionPoint = (index: number, value: string) => {
    const newDesc = [...(formData.description || [])];
    newDesc[index] = value;
    setFormData({ ...formData, description: newDesc });
  };

  const addDescriptionPoint = () => {
    setFormData({ ...formData, description: [...(formData.description || []), ''] });
  };

  const removeDescriptionPoint = (index: number) => {
    const newDesc = (formData.description || []).filter((_, i) => i !== index);
    setFormData({ ...formData, description: newDesc });
  };

  // --- SAVE DATA ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name || '');
    data.append('title', formData.title || '');
    data.append('category', formData.category || 'pimpinan');
    data.append('description', JSON.stringify(formData.description));

    // PENTING: Hanya kirim file jika user memilih file baru di input
    if (fileInputRef.current?.files?.[0]) {
      data.append('image', fileInputRef.current.files[0]);
    }

    try {
      if (currentEdit) {
        // Update: Gunakan spoofing PUT
        data.append('_method', 'PUT'); 
        await axios.post(`${API_URL}/admin/profiles/${currentEdit.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create: POST biasa
        await axios.post(`${API_URL}/admin/profiles`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setIsModalOpen(false);
      
      // Tunggu sebentar agar server selesai memproses gambar sebelum fetch ulang
      setTimeout(() => {
        fetchData();
        alert("Berhasil menyimpan data!");
      }, 500);

    } catch (err: any) { 
      console.error("Error Detail:", err);
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        let msg = "Gagal Validasi:\n";
        Object.keys(errors).forEach((key) => { msg += `- ${errors[key][0]}\n`; });
        alert(msg);
      } else {
        alert("Terjadi kesalahan server.");
      }
    }
  };

  // --- DELETE DATA ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus data ini?")) {
      try {
        await axios.delete(`${API_URL}/admin/profiles/${id}`);
        fetchData(); 
      } catch (err) {
        alert("Gagal menghapus data.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Panel Kelola Profil Pejabat</h1>
            <p className="text-slate-500 max-w-xl">Kelola data pimpinan dan kepala bidang.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-200"
          >
            <Plus size={20} /> Tambah Data Pejabat
          </button>
        </header>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          {(['pimpinan', 'bidang'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-wider">Pejabat</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-wider">Jabatan</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-wider">Tugas / Deskripsi</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.filter(p => p.category === activeTab).map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative border border-slate-200">
                          {item.image ? (
                            <img 
                              // GUNAKAN HELPER DISINI
                              src={getFullImageUrl(item.image)} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                // Fallback jika gambar gagal loading (akan tampil inisial nama)
                                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + item.name;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20}/></div>
                          )}
                        </div>
                        <div className="font-bold text-slate-800">{item.name}</div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-semibold text-slate-700">{item.title}</div>
                    </td>
                    <td className="p-6 max-w-xs">
                       <ul className="text-xs text-slate-500 space-y-1">
                          {item.description && item.description.slice(0, 2).map((d, i) => (
                            <li key={i} className="truncate">• {d}</li>
                          ))}
                          {item.description && item.description.length > 2 && <li className="text-blue-400 font-medium">+{item.description.length - 2} poin lainnya...</li>}
                       </ul>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center items-center gap-1">
                        <button onClick={() => handleOpenModal(item)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Pencil size={18} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh]">
              
              <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-2xl font-black text-slate-800">{currentEdit ? 'Update Profil' : 'Profil Baru'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1 tracking-widest">Foto Pejabat</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer relative overflow-hidden group"
                  >
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                    {formData.image ? (
                      <>
                        <img 
                          // GUNAKAN HELPER DISINI JUGA (Preview Modal)
                          src={getFullImageUrl(formData.image)} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-2xl shadow-md" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity">Ganti Foto</div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-all"><Upload size={24} /></div>
                        <div className="text-center">
                          <p className="font-bold text-slate-700 text-sm">Upload Foto Pejabat</p>
                          <p className="text-xs text-slate-400">Klik atau seret ke sini</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1">Jabatan Utama</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-2 tracking-widest"><List size={14}/> Tugas Pokok & Fungsi</label>
                    <button type="button" onClick={addDescriptionPoint} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-blue-100 transition-all">+ Tambah Point</button>
                  </div>
                  <div className="space-y-3">
                    {formData.description?.map((point, index) => (
                      <div key={index} className="flex gap-2 group animate-fade-in">
                        <input 
                          className="flex-1 px-5 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                          placeholder={`Contoh: Mengawasi program...`}
                          value={point}
                          onChange={(e) => updateDescriptionPoint(index, e.target.value)}
                        />
                        {formData.description!.length > 1 && (
                          <button type="button" onClick={() => removeDescriptionPoint(index)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3">
                  <Save size={22} /> {currentEdit ? 'Update Perubahan' : 'Simpan Profil'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ControllPageProfile;
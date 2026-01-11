import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { 
  Save, Link as LinkIcon, RefreshCw, ExternalLink, // MonitorPlay dihapus
  ToggleLeft, ToggleRight, Plus, Trash2, Star,
  Image as ImageIcon, Globe, AlertTriangle, 
  CheckCircle2, XCircle, Film, Youtube, Instagram, Calendar, UploadCloud
} from "lucide-react";

// --- TIPE DATA ---
interface MediaMeta {
  type: "image" | "video" | "external_video" | "link";
  provider?: string;
  previewUrl?: string; 
  caption?: string;    
  streamUrl?: string;  
}

interface AgendaItem {
  id: string;
  type: "main" | "grid";
  title: string;
  description: string;
  dateLocation?: string; 
  captionSource: "auto" | "manual"; 
  mediaUrl: string; 
  targetUrl: string;
  buttonText: string;
  mediaMeta?: MediaMeta;
  
  // Field UI Control
  uploadSource?: "url" | "local"; 
  mediaFile?: File; 
}

// --- HELPER: DETEKSI TIPE MEDIA ---
const detectMediaType = (url: string): MediaMeta | undefined => {
  if (!url) return undefined;
  
  // Blob URL (Lokal)
  if (url.startsWith("blob:")) {
     return { type: "image", provider: "Local Preview" }; 
  }

  // URL Eksternal
  if (url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)) {
    let videoId = null;
    try {
        if (url.includes("v=")) videoId = url.split('v=')[1]?.split('&')[0];
        else if (url.includes("youtu.be/")) videoId = url.split('youtu.be/')[1]?.split('?')[0];
        else if (url.includes("/embed/")) videoId = url.split('/embed/')[1]?.split('?')[0];
    } catch(e) {}
    return { 
      type: "external_video", 
      provider: "YouTube", 
      previewUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "" 
    };
  }
  if (url.match(/instagram\.com/)) return { type: "link", provider: "Instagram" };
  if (url.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i)) return { type: "video", provider: "Video File", streamUrl: url };
  if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) return { type: "image", provider: "Image File", previewUrl: url };
  
  return { type: "link", provider: "External Link" };
};

// --- KOMPONEN: MEDIA CONTENT ---
const MediaContent = ({ item, className }: { item: AgendaItem; className?: string }) => {
  const meta = item.mediaMeta; 
  const url = item.mediaUrl;

  if (!url) {
    return (
      <div className={`w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 ${className}`}>
        <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
        <span className="text-[10px] font-bold tracking-widest opacity-40 uppercase">No Media</span>
      </div>
    );
  }

  if (meta?.type === 'video') {
    return (
      <div className={`relative w-full h-full bg-black overflow-hidden flex items-center justify-center ${className}`}>
        <video src={meta.streamUrl || url} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-lg scale-110" muted loop />
        <video src={meta.streamUrl || url} className="relative z-10 w-full h-full object-contain" muted autoPlay loop playsInline />
      </div>
    );
  }

  if (meta?.previewUrl || meta?.type === 'image' || (meta?.type === 'external_video' && meta.provider === 'YouTube')) {
    const imgSrc = meta?.previewUrl || url;
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center group ${className} overflow-hidden`}>
        <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-50 blur-xl scale-125" style={{ backgroundImage: `url('${imgSrc}')` }}></div>
        <img src={imgSrc} alt="Preview" className="relative z-10 w-full h-full object-contain transition-opacity duration-300" onError={(e) => {e.currentTarget.style.display='none'}} />
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 ${className}`}>
       <Globe className="text-gray-300 w-8 h-8 mb-2" />
       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{meta?.provider || "External Link"}</span>
    </div>
  );
};

// --- KOMPONEN: SMART LINK STATUS ---
const SmartLinkStatus = ({ meta }: { meta?: MediaMeta }) => {
  if (!meta) return null;
  const config: any = {
    YouTube: { color: "bg-red-50 text-red-600 border-red-200", icon: <Youtube size={14}/>, label: "YouTube Video" },
    "Video File": { color: "bg-blue-50 text-blue-600 border-blue-200", icon: <Film size={14}/>, label: "File Video" },
    "Image File": { color: "bg-green-50 text-green-600 border-green-200", icon: <ImageIcon size={14}/>, label: "File Gambar" },
    Instagram: { color: "bg-pink-50 text-pink-600 border-pink-200", icon: <Instagram size={14}/>, label: "Instagram" },
    "External Link": { color: "bg-gray-50 text-gray-600 border-gray-200", icon: <Globe size={14}/>, label: "Link Web" },
    "Local Preview": { color: "bg-purple-50 text-purple-600 border-purple-200", icon: <UploadCloud size={14}/>, label: "Upload Lokal" }
  };
  const style = config[meta.provider || "External Link"] || config["External Link"];
  return (
    <div className={`mt-2 flex items-center justify-between px-3 py-2 rounded-lg border ${style.color} transition-all duration-300 animate-in fade-in slide-in-from-top-2`}>
      <div className="flex items-center gap-2">
        {style.icon}
        <span className="text-xs font-bold">{style.label}</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] opacity-70"><CheckCircle2 size={12}/><span>Ready</span></div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const AgendaControl = () => {
  const [data, setData] = useState<AgendaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Fetch
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/agenda");
      if (res.data.length > 0) {
        const normalizedData = res.data.map((item: AgendaItem) => ({
            ...item,
            uploadSource: item.uploadSource || "url" 
        }));
        setData(normalizedData);
        const main = normalizedData.find((i: AgendaItem) => i.type === "main");
        setSelectedId(main ? main.id : normalizedData[0].id);
      } else {
        const initData: AgendaItem[] = [{ id: "main-1", type: "main", title: "", description: "", captionSource: "auto", mediaUrl: "", targetUrl: "#", buttonText: "DAFTAR SEKARANG", uploadSource: "url" }];
        setData(initData);
        setSelectedId("main-1");
      }
      setLoading(false);
    } catch (err) {
      toast.error("Gagal koneksi server");
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const activeItem = data.find((i) => i.id === selectedId) || data[0];

  const handleUpdate = (field: keyof AgendaItem, value: any) => {
    setData((prev) => prev.map((item) => {
      if (item.id === selectedId) {
        const updatedItem = { ...item, [field]: value };
        
        // Logika ganti URL (hanya mode URL) - Meta dasar diupdate disini
        if (field === 'mediaUrl' && item.uploadSource === 'url') {
          const detectedMeta = detectMediaType(value);
          // Kita spread item.mediaMeta agar caption lama tidak langsung hilang jika provider sama
          updatedItem.mediaMeta = detectedMeta ? { ...item.mediaMeta, ...detectedMeta } : undefined;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  // --- LOGIKA AUTO-CAPTION (FIXED TYPESCRIPT ERROR) ---
  useEffect(() => {
    // Jalankan hanya jika: Mode URL, Caption AUTO, dan URL valid
    if (activeItem?.uploadSource === 'url' && activeItem?.captionSource === 'auto' && activeItem?.mediaUrl) {
        const url = activeItem.mediaUrl;
        
        // Debounce 1 detik
        const timer = setTimeout(async () => {
            // Set status loading
            setData(prev => prev.map(item => {
                if (item.id === selectedId) {
                    // FIX: Definisikan base meta agar TS tidak bingung
                    const baseMeta: MediaMeta = item.mediaMeta || { type: 'link' };
                    return {
                        ...item,
                        mediaMeta: { 
                            ...baseMeta,
                            caption: "Mengambil data..." 
                        }
                    };
                }
                return item;
            }));

            try {
                // Panggil API Backend Laravel
                const res = await axios.post("http://localhost:8000/api/fetch-metadata", { url });
                const fetchedCaption = res.data.caption;

                if (fetchedCaption) {
                    setData(prev => prev.map(item => {
                        if (item.id === selectedId) {
                            const baseMeta: MediaMeta = item.mediaMeta || { type: 'link' };
                            return {
                                ...item,
                                mediaMeta: {
                                    ...baseMeta,
                                    caption: fetchedCaption
                                }
                            };
                        }
                        return item;
                    }));
                    toast.success("Caption berhasil diambil!");
                } else {
                     // Fallback
                     setData(prev => prev.map(item => {
                        if (item.id === selectedId) {
                             const baseMeta: MediaMeta = item.mediaMeta || { type: 'link' };
                             return {
                                 ...item,
                                 mediaMeta: { ...baseMeta, caption: "Tidak ada deskripsi otomatis" }
                             };
                        }
                        return item;
                     }));
                }

            } catch (e) {
                console.error("Gagal fetch metadata", e);
                // Error Handler
                setData(prev => prev.map(item => {
                    if (item.id === selectedId) {
                         const baseMeta: MediaMeta = item.mediaMeta || { type: 'link' };
                         return {
                             ...item,
                             mediaMeta: { ...baseMeta, caption: "" }
                         };
                    }
                    return item;
                }));
            }
        }, 1000);

        return () => clearTimeout(timer);
    }
  }, [activeItem?.mediaUrl, activeItem?.captionSource, activeItem?.uploadSource, selectedId]);


  // --- HANDLER UPLOAD FILE LOKAL ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    let metaType: MediaMeta['type'] = "image";
    if (file.type.startsWith("video/")) metaType = "video";

    const newMeta: MediaMeta = {
        type: metaType,
        provider: "Local Preview",
        previewUrl: metaType === "image" ? blobUrl : undefined,
        streamUrl: metaType === "video" ? blobUrl : undefined,
        caption: file.name // Auto caption dari nama file
    };

    setData((prev) => prev.map((item) => {
        if (item.id === selectedId) {
            return {
                ...item,
                mediaUrl: blobUrl, 
                mediaFile: file,
                mediaMeta: newMeta,
                uploadSource: "local"
            };
        }
        return item;
    }));
  };

  const toggleUploadSource = (source: "url" | "local") => {
      handleUpdate("uploadSource", source);
      if(source === "local") handleUpdate("mediaUrl", "");
  };

  const handleSave = () => {
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('_method', 'PUT'); 

        const itemsToSave = data.map(item => {
            const { mediaFile, ...rest } = item; 
            return rest;
        });
        
        formData.append('items', JSON.stringify(itemsToSave));

        data.forEach((item) => {
            if (item.uploadSource === 'local' && item.mediaFile) {
                formData.append(`file_${item.id}`, item.mediaFile);
            }
        });

        await axios.post("http://localhost:8000/api/agenda", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        await fetchData(); 
        const channel = new BroadcastChannel('agenda_updates');
        channel.postMessage({ action: 'refresh_agenda' });
        channel.close();
        resolve("Sukses");
      } catch (error: any) {
        console.error("Error Detail:", error.response?.data);
        reject(error);
      }
    });

    toast.promise(savePromise, {
      loading: 'Mengupload & Menyimpan...',
      success: 'Data Berhasil Disimpan Permanen!',
      error: 'Gagal menyimpan data.',
    });
  };

  const handleAddGrid = () => {
    if (data.filter(i => i.type === "grid").length >= 5) {
      toast.warning("Maksimal 5 item grid", { icon: <AlertTriangle className="text-yellow-500" size={16}/> });
      return;
    }
    const newItem: AgendaItem = {
      id: `new-${Date.now()}`, type: "grid", title: "", description: "", 
      captionSource: "auto", mediaUrl: "", targetUrl: "", buttonText: "LIHAT", uploadSource: "url"
    };
    setData([...data, newItem]);
    setSelectedId(newItem.id);
  };

  const handleDelete = (id: string) => {
     if (!window.confirm("Hapus?")) return;
     const newData = data.filter(i => i.id !== id);
     setData(newData);
     if(selectedId === id) setSelectedId(newData[0]?.id || "");
     toast.success("Item dihapus");
  };

  const handleSetAsMain = () => {
    if (activeItem.type === "main") return;
    const mainIdx = data.findIndex(item => item.type === "main");
    const activeIdx = data.findIndex(item => item.id === activeItem.id);
    if (mainIdx === -1 || activeIdx === -1) return;
    const newData = [...data];
    newData[mainIdx] = { ...newData[activeIdx], id: "main-1", type: "main", buttonText: newData[activeIdx].buttonText || "DAFTAR SEKARANG" };
    newData[activeIdx] = { ...newData[mainIdx], id: newData[activeIdx].id, type: "grid", buttonText: newData[mainIdx].buttonText || "INFO" };
    setData(newData);
    toast.success("Posisi ditukar!");
  };

  const getDisplayCaption = (item: AgendaItem) => {
    if (item.captionSource === "manual") return item.description;
    return item.mediaMeta?.caption || "Caption otomatis...";
  };

  const mainAgenda = data.find((i) => i.type === "main");
  const gridAgendas = data.filter((i) => i.type === "grid");

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Memuat Editor...</div>;
  if (!activeItem) return <div className="p-10 text-center">Data Kosong</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans flex flex-col xl:flex-row gap-8">
      <Toaster position="top-center" richColors closeButton={false} duration={2000} />

      {/* KIRI: FORM EDITOR */}
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-4">
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg"><RefreshCw size={20} className="text-indigo-600"/> Editor Agenda</h2>
              <div className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">V 2.1</div>
           </div>
           
           <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {data.map((item, idx) => (
                 <button key={item.id} onClick={() => setSelectedId(item.id)} 
                   className={`snap-start px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1.5
                   ${selectedId === item.id ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>
                   {item.type === "main" ? <Star size={12} className={selectedId === item.id ? "fill-white" : "fill-gray-400 text-gray-400"}/> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>}
                   {item.type === "main" ? "UTAMA" : `GRID ${idx}`}
                 </button>
              ))}
              <button onClick={handleAddGrid} className="px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 border border-gray-300 border-dashed text-gray-500 transition"><Plus size={16}/></button>
           </div>

           <div className="space-y-5 animate-in fade-in duration-500">
              
              <div className="relative">
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block ml-1">Sumber Media</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => toggleUploadSource("url")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${activeItem.uploadSource === "url" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                            <LinkIcon size={12}/> Link URL
                        </button>
                        <button onClick={() => toggleUploadSource("local")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${activeItem.uploadSource === "local" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                            <UploadCloud size={12}/> Upload File
                        </button>
                    </div>
                 </div>

                 {activeItem.uploadSource === "url" ? (
                     <div className="group relative animate-in fade-in slide-in-from-top-1 duration-300">
                       <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors"><LinkIcon size={18}/></div>
                       <input type="text" className="w-full border border-gray-200 bg-gray-50/50 p-3 pl-10 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400" 
                         value={activeItem.mediaUrl} onChange={(e) => handleUpdate("mediaUrl", e.target.value)} placeholder="Tempel link YouTube / Gambar / Video..." />
                       {activeItem.mediaUrl && (
                         <button onClick={() => handleUpdate("mediaUrl", "")} className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500 transition-colors"><XCircle size={16} /></button>
                       )}
                     </div>
                 ) : (
                     <div className="group relative animate-in fade-in slide-in-from-top-1 duration-300">
                        <input type="file" ref={fileInputRef} accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                        <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 p-6 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all text-center gap-2 group">
                            {activeItem.mediaUrl ? (
                                <><CheckCircle2 size={32} className="text-green-500"/><span className="text-xs font-bold text-green-700">File Siap Upload</span></>
                            ) : (
                                <><UploadCloud size={32} className="text-indigo-400 group-hover:text-indigo-600"/><span className="text-xs font-bold text-indigo-600">Pilih File Lokal</span></>
                            )}
                        </div>
                     </div>
                 )}
                 <SmartLinkStatus meta={activeItem.mediaMeta} />
              </div>

              <div>
                 <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Judul</label>
                 <input type="text" className="w-full border border-gray-200 p-3 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" 
                   value={activeItem.title} onChange={(e) => handleUpdate("title", e.target.value)} placeholder="Judul Agenda..." />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div className="flex justify-between items-center mb-3">
                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Deskripsi</label>
                    <button onClick={() => handleUpdate("captionSource", activeItem.captionSource === "auto" ? "manual" : "auto")} 
                      className="text-[10px] px-3 py-1.5 rounded-full border font-bold flex items-center gap-1.5 bg-white">
                       {activeItem.captionSource === "auto" ? <><ToggleLeft size={14}/> OTOMATIS</> : <><ToggleRight size={14}/> MANUAL</>}
                    </button>
                 </div>
                 {activeItem.captionSource === "manual" ? (
                    <textarea rows={3} className="w-full border p-3 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" 
                      value={activeItem.description} onChange={(e) => handleUpdate("description", e.target.value)} placeholder="Tulis manual..." />
                 ) : (
                    <div className="text-xs text-gray-500 italic p-3 border border-dashed border-gray-300 rounded-lg bg-gray-100/50 flex items-center gap-2">
                       <RefreshCw size={12} className={activeItem.mediaUrl ? "animate-spin-slow" : ""}/>
                       {activeItem.mediaMeta?.caption ? <span className="line-clamp-2">"{activeItem.mediaMeta.caption}"</span> : "Menunggu URL untuk caption..."}
                    </div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Tombol</label>
                    <input type="text" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm text-center font-bold text-indigo-700 bg-indigo-50/50 focus:bg-white focus:border-indigo-500 outline-none" 
                      value={activeItem.buttonText} onChange={(e) => handleUpdate("buttonText", e.target.value)} />
                 </div>
                 <div>
                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block ml-1">Target Link</label>
                    <input type="text" className="w-full border border-gray-200 p-2.5 rounded-xl text-sm text-blue-600 underline bg-gray-50/50 focus:bg-white focus:border-blue-500 outline-none" 
                      value={activeItem.targetUrl} onChange={(e) => handleUpdate("targetUrl", e.target.value)} placeholder="https://..." />
                 </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100 mt-2">
                 <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex justify-center items-center gap-2 active:scale-[0.98]">
                    <Save size={18}/> SIMPAN
                 </button>
                 {activeItem.type !== "main" && (
                   <>
                     <button onClick={handleSetAsMain} className="px-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-100 transition active:scale-95" title="Jadikan Utama"><Star size={20}/></button>
                     <button onClick={() => handleDelete(activeItem.id)} className="px-4 bg-rose-50 text-rose-500 border border-rose-200 rounded-xl hover:bg-rose-100 transition active:scale-95"><Trash2 size={20}/></button>
                   </>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* KANAN: PREVIEW */}
      <div className="w-full xl:w-2/3 bg-white p-4 md:p-8 rounded-3xl overflow-y-auto shadow-inner h-[calc(100vh-64px)] border border-gray-200 relative font-sans">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-12">
               <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Live Preview Mode</span>
               <h2 className="text-2xl md:text-3xl font-extrabold text-black uppercase tracking-wide mb-2">SOROTAN AGENDA</h2>
               <p className="text-gray-500 text-sm md:text-base px-4">Kegiatan unggulan dan acara utama Dinas Pendidikan.</p>
            </div>

            {/* 1. POSTER UTAMA */}
            {mainAgenda && (
               <div className="relative w-full max-w-6xl mx-auto min-h-[600px] flex items-center py-10 mb-20 px-4 md:px-0">
                  <div className="relative z-20 w-full md:w-[45%] h-[500px] md:h-[600px] bg-white rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border-4 border-white -mr-16 md:-mr-32 shrink-0">
                     <MediaContent item={mainAgenda} className="w-full h-full" />
                     <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 to-transparent pointer-events-none"></div>
                  </div>
                  <div className="relative z-10 flex-1 h-auto min-h-[350px] md:min-h-[450px] bg-blue-900 rounded-[2rem] shadow-xl flex flex-col justify-center p-6 md:p-10 pl-20 md:pl-40 text-white border border-blue-800">
                     <div className="space-y-5 md:space-y-6">
                        {mainAgenda.dateLocation && (
                           <div className="inline-flex items-center gap-2 text-yellow-400 font-mono text-[10px] md:text-xs uppercase tracking-widest border-b border-yellow-400/50 pb-1 w-fit">
                              <Calendar size={14}/> {mainAgenda.dateLocation}
                           </div>
                        )}
                        <h3 className="text-2xl md:text-4xl font-extrabold leading-tight uppercase drop-shadow-md">
                           {mainAgenda.title || "Judul Utama"}
                        </h3>
                        <div className="border-l-4 border-yellow-400 pl-4">
                           <p className="text-sm md:text-base text-blue-100 leading-relaxed line-clamp-3 font-light">
                              {getDisplayCaption(mainAgenda)}
                           </p>
                        </div>
                        <div className="pt-2 md:pt-4">
                           <a href={mainAgenda.targetUrl} target="_blank" rel="noreferrer" className="w-fit bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-6 md:px-8 py-3 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-yellow-400/50 flex items-center gap-2 md:gap-3 active:scale-95">
                              {mainAgenda.buttonText} <ExternalLink size={16}/>
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* 2. GRID INFORMASI */}
            <div className="text-center mb-8 md:mb-10">
               <h2 className="text-2xl md:text-3xl font-extrabold text-black uppercase tracking-wide mb-2">INFORMASI</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-10">
               {gridAgendas.map((item) => (
                  <div key={item.id} className="rounded-2xl md:rounded-3xl overflow-hidden bg-[#EFF6FF] border border-blue-100 shadow-md group flex flex-col hover:-translate-y-2 transition duration-300 h-full">
                     <div className="h-48 md:h-56 overflow-hidden relative bg-blue-50">
                        <MediaContent item={item} />
                     </div>
                     <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative text-[#1E3A8A]">
                        <div>
                           <h3 className="text-lg md:text-xl font-extrabold leading-tight mb-3 uppercase line-clamp-2">
                              {item.title || "Judul Informasi"}
                           </h3>
                           <p className="text-[11px] md:text-xs text-blue-600/80 mb-4 line-clamp-3 font-medium leading-relaxed">
                              {getDisplayCaption(item)}
                           </p>
                        </div>
                        <a href={item.targetUrl} target="_blank" rel="noreferrer" className="mt-4 w-full bg-[#1E40AF] hover:bg-[#1e3a8a] text-white py-3 rounded-full text-[10px] font-bold uppercase shadow-md text-center block transition">
                           {item.buttonText}
                        </a>
                     </div>
                  </div>
               ))}
            </div>

         </div>
      </div>
    </div>
  );
};

export default AgendaControl;
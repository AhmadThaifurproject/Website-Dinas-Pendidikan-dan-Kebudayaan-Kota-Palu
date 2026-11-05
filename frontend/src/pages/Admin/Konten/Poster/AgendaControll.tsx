import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom"; 
import { 
  Save, SquarePen, RefreshCw, ExternalLink, 
  ToggleLeft, ToggleRight, Plus, Trash2, Star,
  Image as ImageIcon, Youtube, 
  CheckCircle2, XCircle, Calendar, UploadCloud, PlayCircle, AlertCircle
} from "lucide-react";

// ✅ ENDPOINT TERPUSAT: Menggunakan jalur relatif karena baseURL sudah diatur di main.tsx
const ENDPOINTS = {
  FETCH_METADATA: `/api/public/agenda/fetch-metadata`,
  PUBLIC_AGENDA_LIST: `/api/public/agenda`, 
  ADMIN_AGENDA_ACTION: `/api/admin/agenda`
};

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
  uploadSource?: "url" | "local"; 
  mediaFile?: File; 
}

// --- HELPER: DETEKSI MEDIA ---
const detectMediaType = (url: string): MediaMeta | undefined => {
  if (!url) return undefined;
  if (url.startsWith("blob:")) return { type: "image", provider: "Local Preview" }; 

  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  if (ytRegex.test(url)) {
    let videoId = null;
    try {
        if (url.includes("v=")) videoId = url.split('v=')[1]?.split('&')[0];
        else if (url.includes("youtu.be/")) videoId = url.split('youtu.be/')[1]?.split('?')[0];
        else if (url.includes("/embed/")) videoId = url.split('/embed/')[1]?.split('?')[0];
        else if (url.includes("/shorts/")) videoId = url.split('/shorts/')[1]?.split('?')[0];
    } catch(e) {}

    return { 
      type: "external_video", 
      provider: "YouTube", 
      previewUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "" 
    };
  }
  return undefined; 
};

// --- KOMPONEN: MEDIA CONTENT ---
const MediaContent = ({ item, className }: { item: AgendaItem; className?: string }) => {
  const meta = item.mediaMeta; 
  const url = item.mediaUrl;

  if (!url || !meta) {
    return (
      <div className={`w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 ${className}`}>
        {url && item.uploadSource === 'url' ? (
            <><AlertCircle className="w-8 h-8 mb-2 text-red-300" /><span className="text-[10px] font-bold tracking-widest text-red-300 uppercase">Link Tidak Didukung</span></>
        ) : (
            <><ImageIcon className="w-8 h-8 mb-2 opacity-40" /><span className="text-[10px] font-bold tracking-widest opacity-50 uppercase">No Media</span></>
        )}
      </div>
    );
  }

  if (meta.type === 'video') {
    return (
      <div className={`relative w-full h-full bg-black overflow-hidden flex items-center justify-center ${className}`}>
        <video src={meta.streamUrl || url} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-lg scale-110" muted loop />
        <video src={meta.streamUrl || url} className="relative z-10 w-full h-full object-contain" muted autoPlay loop playsInline />
      </div>
    );
  }

  const imgSrc = meta.previewUrl || url;
  return (
    <div className={`relative w-full h-full bg-slate-900 flex items-center justify-center group ${className} overflow-hidden`}>
      <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60 blur-2xl scale-125 transition-transform duration-700 group-hover:scale-150" style={{ backgroundImage: `url('${imgSrc}')` }}></div>
      <img src={imgSrc} alt="Preview" className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.style.display='none'; }} />
      {meta.provider === 'YouTube' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50 transform group-hover:scale-110 transition-transform">
                  <PlayCircle className="text-white fill-white" size={24} />
              </div>
          </div>
      )}
    </div>
  );
};

const SmartLinkStatus = ({ meta, url, source }: { meta?: MediaMeta, url: string, source: string }) => {
  if (source === 'local' || !url) return null;
  if (url && !meta) {
      return (
        <div className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 animate-in fade-in">
            <div className="flex items-center gap-2.5"><AlertCircle size={14}/><span className="text-xs font-bold tracking-wide">Bukan YouTube</span></div>
            <span className="text-[10px] opacity-80">Link tidak didukung</span>
        </div>
      );
  }
  return (
    <div className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-xl border border-green-200 bg-green-50 text-green-600 animate-in fade-in">
      <div className="flex items-center gap-2.5"><Youtube size={14}/><span className="text-xs font-bold tracking-wide">YouTube Video</span></div>
      <div className="flex items-center gap-1.5 text-[10px] font-medium"><CheckCircle2 size={12}/><span>Terhubung</span></div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const AgendaControl = () => {
  const [data, setData] = useState<AgendaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 1. FETCH DATA (MENGGUNAKAN SESSION COOKIE)
  const fetchData = async () => {
    try {
      // ✅ Hapus pengecekan token manual. Axios otomatis membawa cookie.
      const res = await axios.get(ENDPOINTS.PUBLIC_AGENDA_LIST);

      if (res.data.length > 0) {
        const normalizedData = res.data.map((item: AgendaItem) => ({
            ...item,
            uploadSource: item.uploadSource || "url" 
        }));
        setData(normalizedData);
        if (!selectedId) {
            const main = normalizedData.find((i: AgendaItem) => i.type === "main");
            setSelectedId(main ? main.id : normalizedData[0].id);
        }
      } else {
        const initData: AgendaItem[] = [{ id: "new-main", type: "main", title: "", description: "", captionSource: "auto", mediaUrl: "", targetUrl: "#", buttonText: "DAFTAR SEKARANG", uploadSource: "url" }];
        setData(initData);
        setSelectedId("new-main");
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      // Jika 401, biarkan Interceptor global menangani pengalihan login.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const activeItem = data.find((i) => i.id === selectedId) || data[0];

  const handleUpdate = (field: keyof AgendaItem, value: any) => {
    setData((prev) => prev.map((item) => {
      if (item.id === selectedId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'mediaUrl' && item.uploadSource === 'url') {
          const detectedMeta = detectMediaType(value);
          updatedItem.mediaMeta = detectedMeta ? { ...item.mediaMeta, ...detectedMeta } : undefined;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  useEffect(() => {
    const metaCheck = detectMediaType(activeItem?.mediaUrl || "");
    const isYouTube = metaCheck?.provider === 'YouTube';

    if (activeItem?.uploadSource === 'url' && activeItem?.captionSource === 'auto' && activeItem?.mediaUrl && isYouTube) {
        const url = activeItem.mediaUrl;
        const timer = setTimeout(async () => {
            try {
                const res = await axios.post(ENDPOINTS.FETCH_METADATA, { url });
                const { caption: fetchedCaption, image: fetchedImage } = res.data;
                setData(prev => prev.map(item => {
                    if (item.id === selectedId) {
                        const currentMeta: MediaMeta = item.mediaMeta || { type: 'external_video' };
                        return { ...item, mediaMeta: { ...currentMeta, caption: fetchedCaption || "Judul tidak tersedia", previewUrl: fetchedImage || currentMeta.previewUrl } };
                    }
                    return item;
                }));
            } catch (e) { console.error(e); }
        }, 1200); 
        return () => clearTimeout(timer);
    }
  }, [activeItem?.mediaUrl, activeItem?.captionSource, activeItem?.uploadSource, selectedId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    const metaType: MediaMeta['type'] = file.type.startsWith("video/") ? "video" : "image";
    const newMeta: MediaMeta = { type: metaType, provider: "Local Preview", previewUrl: metaType === "image" ? blobUrl : undefined, streamUrl: metaType === "video" ? blobUrl : undefined, caption: file.name };
    setData((prev) => prev.map(item => item.id === selectedId ? { ...item, mediaUrl: blobUrl, mediaFile: file, mediaMeta: newMeta, uploadSource: "local" } : item));
  };

  const toggleUploadSource = (source: "url" | "local") => {
    handleUpdate("uploadSource", source);
    if(source === "local") handleUpdate("mediaUrl", "");
  };

  // 5. SAVE HANDLER (POST DENGAN COOKIE/SESSION)
  const handleSave = async () => {
    if (!activeItem) return;

    const isNew = activeItem.id.startsWith("new-");
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('items', JSON.stringify([activeItem]));
        if (activeItem.uploadSource === 'local' && activeItem.mediaFile) {
            formData.append(`file_${activeItem.id}`, activeItem.mediaFile); 
        }

        // ✅ Header Authorization dihapus. Axios membawa Cookie secara otomatis.
        const res = await axios.post(ENDPOINTS.ADMIN_AGENDA_ACTION, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        if (isNew && res.data[0]?.id) {
             const newId = String(res.data[0].id);
             setData(prev => prev.map(i => i.id === selectedId ? { ...i, id: newId } : i));
             setSelectedId(newId);
        }
        await fetchData(); 
        resolve("Sukses");
      } catch (error: any) { reject(error); }
    });

    toast.promise(savePromise, { loading: 'Menyimpan...', success: 'Berhasil disimpan!', error: 'Gagal menyimpan.' });
  };

  // 7. DELETE
  const handleDelete = async (id: string) => {
     if (!window.confirm("Hapus secara permanen?")) return;
     if (id.startsWith("new-")) {
         const newData = data.filter(i => i.id !== id);
         setData(newData);
         if (selectedId === id) setSelectedId(newData[0]?.id || "");
         return;
     }

     // ✅ Header Authorization dihapus.
     const deletePromise = axios.delete(`${ENDPOINTS.ADMIN_AGENDA_ACTION}/${id}`);
     toast.promise(deletePromise, {
         loading: "Menghapus...",
         success: () => {
             const newData = data.filter(i => i.id !== id);
             setData(newData);
             if (selectedId === id) setSelectedId(newData[0]?.id || "");
             return "Item berhasil dihapus";
         },
         error: "Gagal menghapus item"
     });
  };

  // 8. SET AS MAIN
  const handleSetAsMain = async () => {
    const currentMain = data.find(item => item.type === "main");
    if (!currentMain || activeItem.type === "main" || activeItem.id.startsWith("new-")) return;

    const swapPromise = new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('items', JSON.stringify([{ ...currentMain, type: 'grid', buttonText: "INFO" }, { ...activeItem, type: 'main', buttonText: "DAFTAR SEKARANG" }]));
            
            // ✅ Header Authorization dihapus.
            await axios.post(ENDPOINTS.ADMIN_AGENDA_ACTION, formData, { 
                headers: { "Content-Type": "multipart/form-data" } 
            });

            await fetchData();
            resolve("Sukses");
        } catch (e) { reject(e); }
    });
    toast.promise(swapPromise, { loading: "Memperbarui...", success: "Berhasil!", error: "Gagal." });
  };

  const getDisplayCaption = (item: AgendaItem) => {
    if (item.captionSource === "manual") return item.description;
    return item.mediaMeta?.caption || "Menunggu data...";
  };

  const mainAgenda = data.find((i) => i.type === "main");
  const gridAgendas = data.filter((i) => i.type === "grid");

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 font-medium">Memuat Editor...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans flex flex-col xl:flex-row gap-8">
      <Toaster position="top-center" richColors />

      {/* --- EDITOR PANEL --- */}
      <div className="w-full xl:w-[400px] shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 sticky top-6">
           <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-lg"><SquarePen size={20} className="text-blue-600"/> Editor Agenda</h2>
           </div>
           
           <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {data.map((item, idx) => (
                 <button key={item.id} onClick={() => setSelectedId(item.id)} className={`snap-start px-3.5 py-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-2 ${selectedId === item.id ? "bg-slate-800 text-white border-slate-800 shadow-md ring-2 ring-slate-200" : "bg-white text-slate-500 border-slate-200 hover:text-blue-600"}`}>
                   {item.type === "main" ? <Star size={12} className={selectedId === item.id ? "fill-yellow-400 text-yellow-400" : ""}/> : <div className={`w-1.5 h-1.5 rounded-full ${selectedId === item.id ? "bg-white" : "bg-slate-300"}`}></div>}
                   {item.type === "main" ? "UTAMA" : `GRID ${item.id.startsWith('new') ? '(Baru)' : idx}`}
                 </button>
              ))}
              <button onClick={() => setData([...data, { id: `new-${Date.now()}`, type: "grid", title: "", description: "", captionSource: "auto", mediaUrl: "", targetUrl: "", buttonText: "LIHAT", uploadSource: "url" }])} className="px-3 py-2 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400"><Plus size={16}/></button>
           </div>

           <div className="space-y-5">
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block ml-1">Sumber Media</label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button onClick={() => toggleUploadSource("url")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeItem?.uploadSource === "url" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>YouTube</button>
                    <button onClick={() => toggleUploadSource("local")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeItem?.uploadSource === "local" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Upload</button>
                </div>
              </div>

              {activeItem?.uploadSource === "url" ? (
                  <input type="text" className="w-full border border-slate-200 bg-slate-50/50 p-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 text-slate-700" value={activeItem?.mediaUrl || ""} onChange={(e) => handleUpdate("mediaUrl", e.target.value)} placeholder="Tempel link YouTube..." />
              ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all h-[100px]">
                      <input type="file" ref={fileInputRef} accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                      {activeItem?.mediaUrl ? <CheckCircle2 size={24} className="text-emerald-500"/> : <UploadCloud size={24} className="text-slate-400"/>}
                      <span className="text-xs font-bold text-slate-500 mt-2">{activeItem?.mediaUrl ? "Terpilih" : "Pilih File"}</span>
                  </div>
              )}
              <SmartLinkStatus meta={activeItem?.mediaMeta} url={activeItem?.mediaUrl || ""} source={activeItem?.uploadSource || 'url'} />

              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block ml-1">Judul Agenda</label>
              <input type="text" className="w-full border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none" value={activeItem?.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />

              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Deskripsi</label>
                <button onClick={() => handleUpdate("captionSource", activeItem?.captionSource === "auto" ? "manual" : "auto")} className="text-[10px] px-3 py-1.5 rounded-full border border-slate-200 font-bold bg-white">{activeItem?.captionSource === "auto" ? "OTOMATIS" : "MANUAL"}</button>
              </div>
              {activeItem?.captionSource === "manual" ? (
                <textarea rows={3} className="w-full border border-slate-200 p-3 rounded-lg text-sm outline-none transition-all" value={activeItem?.description || ""} onChange={(e) => handleUpdate("description", e.target.value)} />
              ) : (
                <div className="text-xs text-slate-500 italic p-4 border border-dashed border-slate-300 rounded-lg bg-slate-100/50 flex items-center gap-3">
                  <RefreshCw size={14} className={activeItem?.mediaUrl ? "text-blue-500" : "text-slate-300"}/>
                  <span className="line-clamp-2">{activeItem?.mediaMeta?.caption || "Menunggu data..."}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <input type="text" className="w-full border border-slate-200 p-2.5 rounded-xl text-sm text-center font-bold text-blue-700 bg-blue-50/30 outline-none" value={activeItem?.buttonText || ""} onChange={(e) => handleUpdate("buttonText", e.target.value)} />
                 <input type="text" className="w-full border border-slate-200 p-2.5 rounded-xl text-sm text-blue-600 underline outline-none" value={activeItem?.targetUrl || ""} onChange={(e) => handleUpdate("targetUrl", e.target.value)} placeholder="Target URL" />
              </div>

              <div className="flex gap-3 pt-6 border-t mt-2">
                 <button onClick={handleSave} className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all flex justify-center items-center gap-2"><Save size={18}/> SIMPAN ITEM</button>
                 {activeItem?.type !== "main" && (
                   <><button onClick={handleSetAsMain} className="px-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-100 transition"><Star size={20}/></button>
                   <button onClick={() => handleDelete(activeItem!.id)} className="px-4 bg-rose-50 text-rose-500 border border-rose-200 rounded-xl hover:bg-rose-100 transition"><Trash2 size={20}/></button></>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* --- PREVIEW PANEL --- */}
      <div className="w-full xl:flex-1 bg-white p-6 md:p-10 rounded-[2rem] shadow-inner border border-slate-200 min-h-[800px]">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
               <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5 inline-block">Live Preview</span>
               <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 uppercase tracking-tight">SOROTAN AGENDA</h2>
            </div>

            {mainAgenda && (
               <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center mb-20">
                  <div className="relative z-20 w-full md:w-[42%] h-[260px] md:h-[480px] bg-white rounded-3xl overflow-hidden shadow-2xl md:-mr-12 border-[6px] border-white">
                      <MediaContent item={mainAgenda} className="w-full h-full" />
                  </div>
                  <div className="relative z-10 w-full md:flex-1 bg-blue-900 rounded-[2.5rem] p-8 md:p-12 md:pl-20 text-white min-h-[380px]">
                    <div className="flex flex-col h-full justify-center space-y-6">
                      <h3 className="text-2xl md:text-4xl font-black leading-tight uppercase tracking-tight">{mainAgenda.title || "Judul Utama"}</h3>
                      <p className="text-sm text-blue-100 leading-relaxed font-light opacity-90 line-clamp-4">{getDisplayCaption(mainAgenda)}</p>
                      <div className="pt-2"><a href={mainAgenda.targetUrl} className="bg-yellow-400 text-blue-950 px-8 py-3.5 rounded-full text-xs font-bold uppercase flex items-center gap-3 w-fit">{mainAgenda.buttonText} <ExternalLink size={16}/></a></div>
                    </div>
                  </div>
               </div>
            )}
            
            {gridAgendas.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {gridAgendas.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg flex flex-col h-full">
                       <div className="h-52 relative overflow-hidden"><MediaContent item={item} /></div>
                       <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase line-clamp-2">{item.title || "Tanpa Judul"}</h3>
                          <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">{getDisplayCaption(item)}</p>
                          <a href={item.targetUrl} className="w-full bg-slate-50 hover:bg-blue-50 text-slate-600 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center border transition-colors">{item.buttonText}</a>
                       </div>
                    </div>
                 ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AgendaControl;
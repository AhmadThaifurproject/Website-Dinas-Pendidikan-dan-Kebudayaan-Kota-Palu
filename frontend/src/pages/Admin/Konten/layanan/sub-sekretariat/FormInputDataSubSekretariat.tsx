// Lokasi File: src/pages/Admin/Konten_SubSekretariat/FormInputDataSubSekretariat.tsx

import React, { useState, useEffect, useRef, useContext } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { 
  Trash2, FileImage, FileText, Loader2, Plus, Save, MapPin, 
  Clock, ListChecks, GitMerge, DownloadCloud, UploadCloud, 
  Palette, Phone, Layout, Type, MousePointerClick, AlignLeft,
  User, Settings, Database, ExternalLink, Briefcase, Award,
  MessageCircle, Mail, HelpCircle, AlertCircle, CalendarRange
} from "lucide-react";

// --- IMPORT COMPONENT ---
import DuplicateFileAlert from "../../../../../components/Feedback/DuplicateFileAlert";

// --- IMPORT CONTEXT TEMA (Sesuai Referensi PAUD) ---
// Pastikan path ini mengarah ke file Context yang benar
import { ThemeContextAdmin } from "../../../components/theme/ThemeContextAdmin";

// --- TYPE DEFINITIONS ---
type FormInputDataProps = {
  selectedCategory: string; 
};

// --- OPSI CONFIGURATION ---
const colorOptions = [
  { label: "Biru", value: "blue", bg: "bg-blue-500" },
  { label: "Hijau", value: "emerald", bg: "bg-emerald-500" },
  { label: "Ungu", value: "purple", bg: "bg-purple-500" },
  { label: "Kuning", value: "amber", bg: "bg-amber-500" },
  { label: "Merah", value: "rose", bg: "bg-rose-500" },
  { label: "Indigo", value: "indigo", bg: "bg-indigo-500" },
];

const iconOptions = [
  { label: "Dokumen (Default)", value: "FileText", icon: FileText },
  { label: "Program / Agenda", value: "ClipboardList", icon: Briefcase },
  { label: "Struktur / User", value: "Users", icon: User },
  { label: "Target / Capaian", value: "Target", icon: Award },
  { label: "Pengaturan", value: "Settings", icon: Settings },
  { label: "Database", value: "Database", icon: Database },
  { label: "Layout / Tampilan", value: "Layout", icon: Layout },
];

const contactIconOptions = [
    { label: "Telepon (Default)", value: "Phone", icon: Phone },
    { label: "WhatsApp / Pesan", value: "MessageCircle", icon: MessageCircle },
    { label: "Email", value: "Mail", icon: Mail },
    { label: "Bantuan", value: "HelpCircle", icon: HelpCircle },
];

const statusOptions = [
  { label: "Aktif / Terjadwal", value: "work", color: "text-green-600 bg-green-50" },
  { label: "Selesai / Libur", value: "off", color: "text-rose-600 bg-rose-50" },
  { label: "Prioritas / Khusus", value: "special", color: "text-amber-600 bg-amber-50" },
];

// --- LIST LAYANAN SUB SEKRETARIAT ---
const layananOptions = [
  { label: "Tugas dan Fungsi (SOTK)", value: "tugas-fungsi" },
  { label: "Program Kerja & Anggaran", value: "program-kerja" },
];

export default function FormInputDataSubSekretariat({ selectedCategory }: FormInputDataProps) {
  // --- LOGIKA TEMA (SINKRON DENGAN REFERENSI PAUD) ---
  const context = useContext(ThemeContextAdmin);
  const theme = context?.theme || "light";
  const isLight = theme === "light";

  // --- STATE UTAMA ---
  const [selectedLayanan, setSelectedLayanan] = useState(layananOptions[0].value);
  
  // --- DYNAMIC LABELS BASED ON SERVICE ---
  const isProgramKerja = selectedLayanan === "program-kerja";
  const labelPersyaratan = isProgramKerja ? "Indikator Kinerja / Target" : "Dasar Hukum / Regulasi";
  const labelAlur = isProgramKerja ? "Siklus Perencanaan" : "Struktur Organisasi / Hierarki";
  const labelJadwal = isProgramKerja ? "Agenda Kegiatan & Jadwal" : "Rincian Tugas Jabatan";

  // --- STATE UPLOAD FILE PREVIEW (HEADER) ---
  const [previewConfig, setPreviewConfig] = useState({
    title: "Pratinjau Dokumen",
    desc: "Dokumen utama terkait layanan ini."
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(true);
  const [duplicateInfo, setDuplicateInfo] = useState<{ locations: string[]; file: File } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- STATE PENGATURAN TAMPILAN (TAB & PORTAL) ---
  const [tabSettings, setTabSettings] = useState({ title: "", icon: "FileText" });
  const [portalConfig, setPortalConfig] = useState({ isVisible: false, url: "", label: "Akses Aplikasi" });

  // --- STATE AREA DOWNLOAD ---
  const [downloadConfig, setDownloadConfig] = useState({
    title: "Unduh Dokumen",
    desc: "Template dan dokumen pendukung."
  });
  const [downloads, setDownloads] = useState<{name: string, url: string}[]>([]);
  const [uploadingDownload, setUploadingDownload] = useState(false); 
  const downloadInputRef = useRef<HTMLInputElement | null>(null);

  // --- STATE KONTAK LAYANAN ---
  const [contactConfig, setContactConfig] = useState({
    title: "Kontak Layanan",
    desc: "Hubungi admin untuk informasi lebih lanjut.",
    icon: "Phone"
  });
  const [contacts, setContacts] = useState<{name: string, number: string}[]>([
    { name: "", number: "" }
  ]);

  // --- STATE KONTEN UTAMA ---
  const [enablePersyaratan, setEnablePersyaratan] = useState(true);
  const [enableAlur, setEnableAlur] = useState(true);
  
  // Data Mapping: persyaratan -> Indikator/DasarHukum
  const [persyaratan, setPersyaratan] = useState<string[]>([""]);
  
  // Data Mapping: alur -> Siklus/Struktur
  const [alur, setAlur] = useState<{step: number, title: string, desc: string, color: string}[]>([
    { step: 1, title: "", desc: "", color: "blue" }
  ]);

  // Data Mapping: jamOperasional -> Agenda/UraianTugas
  const [jamOperasional, setJamOperasional] = useState<{day: string, time: string, status: string, breakTime: string}[]>([
    { day: "", time: "", status: "work", breakTime: "" }
  ]);
  
  const [mapLink, setMapLink] = useState("");
  const [savingContent, setSavingContent] = useState(false);

  // --- FETCH FILE PREVIEW ---
  const fetchFiles = async () => {
    setLoadingFile(true);
    try {
      const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, "_");
      const res = await fetch(`http://localhost:8000/api/${categorySlug}/upload/${selectedLayanan}`);
      const data = await res.json();
      setFileList(data.files || []);
    } catch (err) { console.error("Fetch error:", err); } finally { setLoadingFile(false); }
  };

  // --- FETCH CONTENT DATA ---
  const fetchContentData = async () => {
    try {
      const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, "_");
      const res = await fetch(`http://localhost:8000/api/${categorySlug}/content/${selectedLayanan}`);
      
      if (res.ok) {
        const data = await res.json();
        
        // Load Data Logic
        setEnablePersyaratan(data.isIndikatorActive ?? data.isDasarHukumActive ?? true);
        setEnableAlur(data.isSiklusActive ?? data.isStrukturActive ?? true);
        
        setPersyaratan(data.indikatorKinerja || data.dasarHukum || [""]);
        
        // Mapping Alur / Struktur
        const rawAlur = data.siklusPerencanaan || data.strukturOrganisasi || [];
        if (rawAlur.length) {
            setAlur(rawAlur.map((a: any) => ({
                step: a.step || a.level || 1,
                title: a.title || a.position || "",
                desc: a.desc || a.role || "",
                color: a.color || 'blue'
            })));
        } else {
            setAlur([{ step: 1, title: "", desc: "", color: "blue" }]);
        }
        
        setDownloads(data.downloads?.length ? data.downloads : []);
        
        // Mapping Agenda / Uraian Tugas
        const rawAgenda = data.agendaKegiatan || data.uraianTugas || [];
        const mappedAgenda = rawAgenda.map((item: any) => ({
             day: item.day || item.jabatan || "", 
             time: item.activity || item.summary || "", 
             status: item.status || "work", 
             // Jika array details ada, join jadi string dengan newline, else string kosong
             breakTime: Array.isArray(item.details) ? item.details.join('\n') : (item.pic || "")
        }));

        setJamOperasional(mappedAgenda.length ? mappedAgenda : [{ day: "", time: "", status: "work", breakTime: "" }]);
        setMapLink(data.mapLink || "");

        // Load UI Configs
        setPreviewConfig({
            title: data.previewSectionTitle || "Pratinjau Dokumen",
            desc: data.previewSectionDesc || "Dokumen utama terkait layanan ini."
        });
        setTabSettings({ title: data.tabTitle || "", icon: data.tabIcon || "FileText" });
        setPortalConfig({ 
            isVisible: data.portalVisible ?? false, 
            url: data.portalUrl || "", 
            label: data.portalLabel || "Akses Aplikasi" 
        });
        setDownloadConfig({
            title: data.downloadSectionTitle || "Unduh Dokumen",
            desc: data.downloadSectionDesc || "Template dan dokumen pendukung."
        });
        setContactConfig({
            title: data.contactSectionTitle || "Kontak Layanan",
            desc: data.contactSectionDesc || "Hubungi admin untuk informasi lebih lanjut.",
            icon: data.contactSectionIcon || "Phone"
        });
        setContacts(data.contacts?.length ? data.contacts : [{ name: "", number: "" }]);

      } else {
        // Reset Default if new
        setPersyaratan([""]);
        setAlur([{ step: 1, title: "", desc: "", color: "blue" }]);
        setDownloads([]);
        setJamOperasional([{ day: "", time: "", status: "work", breakTime: "" }]);
        setMapLink("");
        setPreviewConfig({ title: "Pratinjau Dokumen", desc: "Dokumen utama terkait layanan ini." });
        setTabSettings({ title: "", icon: "FileText" });
        setPortalConfig({ isVisible: false, url: "", label: "Akses Aplikasi" });
        setDownloadConfig({ title: "Unduh Dokumen", desc: "Template dan dokumen pendukung." });
        setContactConfig({ title: "Kontak Layanan", desc: "Hubungi admin untuk informasi lebih lanjut.", icon: "Phone" });
        setContacts([{ name: "", number: "" }]);
      }
    } catch (err) { console.error("Error fetching content:", err); }
  };

  useEffect(() => {
    fetchFiles();
    fetchContentData();
  }, [selectedCategory, selectedLayanan]);

  // --- LOGIC: FILTER FILE PREVIEW ---
  const availablePreviewFiles = fileList.filter(f => 
    !downloads.some(d => d.url && f.url && d.url === f.url)
  );

  // --- HANDLER UPLOAD FILE PREVIEW UTAMA ---
  const handleUpload = async (force: boolean = false) => {
    if (!file) { Swal.fire("Peringatan", "Pilih file terlebih dahulu.", "warning"); return; }
    if (availablePreviewFiles.length > 0 && !force) { Swal.fire("Peringatan", "Hanya boleh 1 file preview utama.", "warning"); return; }
    
    const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, "_");
    const formData = new FormData();
    formData.append("file", file);
    if (force) formData.append("force", "true");
    setUploading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/${categorySlug}/upload/${selectedLayanan}`, { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setFileList(force ? [{ name: file.name, url: data.url }] : [...fileList, { name: file.name, url: data.url }]);
        Swal.fire("Sukses", "Upload berhasil.", "success");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setDuplicateInfo(null);
      } else if (res.status === 409) {
        const data = await res.json();
        if (data.locations) setDuplicateInfo({ locations: data.locations, file });
        else Swal.fire("Gagal", data.message, "error");
      } else { Swal.fire("Gagal", "Upload gagal.", "error"); }
    } catch (err) { Swal.fire("Error", "Terjadi kesalahan koneksi.", "error"); } finally { setUploading(false); }
  };

  const handleDelete = async (filename: string) => {
    const confirm = await Swal.fire({ title: "Hapus File?", text: "File preview ini akan dihapus permanen.", icon: "warning", showCancelButton: true, confirmButtonText: "Hapus", cancelButtonText: "Batal" });
    if (!confirm.isConfirmed) return;
    setDeleting(filename);
    const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, "_");
    try {
      const res = await fetch(`http://localhost:8000/api/${categorySlug}/upload/${selectedLayanan}/${filename}`, { method: "DELETE" });
      if (res.ok) {
        setFileList(prev => prev.filter(f => f.name !== filename));
        Swal.fire("Terhapus", "File berhasil dihapus.", "success");
        setFile(null);
      } else Swal.fire("Gagal", "Gagal menghapus file.", "error");
    } catch (err) { Swal.fire("Error", "Kesalahan server.", "error"); } finally { setDeleting(null); }
  };

  // --- HANDLER UPLOAD FILE UNTUK AREA DOWNLOAD ---
  const handleDownloadFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDownload(true);
    const formData = new FormData();
    formData.append("file", file);
    const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, "_");
    try {
        const res = await fetch(`http://localhost:8000/api/${categorySlug}/upload/${selectedLayanan}`, { method: "POST", body: formData });
        if (res.ok) {
            const data = await res.json();
            const newFile = { name: file.name, url: data.url };
            setDownloads(prev => [...prev, newFile]);
            setFileList(prev => [...prev, newFile]);
            Swal.fire("Sukses", "File berhasil diunggah ke daftar download.", "success");
        } else { Swal.fire("Gagal", "Gagal mengunggah file.", "error"); }
    } catch (err) { Swal.fire("Error", "Terjadi kesalahan koneksi.", "error"); } finally { 
        setUploadingDownload(false);
        if (downloadInputRef.current) downloadInputRef.current.value = "";
    }
  };

  // --- HANDLERS CONTENT MANIPULATION ---
  const handleReqChange = (idx: number, val: string) => { const newReq = [...persyaratan]; newReq[idx] = val; setPersyaratan(newReq); };
  const addReq = () => setPersyaratan([...persyaratan, ""]);
  const delReq = (idx: number) => setPersyaratan(persyaratan.filter((_, i) => i !== idx));

  const handleAlurChange = (idx: number, field: keyof typeof alur[0], val: string | number) => { const newAlur = [...alur]; newAlur[idx] = { ...newAlur[idx], [field]: val }; setAlur(newAlur); };
  const addAlur = () => setAlur([...alur, { step: alur.length + 1, title: "", desc: "", color: "blue" }]);
  const delAlur = (idx: number) => setAlur(alur.filter((_, i) => i !== idx));

  const handleDlNameChange = (idx: number, val: string) => { const newDl = [...downloads]; newDl[idx] = { ...newDl[idx], name: val }; setDownloads(newDl); };
  const delDl = (idx: number) => setDownloads(downloads.filter((_, i) => i !== idx));

  const handleJamChange = (idx: number, field: keyof typeof jamOperasional[0], val: string) => { const newJam = [...jamOperasional]; newJam[idx] = { ...newJam[idx], [field]: val }; setJamOperasional(newJam); };
  const addJam = () => setJamOperasional([...jamOperasional, { day: "", time: "", status: "work", breakTime: "" }]);
  const delJam = (idx: number) => setJamOperasional(jamOperasional.filter((_, i) => i !== idx));

  const handleContactChange = (idx: number, field: 'name' | 'number', val: string) => { const newContacts = [...contacts]; newContacts[idx] = { ...newContacts[idx], [field]: val }; setContacts(newContacts); };
  const addContact = () => setContacts([...contacts, { name: "", number: "" }]);
  const delContact = (idx: number) => setContacts(contacts.filter((_, i) => i !== idx));

  // --- SAVE CONTENT (CRITICAL SYNC LOGIC) ---
  const handleSaveContent = async () => {
    setSavingContent(true);
    const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, "_");

    // Mapping Generic State to Specific Backend Fields
    const payload: any = {
      layanan: selectedLayanan,
      
      // Feature Flags
      [isProgramKerja ? 'isIndikatorActive' : 'isDasarHukumActive']: enablePersyaratan,
      [isProgramKerja ? 'isSiklusActive' : 'isStrukturActive']: enableAlur,
      
      // Data Arrays (Mapped)
      [isProgramKerja ? 'indikatorKinerja' : 'dasarHukum']: enablePersyaratan ? persyaratan : [],
      
      // --- MAPPING STRUKTUR ---
      [isProgramKerja ? 'siklusPerencanaan' : 'strukturOrganisasi']: enableAlur ? alur.map(a => ({
          // Jika Program Kerja, gunakan field 'title' & 'desc'
          // Jika Struktur, mapping 'title' -> 'position', 'desc' -> 'role'
          ...(isProgramKerja ? { title: a.title, desc: a.desc } : { position: a.title, role: a.desc }),
          color: a.color,
          level: a.step // keep track of order
      })) : [],
      
      downloads,
      
      // --- MAPPING AGENDA / URAIAN TUGAS ---
      [isProgramKerja ? 'agendaKegiatan' : 'uraianTugas']: jamOperasional.map(j => ({
         // Jika Program Kerja
         ...(isProgramKerja ? {
             day: j.day,
             activity: j.time,
             pic: j.breakTime
         } : {
         // Jika Tugas Fungsi (SOTK)
             jabatan: j.day,
             summary: j.time,
             // Split Textarea by newline to array for bullet points
             details: j.breakTime ? j.breakTime.split('\n').filter(line => line.trim() !== '') : []
         }),
         status: j.status
      })),
      
      mapLink,
      
      // UI Configs
      previewSectionTitle: previewConfig.title,
      previewSectionDesc: previewConfig.desc,
      tabTitle: tabSettings.title,
      tabIcon: tabSettings.icon,
      portalVisible: portalConfig.isVisible,
      portalUrl: portalConfig.url,
      portalLabel: portalConfig.label,
      downloadSectionTitle: downloadConfig.title,
      downloadSectionDesc: downloadConfig.desc,
      contactSectionTitle: contactConfig.title,
      contactSectionDesc: contactConfig.desc,
      contactSectionIcon: contactConfig.icon,
      contacts
    };

    try {
      const res = await fetch(`http://localhost:8000/api/${categorySlug}/content/${selectedLayanan}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      if (res.ok) Swal.fire("Berhasil", "Konten layanan berhasil disimpan!", "success");
      else throw new Error("Gagal menyimpan");
    } catch (err) { Swal.fire("Error", "Gagal menyimpan konten.", "error"); } finally { setSavingContent(false); }
  };

  // --- STYLES HELPER (VISUAL MATCHED WITH REFERENCE - INDIGO/SLATE/SKY) ---
  const cardClass = `p-6 rounded-xl shadow-sm border transition-all ${isLight ? "bg-white border-indigo-50" : "bg-gray-800 border-gray-700"}`;
  const inputClass = `w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition ${isLight ? "bg-slate-50 border-gray-300 text-gray-900 focus:bg-white" : "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"}`;
  const textareaClass = `w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition min-h-[80px] resize-y ${isLight ? "bg-slate-50 border-gray-300 text-gray-900 focus:bg-white" : "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"}`;
  const selectClass = `w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer ${isLight ? "bg-slate-50 border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-gray-100"}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2 ${isLight ? "text-black-400" : "text-gray-400"}`;
  
  const sectionHeaderClass = "flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700";
  
  const ToggleSwitch = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const SelectedTabIcon = iconOptions.find(opt => opt.value === tabSettings.icon)?.icon || FileText;
  const SelectedContactIcon = contactIconOptions.find(opt => opt.value === contactConfig.icon)?.icon || Phone;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      
      {/* HEADER & SELECTOR LAYANAN */}
      <div className={`${cardClass} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <h1 className={`text-2xl font-bold ${isLight ? "text-indigo-900" : "text-white"}`}>
          Editor Layanan {selectedCategory}
        </h1>
        <div className="w-full md:w-80">
          <label className={labelClass}>Pilih Layanan:</label>
          <select value={selectedLayanan} onChange={(e) => setSelectedLayanan(e.target.value)} className={selectClass}>
            {layananOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>
      </div>

      {/* --- PENGATURAN NAVIGASI & PORTAL --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tab Navigasi */}
        <div className={cardClass}>
          <div className={sectionHeaderClass}>
            <Layout className="text-pink-500" />
            <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>Pengaturan Tab Navigasi</h2>
          </div>
          <div className="space-y-4">
              <div>
                <label className={labelClass}>Judul Tab Utama</label>
                <input type="text" value={tabSettings.title} onChange={(e) => setTabSettings({...tabSettings, title: e.target.value})} placeholder={isProgramKerja ? "Program Kerja" : "SOTK"} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Icon Tab</label>
                <div className="flex gap-2">
                    <div className="p-2 bg-slate-100 dark:bg-gray-600 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-500 min-w-[45px]">
                        <SelectedTabIcon size={24} className="text-indigo-500"/>
                    </div>
                    <select value={tabSettings.icon} onChange={(e) => setTabSettings({...tabSettings, icon: e.target.value})} className={selectClass}>
                        {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
              </div>
          </div>
        </div>

        {/* Tombol Portal */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <MousePointerClick className="text-cyan-500" />
                <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>Tombol Portal / Aplikasi</h2>
            </div>
            <ToggleSwitch active={portalConfig.isVisible} onToggle={() => setPortalConfig({...portalConfig, isVisible: !portalConfig.isVisible})} />
          </div>
          
          {portalConfig.isVisible ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                 <div>
                    <label className={labelClass}>Label Tombol</label>
                    <input type="text" value={portalConfig.label} onChange={(e) => setPortalConfig({...portalConfig, label: e.target.value})} placeholder={isProgramKerja ? "Akses SIPD / E-Planning" : "Akses E-Kinerja"} className={inputClass} />
                 </div>
                 <div>
                    <label className={labelClass}>Link Tujuan (URL)</label>
                    <input type="text" value={portalConfig.url} onChange={(e) => setPortalConfig({...portalConfig, url: e.target.value})} placeholder="https://..." className={inputClass} />
                 </div>
              </div>
          ) : (
             <div className="text-sm text-gray-400 italic">Tombol Portal dinonaktifkan.</div>
          )}
        </div>
      </div>

      {/* --- 1. FILE PREVIEW UTAMA --- */}
      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <FileImage className="text-indigo-500" />
          <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>1. File Preview Utama (Juknis/SOP)</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
                 <div className={`p-4 rounded-xl border ${isLight ? "bg-blue-50/50 border-blue-100" : "bg-blue-900/10 border-blue-800"}`}>
                    <div className="flex items-center gap-2 mb-3">
                         <Type size={16} className="text-blue-500"/>
                         <h3 className="text-sm font-bold uppercase text-blue-600 tracking-wider">Teks Header Viewer</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className={labelClass}>Judul Bagian</label>
                            <input type="text" value={previewConfig.title} onChange={(e) => setPreviewConfig({...previewConfig, title: e.target.value})} className={inputClass} placeholder="Pratinjau Dokumen" />
                        </div>
                        <div>
                            <label className={labelClass}>Deskripsi Singkat</label>
                            <textarea value={previewConfig.desc} onChange={(e) => setPreviewConfig({...previewConfig, desc: e.target.value})} className={textareaClass} placeholder="Penjelasan singkat..." />
                        </div>
                    </div>
                 </div>
            </div>

            <div className="lg:col-span-7">
                <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors mb-4 ${isLight ? "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50" : "border-gray-600 hover:bg-gray-700/50"}`}>
                    <UploadCloud className={`w-10 h-10 mb-2 ${isLight ? "text-indigo-300" : "text-gray-500"}`} />
                    <p className={`text-xs mb-3 ${isLight ? "text-indigo-400" : "text-gray-400"}`}>PDF Only (Max 1 File Utama)</p>
                    <input ref={fileInputRef} type="file" accept="application/pdf,image/png,image/jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/30">Pilih File</label>
                    {file && <span className="mt-2 text-sm font-semibold text-indigo-500">{file.name}</span>}
                    {file && (
                    <button onClick={() => handleUpload()} disabled={uploading} className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2">
                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Upload
                    </button>
                    )}
                </div>

                <h3 className={`font-semibold mb-2 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>File Aktif:</h3>
                {loadingFile ? (<div className="flex items-center gap-2 text-gray-500 text-sm"><Loader2 className="animate-spin w-4 h-4"/> Memuat...</div>) : availablePreviewFiles.length === 0 ? (<div className="p-3 rounded-lg bg-slate-100 dark:bg-gray-700 text-gray-500 text-xs italic text-center">Belum ada file preview.</div>) : (
                    <ul className="space-y-2">
                    {availablePreviewFiles.map((f, i) => (
                        <li key={i} className={`flex items-center justify-between p-2 rounded-lg border ${isLight ? "bg-slate-50 border-gray-200" : "bg-gray-700 border-gray-600"}`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                            {f.name.endsWith('.pdf') ? <FileText className="text-rose-500 shrink-0" size={18} /> : <FileImage className="text-purple-500 shrink-0" size={18} />}
                            <a href={f.url} target="_blank" rel="noreferrer" className="truncate text-xs font-medium hover:text-indigo-500 transition underline decoration-dotted">{f.name}</a>
                        </div>
                        <button onClick={() => handleDelete(f.name)} disabled={deleting === f.name} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition">
                            {deleting === f.name ? <Loader2 className="animate-spin w-3 h-3"/> : <Trash2 size={14}/>}
                        </button>
                        </li>
                    ))}
                    </ul>
                )}
            </div>
        </div>
        {duplicateInfo && <DuplicateFileAlert fileName={duplicateInfo.file.name} locations={duplicateInfo.locations} onCancel={() => setDuplicateInfo(null)} onConfirm={() => { handleUpload(true); }} />}
      </div>

      {/* --- 2. INDIKATOR / DASAR HUKUM --- */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ListChecks className={enablePersyaratan ? "text-emerald-500" : "text-gray-400"} />
            <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>2. {labelPersyaratan}</h2>
          </div>
          <ToggleSwitch active={enablePersyaratan} onToggle={() => setEnablePersyaratan(!enablePersyaratan)} />
        </div>
        {enablePersyaratan ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {persyaratan.map((req, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={req} onChange={(e) => handleReqChange(idx, e.target.value)} placeholder={`Poin ${idx + 1}`} className={inputClass} />
                <button onClick={() => delReq(idx)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-2 rounded-lg"><Trash2 size={18} /></button>
              </div>
            ))}
            <button onClick={addReq} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mt-2"><Plus size={16} /> Tambah Item</button>
          </div>
        ) : (<div className="text-gray-500 text-sm italic">Bagian ini dinonaktifkan.</div>)}
      </div>

      {/* --- 3. SIKLUS / STRUKTUR --- */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <GitMerge className={enableAlur ? "text-indigo-500" : "text-gray-400"} />
            <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>3. {labelAlur}</h2>
          </div>
          <ToggleSwitch active={enableAlur} onToggle={() => setEnableAlur(!enableAlur)} />
        </div>
        {enableAlur ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {alur.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-lg border relative transition-colors border-l-4 ${item.color === 'blue' ? 'border-l-blue-500' : ''} ${item.color === 'emerald' ? 'border-l-emerald-500' : ''} ${item.color === 'purple' ? 'border-l-purple-500' : ''} ${item.color === 'amber' ? 'border-l-amber-500' : ''} ${item.color === 'rose' ? 'border-l-rose-500' : ''} ${item.color === 'indigo' ? 'border-l-indigo-500' : ''} ${isLight ? "bg-slate-50 border-gray-200" : "bg-gray-700 border-gray-600"}`}>
                <span className="absolute top-2 right-2 text-xs font-bold text-gray-400">Step {idx + 1}</span>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 grid gap-3">
                    <div>
                      <label className={labelClass}>{isProgramKerja ? "Tahapan" : "Jabatan / Posisi"}</label>
                      <input type="text" value={item.title} onChange={(e) => handleAlurChange(idx, "title", e.target.value)} placeholder={isProgramKerja ? "Contoh: Musrenbang" : "Contoh: Kepala Sub Bagian"} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Keterangan Singkat</label>
                      <input type="text" value={item.desc} onChange={(e) => handleAlurChange(idx, "desc", e.target.value)} placeholder="Keterangan..." className={inputClass} />
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <label className={labelClass}><Palette size={12}/> Warna Label</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((c) => (
                        <button key={c.value} onClick={() => handleAlurChange(idx, "color", c.value)} className={`w-6 h-6 rounded-full ${c.bg} transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${item.color === c.value ? 'ring-2 ring-offset-2 ring-gray-500 scale-110' : 'opacity-70 hover:opacity-100'}`} title={c.label} />
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => delAlur(idx)} className="mt-3 text-xs text-rose-500 hover:underline flex items-center gap-1"><Trash2 size={12} /> Hapus Item</button>
              </div>
            ))}
            <button onClick={addAlur} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"><Plus size={16} /> Tambah Item</button>
          </div>
        ) : (<div className="text-gray-500 text-sm italic">Bagian ini dinonaktifkan.</div>)}
      </div>

      {/* --- 4. AREA DOWNLOAD --- */}
      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <DownloadCloud className="text-amber-500" />
          <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>4. Area Download Dokumen</h2>
        </div>
        
        {/* Full Control Settings */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
             <div className="flex items-center gap-2 mb-2">
                 <Type size={16} className="text-gray-500"/>
                 <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Pengaturan Header Card</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Judul Card</label>
                    <input type="text" value={downloadConfig.title} onChange={(e) => setDownloadConfig({...downloadConfig, title: e.target.value})} className={inputClass} placeholder="Unduh Dokumen" />
                </div>
                <div>
                    <label className={labelClass}>Deskripsi Singkat</label>
                    <input type="text" value={downloadConfig.desc} onChange={(e) => setDownloadConfig({...downloadConfig, desc: e.target.value})} className={inputClass} placeholder="Silakan unduh..." />
                </div>
             </div>
        </div>

        {/* Upload Button Area */}
        <div className="mb-6">
            <input 
                ref={downloadInputRef} 
                type="file" 
                onChange={handleDownloadFileUpload} 
                className="hidden" 
                id="download-file-upload" 
            />
            <label 
                htmlFor="download-file-upload" 
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isLight 
                    ? "border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400" 
                    : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                } ${uploadingDownload ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {uploadingDownload ? (
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Loader2 className="animate-spin" />
                        <span className="font-medium">Mengunggah file...</span>
                    </div>
                ) : (
                    <>
                        <UploadCloud className="w-10 h-10 text-indigo-500 mb-2" />
                        <span className="text-sm font-bold text-indigo-600">Klik untuk Upload File Dokumen</span>
                        <span className="text-xs text-gray-500 mt-1">Otomatis tersimpan dan masuk ke daftar di bawah</span>
                    </>
                )}
            </label>
        </div>

        {/* List Files */}
        <div className="space-y-3">
          <label className={labelClass}>Daftar File Tersedia</label>
          {downloads.length > 0 ? (
            downloads.map((dl, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-gray-700 border-gray-600"}`}>
                
                {/* Kiri: Nama File (Editable) */}
                <div className="flex-1 mr-4">
                    <label className="text-[10px] text-gray-400 block mb-1">Nama Tampilan</label>
                    <input 
                        type="text" 
                        value={dl.name} 
                        onChange={(e) => handleDlNameChange(idx, e.target.value)} 
                        placeholder="Nama File" 
                        className={inputClass} 
                    />
                </div>

                {/* Tengah: Link (Read-Only) */}
                <div className="flex-1 mr-4 overflow-hidden hidden md:block">
                    <label className="text-[10px] text-gray-400 block mb-1">Link File (Otomatis)</label>
                    <div className="flex items-center gap-2 text-sm text-gray-500 italic bg-slate-100 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                        <FileText size={14} className="shrink-0"/>
                        <span className="truncate">
                           {dl.url ? dl.url.split('/').pop() : "File belum diupload"}
                        </span>
                        <a href={dl.url || "#"} target="_blank" rel="noreferrer" title="Lihat File" className="ml-auto hover:text-indigo-500">
                            <ExternalLink size={14}/>
                        </a>
                    </div>
                </div>

                {/* Kanan: Delete */}
                <div className="flex items-end pt-5">
                    <button 
                        onClick={() => delDl(idx)} 
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition"
                        title="Hapus dari daftar"
                    >
                        <Trash2 size={18}/>
                    </button>
                </div>
                </div>
            ))
          ) : (
              <div className="text-center py-4 text-sm text-gray-400 italic bg-slate-50 dark:bg-gray-800 rounded-lg">
                  Belum ada file yang diunggah.
              </div>
          )}
        </div>
      </div>

      {/* --- 5. KONTAK --- */}
      <div className={cardClass}>
         <div className={sectionHeaderClass}>
            <Phone className="text-emerald-500" />
            <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>5. Kontak Verifikator / Pengaduan</h2>
         </div>

         {/* Full Control Settings */}
         <div className="mb-6 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                 <AlignLeft size={16} className="text-gray-500"/>
                 <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Pengaturan Header Card</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className={labelClass}>Judul Kontak</label>
                    <input type="text" value={contactConfig.title} onChange={(e) => setContactConfig({...contactConfig, title: e.target.value})} className={inputClass} placeholder="Kontak Layanan" />
                 </div>
                 <div>
                    <label className={labelClass}>Pilih Ikon</label>
                    <div className="flex gap-2">
                        <div className="p-2 bg-slate-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-500 flex items-center justify-center min-w-[45px]">
                           <SelectedContactIcon size={20} className="text-emerald-500"/>
                        </div>
                        <select value={contactConfig.icon} onChange={(e) => setContactConfig({...contactConfig, icon: e.target.value})} className={selectClass}>
                            {contactIconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                 </div>
             </div>
             
             <div>
                 <label className={labelClass}>Deskripsi</label>
                 <textarea value={contactConfig.desc} onChange={(e) => setContactConfig({...contactConfig, desc: e.target.value})} className={textareaClass} placeholder="Hubungi kami jika ada kendala..." />
             </div>
         </div>

         {/* List Contacts */}
         <label className={labelClass}>Daftar Kontak</label>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact, idx) => (
                <div key={idx} className={`p-4 rounded-lg border relative ${isLight ? "bg-slate-50 border-gray-200" : "bg-gray-700 border-gray-600"}`}>
                   <button onClick={() => delContact(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-rose-500 transition"><Trash2 size={16}/></button>
                   <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Label / Nama</label>
                        <input type="text" value={contact.name} onChange={(e) => handleContactChange(idx, 'name', e.target.value)} placeholder="Misal: Admin" className={inputClass} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Nomor Telepon/WA</label>
                        <input type="text" value={contact.number} onChange={(e) => handleContactChange(idx, 'number', e.target.value)} placeholder="0812..." className={inputClass} />
                      </div>
                   </div>
                </div>
            ))}
            <button onClick={addContact} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed h-full min-h-[150px] transition ${isLight ? "border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-400" : "border-gray-600 hover:bg-gray-700 text-gray-400"}`}>
                <Plus size={32} className="mb-2"/>
                <span className="text-sm font-medium">Tambah Kontak</span>
            </button>
         </div>
      </div>

      {/* --- 6. AGENDA / URAIAN TUGAS (SKY BLUE THEME) --- */}
      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <CalendarRange className="text-sky-500" />
          <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>6. {labelJadwal}</h2>
        </div>
        <div className="space-y-4">
          {jamOperasional.map((jam, idx) => (
            <div key={idx} className={`p-3 rounded-lg border transition-colors ${isLight ? "bg-white border-gray-200" : "bg-gray-800/50 border-gray-700"}`}>
              <div className="flex gap-2 mb-2">
                <input 
                    type="text" 
                    value={jam.day} 
                    onChange={(e) => handleJamChange(idx, "day", e.target.value)} 
                    placeholder={isProgramKerja ? "Hari/Tanggal (ex: Senin, 20 Okt)" : "Jabatan (ex: Sekretaris)"} 
                    className={`${inputClass} w-1/2`} 
                />
                
                {/* LOGIKA VISUAL: SKY BLUE UTK KERJA (Sesuai Referensi PAUD) */}
                <select 
                    value={jam.status} 
                    onChange={(e) => handleJamChange(idx, "status", e.target.value)} 
                    className={`w-1/2 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer text-sm font-medium
                        ${jam.status === 'work' 
                            ? (isLight ? 'text-sky-700 bg-sky-50 border-sky-200' : 'text-sky-400 bg-sky-900/20 border-sky-800') 
                        : jam.status === 'off' 
                            ? (isLight ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-rose-400 bg-rose-900/20 border-rose-800') 
                        :   
                          (isLight ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-amber-400 bg-amber-900/20 border-amber-800')
                        }
                    `}
                >
                  {statusOptions.map(opt => (<option key={opt.value} value={opt.value} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">{opt.label}</option>))}
                </select>

                <button onClick={() => delJam(idx)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-lg transition"><Trash2 size={18}/></button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`text-[10px] block mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>{isProgramKerja ? "Nama Kegiatan" : "Ringkasan Tugas"}</label>
                    <input type="text" value={jam.time} onChange={(e) => handleJamChange(idx, "time", e.target.value)} placeholder={isProgramKerja ? "Rapat Koordinasi" : "Memimpin sekretariat..."} className={inputClass} />
                  </div>
                  <div>
                    <label className={`text-[10px] block mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>{isProgramKerja ? "PIC / Penanggung Jawab" : "Rincian Tugas (Tekan Enter untuk baris baru)"}</label>
                    {isProgramKerja ? (
                        <input type="text" value={jam.breakTime} onChange={(e) => handleJamChange(idx, "breakTime", e.target.value)} placeholder="Kasubag Umum" className={inputClass} />
                    ) : (
                        <textarea value={jam.breakTime} onChange={(e) => handleJamChange(idx, "breakTime", e.target.value)} placeholder="- Menyusun rencana...&#10;- Mengevaluasi..." className={`${textareaClass} h-[50px] min-h-[50px] text-sm`} />
                    )}
                  </div>
              </div>
            </div>
          ))}
          <button onClick={addJam} className="text-sm text-sky-600 hover:text-sky-400 font-medium flex items-center gap-1"><Plus size={16}/> Tambah Item</button>
        </div>
      </div>

      {/* --- 7. PETA LOKASI --- */}
      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <MapPin className="text-rose-500" />
          <h2 className={`text-lg font-bold ${isLight ? "text-gray-800" : "text-white"}`}>7. Link Peta Lokasi</h2>
        </div>
        <label className={labelClass}>URL Google Maps</label>
        <input type="text" value={mapLink} onChange={(e) => setMapLink(e.target.value)} placeholder="http://googleusercontent.com/..." className={inputClass} />
      </div>

      {/* --- TOMBOL SIMPAN GLOBAL --- */}
      <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700 pb-6">
          <button onClick={handleSaveContent} disabled={savingContent} className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed">
              {savingContent ? <Loader2 className="animate-spin" /> : <Save size={24} />} Simpan Semua Konten Layanan Ini
          </button>
            <p className={`text-center mt-3 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>Data akan disimpan secara spesifik untuk layanan: <strong>{layananOptions.find(o => o.value === selectedLayanan)?.label}</strong>.</p>
        </div>

    </div>
  );
}
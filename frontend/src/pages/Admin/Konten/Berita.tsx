import React, { useState, useEffect, ChangeEvent, FormEvent,useRef } from "react";
import { useMemo } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';
import { saveAs } from "file-saver";
import DOMPurify from 'dompurify';
import { extractFirstImage } from "../../../utils/helper";
import UploadToHighlight from "../../../Components/UploadToHighlight";
import ButtonSaveBerita from "../../../Components/ui/ButtonSaveBerita";
import { Document, Packer, Paragraph, TextRun } from "docx";



interface Berita {
  id: number;
  judul: string;
  isi_berita: string;
  penulis: string;
  gambar: string;
  tanggal_upload: string;
  slug: string;
  views?: number;
  kategori?: string;           // optional
  status?: "draft" | "publish" | string;
  tags?: string[];             // biasanya array
  jadwal?: string | null;      // bisa string datetime
}

export default function FormBerita() {
  // State form

  const [judul, setJudul] = useState<string>("");
  const [isiBerita, setIsiBerita] = useState<string>("");
  const [penulis, setPenulis] = useState<string>("");
  const [gambar, setGambar] = useState<File | null>(null);
  const [tanggalUpload, setTanggalUpload] = useState<string>(() =>
    getNowLocalDate()
  );

  // List berita & pagination
  const [listBerita, setListBerita] = useState<Berita[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const safeHTML = DOMPurify.sanitize(isiBerita);
  // Edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  // --- ✅ Kontrol buka/tutup card daftar berita
  const [showList, setShowList] = useState(false);

  // --- STATE sidebar ---
  const [status, setStatus] = useState<"draft" | "publik" | "">("");
  const [jadwal, setJadwal] = useState("");
  const [kategori, setKategori] = useState("");
  const [tags, setTags] = useState("");


  // --- HANDLER ---
  const simpanDraft = () => {
    // logika simpan draft
    console.log("Simpan Draft", { judul, isiBerita, status, jadwal, kategori, tags });
  };

  const gantiGambar = () => {
    // misal: trigger klik input file tersembunyi
    document.getElementById("upload-gambar")?.click();
  };

  const hapusGambar = () => {
    setGambar(null);
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setStatus(e.target.value as "draft" | "publik");
};

const handleExportDocx = async () => {
  const temp = document.createElement("div");
  temp.innerHTML = isiBerita;          // isiBerita adalah state ReactQuill
  const plainText = temp.textContent || temp.innerText || "";

  const doc = new Document({
    sections: [
      {
        children: plainText.split("\n").map(
          (line) =>
            new Paragraph({
              children: [new TextRun(line)],
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "berita.docx");
};

const handleExportPdf = async () => {
  // contoh paling sederhana, misal hanya cetak ke PDF browser
  const win = window.open("", "_blank");
  win?.document.write(isiBerita);
  win?.print();
};

const quillRef = useRef<any>(null);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("http://localhost:8000/api/upload-editor-image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        // ✅ Jika backend mengembalikan URL gambar
        if (data.url) {
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection(true);
          quill.insertEmbed(range.index, "image", data.url);
        } else {
          console.error("Respon backend tidak mengandung URL:", data);
        }
      } catch (err) {
        console.error("Gagal upload gambar:", err);
      }
    };
  };

  const modules = useMemo(
  () => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: { image: handleImageUpload },
    },
  }),
  []
);


 function formatTagsOnInput(raw: string) {
    // parse raw char-by-char to detect ", " completions
    const parts: { text: string; completed: boolean }[] = [];
    let token = "";
    let i = 0;
    while (i < raw.length) {
      const ch = raw[i];
      if (ch === "," && raw[i + 1] === " ") {
        // Completed token (because comma followed by space)
        const t = token.trim();
        parts.push({ text: t, completed: true });
        token = "";
        i += 2; // skip comma and space
        continue;
      }
      // keep char
      token += ch;
      i++;
    }
    // push last (in-progress) token if any (may be empty)
    if (token.length > 0) {
      parts.push({ text: token.trim(), completed: false });
    } else {
      // if raw ends with ", " we've already pushed completed tokens and token is empty
    }

    // Rebuild string:
    let out = "";
    for (let idx = 0; idx < parts.length; idx++) {
      const p = parts[idx];
      if (p.completed) {
        if (p.text) {
          out += (p.text.startsWith("#") ? p.text : `#${p.text}`);
        }
        out += ", ";
      } else {
        out += p.text;
      }
    }

    // Preserve the trailing comma (without space) if user typed one but not space:
    if (!raw.endsWith(", ") && raw.endsWith(",")) {
      // raw ends with comma (no space). Ensure out ends with comma (no extra space).
      if (!out.endsWith(",")) out += ",";
    }

    return out;
  }

  // Finalize tags before submission: ensure every tag starts with '#', join by ', '
  function finalizeTagsForSubmit(s: string) {
    if (!s) return "";
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => (x.startsWith("#") ? x : `#${x}`))
      .join(", ");
  }

  // input change handler for tags
  function handleTagsChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const formatted = formatTagsOnInput(raw);
    setTags(formatted);
  }



// --- Ambil data berita dari API ---
const fetchBerita = () => {
  fetch("http://localhost:8000/api/berita", { mode: "cors" })
    .then((res) => res.json())
    .then((data: Berita[]) => {
      // Urutkan dari terbaru ke terlama
      const sorted = data.sort((a, b) => {
        const tA = new Date(a.tanggal_upload).getTime();
        const tB = new Date(b.tanggal_upload).getTime();
        return tB - tA; // descending
      });
      setListBerita(sorted);
    })
    .catch((err) => {
      console.error("Gagal ambil data berita:", err);
    });
};

useEffect(() => {
  fetchBerita();
}, []);

// --- Ganti file gambar ---
function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
  if (e.target.files && e.target.files.length > 0) {
    setGambar(e.target.files[0]);
  } else {
    setGambar(null);
  }
}

// --- Reset form ---
function resetForm() {
  setJudul("");
  setIsiBerita("");
  setPenulis("");
  setGambar(null);
  setIsEditMode(false);
  setEditSlug(null);
  setTanggalUpload(getNowLocalDate());
}

// --- Helper: tanggal hari ini (YYYY-MM-DD) ---
function getNowLocalDate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// --- Kirim data ke backend ---
function submitBerita() {
  const formData = new FormData();
  if (isEditMode) {
    formData.append("_method", "PUT");
  }

  // === Kirim field hanya jika TIDAK kosong ===
  if (judul.trim() !== "") formData.append("judul", judul);
  if (isiBerita.trim() !== "") formData.append("isi_berita", isiBerita);
  if (penulis.trim() !== "") formData.append("penulis", penulis);
  if (status.trim() !== "") formData.append("status", status);
  if (jadwal) formData.append("jadwal", jadwal);
  if (kategori) formData.append("kategori", kategori);

  // === Gambar cuma dikirim kalau ada upload baru ===
  if (gambar) {
    formData.append("gambar", gambar);
  }

  // === Tanggal upload (FIX: tidak parse ulang, kirim raw saja) ===
  if (tanggalUpload && tanggalUpload.trim() !== "") {
    formData.append("tanggal_upload", tanggalUpload);
  }

  // === Tags ===
  const tagArray = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t.slice(1) : t));

  if (tagArray.length > 0) {
    formData.append("tags", tagArray.join(",")); // backend menerima string, bukan array
  }

  // === Tentukan URL ===
  const url =
    isEditMode && editSlug && editSlug.trim() !== ""
      ? `http://localhost:8000/api/berita/${encodeURIComponent(editSlug)}`
      : "http://localhost:8000/api/berita";

  console.log("=== DEBUG: DATA DIKIRIM ===");
  console.log("isEditMode:", isEditMode);
  console.log("editSlug:", editSlug);
  console.log("judul:", judul);
  console.log("isi_berita:", isiBerita);
  console.log("penulis:", penulis);
  console.log("status:", status);
  console.log("jadwal:", jadwal);
  console.log("kategori:", kategori);
  console.log("tanggalUpload (raw):", tanggalUpload);
  console.log("gambar:", gambar);

  console.log("=== DEBUG: TAGS ===");
  console.log("tags RAW:", tags);
  console.log("tags parsed:", tagArray);

  console.log("=== DEBUG: URL ===", url);

  console.log("=== DEBUG: FORMDATA ===");
  for (let pair of formData.entries()) {
    console.log(pair[0], ":", pair[1]);
  }

  // === Fetch ===
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengunggah berita");
      }

      Swal.fire({
        icon: "success",
        title: isEditMode
          ? "Berita berhasil diperbarui!"
          : "Berita berhasil ditambahkan!",
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchBerita();

      if (!isEditMode) {
        setCurrentPage(Math.ceil((listBerita.length + 1) / itemsPerPage));
      }

      resetForm();
      return data;
    })
    .catch((err) => {
      console.error("Gagal mengunggah / update berita:", err);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan!",
        text: err.message || "Gagal mengunggah / memperbarui berita.",
      });
    });
}

// --- Submit manual (Enter ditekan) ---
function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  submitBerita();
}

// --- Tombol TERBITKAN ---
function handleClickTerbitkan(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  if (status !== "publik") {
    Swal.fire({
      icon: "warning",
      title: "Pilihan tidak sesuai",
      text: "Untuk menerbitkan berita, pilih radio 'Publik' terlebih dahulu.",
    });
    return;
  }
  submitBerita();
}

// --- Tombol SIMPAN DRAFT ---
function handleClickSimpanDraft(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  if (status !== "draft") {
    Swal.fire({
      icon: "warning",
      title: "Pilihan tidak sesuai",
      text: "Untuk menyimpan sebagai draft, pilih radio 'Draft' terlebih dahulu.",
    });
    return;
  }

  const form = e.currentTarget.closest("form");
  if (form) {
    handleSubmit(
      new Event("submit") as unknown as FormEvent<HTMLFormElement>
    );
  }
}

// --- Klik Edit: isi form dengan data berita ---
function handleEdit(berita: Berita) {
  console.log("JADWAL RAW DARI BACKEND:", berita.jadwal);
  setIsEditMode(true);
  setEditSlug(berita.slug);
  setJudul(berita.judul);
  setIsiBerita(berita.isi_berita);
  setPenulis(berita.penulis);
  setGambar(null);

  // FIX BESAR: jangan parse tanggal dengan new Date()
  setTanggalUpload(
    berita.tanggal_upload
      ? berita.tanggal_upload.slice(0, 10)
      : getNowLocalDate()
  );

  // BONUS FIX (wajib biar edit mode lengkap)
  setKategori(berita.kategori ?? "");
  setStatus(
  berita.status === "draft" || berita.status === "publik"
    ? berita.status
    : ""
);
  setTags(berita.tags ? berita.tags.join(", ") : "");
  setJadwal(berita.jadwal ?? "");
}

// --- Hapus berita ---
function handleDelete(slug: string) {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Berita yang dihapus tidak bisa dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8000/api/berita/${slug}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            Swal.fire({
              icon: "success",
              title: "Berita berhasil dihapus!",
              timer: 1500,
              showConfirmButton: false,
            });
            fetchBerita();
            setCurrentPage((p) =>
              Math.min(
                p,
                Math.ceil((listBerita.length - 1) / itemsPerPage) || 1
              )
            );
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal menghapus berita!",
            });
          }
        })
        .catch((err) => {
          console.error("Gagal menghapus berita:", err);
          Swal.fire({
            icon: "error",
            title: "Terjadi kesalahan!",
            text: err.message || "Gagal menghapus berita.",
          });
        });
    }
  });
}

  // Pagination
  // Urutkan dari paling lama ke paling baru
const sortedBerita = [...listBerita].sort((a, b) => {
  const ta = a.tanggal_upload ? new Date(a.tanggal_upload).getTime() : 0;
  const tb = b.tanggal_upload ? new Date(b.tanggal_upload).getTime() : 0;
  return ta - tb; // lama duluan
});

const totalPages = Math.ceil(sortedBerita.length / itemsPerPage);
const startIdx = (currentPage - 1) * itemsPerPage;
const currentBerita = sortedBerita.slice(startIdx, startIdx + itemsPerPage);

  return (
  <div>
    {/* ==============================
        WRAPPER FORM / EDIT BERITA
    =============================== */}
    <div className="bg-white rounded-md shadow-md p-6 relative z-10">
      {/* FORM TAMBAH / EDIT BERITA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== KIRI: Area Konten Utama (±70%) ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Judul Berita */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Judul Berita
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              placeholder="Ketik judul berita di sini..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300
                 focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                 outline-none placeholder-gray-400 transition"
            />
          </div>

          {/* >>>>> TAMBAHKAN INI: Input Penulis <<<<< */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Penulis
            </label>
            <input
              type="text"
              value={penulis}
              onChange={(e) => setPenulis(e.target.value)}
              required
              placeholder="Masukkan nama penulis..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300
                 focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                 outline-none placeholder-gray-400 transition"
            />
          </div>

          {/* Isi Berita – rich text editor */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Isi Berita
            </label>

            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={isiBerita}
              onChange={setIsiBerita}
              placeholder="Tulis isi berita di sini..."
              className="bg-white rounded-lg border border-gray-300 min-h-[300px] max-h-[500px] overflow-auto"
              modules={modules}
            />

            <ButtonSaveBerita
              variant="primary"
              icon="download"
              onClick={handleExportDocx}
            >
              Simpan Word
            </ButtonSaveBerita>

            <ButtonSaveBerita
              variant="danger"
              icon="file"
              onClick={handleExportPdf}
            >
              Simpan PDF
            </ButtonSaveBerita>
          </div>
        </div>

        {/* ===== KANAN: Sidebar Pengaturan (±30%) ===== */}
        <div className="space-y-6">
          {/* Box 1: Status & Visibilitas */}
          <div className="bg-white rounded-lg border border-gray-200 shadow p-4 space-y-4">
            <h3 className="font-bold text-gray-800">Status &amp; Visibilitas</h3>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === "draft"}
                  onChange={handleStatusChange}
                />
                <span>Draft</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="publik"
                  checked={status === "publik"}
                  onChange={handleStatusChange}
                />
                <span>Publik</span>
              </label>
            </div>

            {/* Jadwal terbit */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Jadwalkan
              </label>
              <input
                type="datetime-local"
                value={jadwal}
                onChange={(e) => setJadwal(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300
                   focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={isEditMode ? submitBerita : handleClickTerbitkan}
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditMode ? "Simpan" : "Terbitkan"}
              </button>
              <button
                type="button"
                onClick={handleClickSimpanDraft}
                className="flex-1 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Simpan Draft
              </button>
            </div>
          </div>

          {/* Box 2: Organisasi (Kategori & Tags) */}
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Pilih Kategori <span className="text-red-500">*</span>
          </label>

          <select
            required
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300
               focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="wisata">Wisata</option>
            <option value="kuliner">Kuliner</option>
          </select>

          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Tags <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={tags}
            onChange={handleTagsChange}
            placeholder="pisahkan dengan koma"
            className="w-full px-3 py-2 rounded border border-gray-300
               focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      </div>
    </div>
    {/* ============ PENUTUP FORM WRAPPER =========== */}


    {/* ✅ LIST DIPINDAHKAN KELUAR DARI WRAPPER FORM */}
    <div className="mt-6">
      {/* Tombol Tampilkan/Sembunyikan */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowList((prev) => !prev)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {showList ? "Sembunyikan List Berita" : "Tampilkan List Berita"}
        </button>
      </div>

      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden relative z-0 rounded-md shadow-md bg-white p-4"
          >
            {/* === LIST BERITA === */}
            <h2 className="text-2xl font-bold mb-4 text-gray-700">
              Daftar Berita
            </h2>

            {listBerita.length === 0 ? (
              <p className="text-gray-500">Belum ada berita.</p>
            ) : (
              <div className="overflow-x-auto rounded-md shadow">
                <table className="min-w-full table-auto border border-gray-300 rounded-md">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border">Gambar</th>
                      <th className="px-4 py-2 border">Judul</th>
                      <th className="px-4 py-2 border">Tanggal</th>
                      <th className="px-4 py-2 border">Penulis</th>
                      <th className="px-4 py-2 border">Views</th>
                      <th className="px-4 py-2 border">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBerita.map((berita) => (
                      <tr
                        key={berita.id}
                        className="text-center hover:bg-gray-50 transition"
                      >
                        {/* Kolom gambar */}
                        <td className="px-4 py-2 border">
                          <img
                            src={
                              berita.gambar
                                ? `http://localhost:8000/storage/${berita.gambar}`
                                : extractFirstImage(berita.isi_berita) || "https://placehold.co/80x80"
                            }
                            alt={berita.judul}
                            className="w-16 h-16 object-cover rounded-md mx-auto"
                          />
                        </td>

                        {/* Kolom judul */}
                        <td className="px-4 py-2 border text-left">{berita.judul}</td>

                        <td className="px-4 py-2 border">
                          {berita.tanggal_upload
                            ? new Date(berita.tanggal_upload).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "-"}
                        </td>

                        <td className="px-4 py-2 border">{berita.penulis}</td>
                        <td className="px-4 py-2 border">{berita.views ?? 0}</td>

                        <td className="px-4 py-2 border space-y-1">
                          <button
                            onClick={() => handleEdit(berita)}
                            className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 w-full"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(berita.slug)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full"
                          >
                            Hapus
                          </button>
                          <UploadToHighlight slug={berita.slug} />
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === idx + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

}

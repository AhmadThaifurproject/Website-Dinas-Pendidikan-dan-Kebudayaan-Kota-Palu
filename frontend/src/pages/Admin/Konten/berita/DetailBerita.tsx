import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { extractFirstImage } from "../../../../utils/helper";

interface Tag {
  id: number;
  nama: string;
}

interface Berita {
  id?: number;
  title: string;
  isi?: string;           // untuk detail
  description?: string;   // untuk preview
  image_url: string;
  slug?: string;
  penulis?: string;
  tanggal_upload?: string;
  views?: number;
  tags?: Tag[];
  isi_berita?: string;
}

function DetailBerita() {
  const { slug } = useParams();
  console.log("Slug yang diterima dari URL:", slug);

  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:8000/api/berita/slug/${slug}`);
        if (!res.ok) throw new Error("Berita tidak ditemukan");
       const raw = await res.json();
        const b = raw.data;

        setBerita({
          id: b.id,
          title: b.judul,
          isi_berita: b.isi_berita,
          image_url: raw.gambar_url || extractFirstImage(b.isi_berita), // fallback dari isi_berita
          penulis: b.penulis,
          tanggal_upload: b.tanggal_upload,
          tags: b.tags,
        });
      } catch (err: any) {
        console.error("Gagal fetch berita:", err);
        setError(err.message || "Terjadi kesalahan");
        setBerita(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [slug]);

  if (loading)
    return <div className="text-center py-10 text-gray-500">Memuat berita...</div>;

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (!berita)
    return (
      <div className="text-center py-10 text-gray-500">
        Berita tidak ditemukan.
      </div>
    );

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Banner */}
      <section className="relative h-[45vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

        <div className="relative z-10 h-full flex items-start px-10 md:px-24 pt-20 md:pt-24">
          <div className="max-w-2xl">
            <div className="w-20 h-1 bg-yellow-300 mb-4"></div>
            <div className="text-sm text-yellow-300 mb-2 tracking-widest uppercase">
              <Link to="/" className="hover:underline text-white font-medium">
                Beranda
              </Link>
              <span className="mx-1">/</span>
              <span className="text-white">Berita</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              {berita.title}
            </h1>

            <p className="text-lg text-white/90 font-light">
              Baca berbagai artikel menarik, kabar terbaru, dan informasi resmi mengenai kegiatan
              pendidikan di{" "}
              <span className="font-semibold text-white">
                Dinas Pendidikan Kota Palu
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Konten Berita */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Konten Artikel */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{berita.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            <span>{berita.penulis || "Admin"}</span> |{" "}
            <span>
              {berita.tanggal_upload
                ? (() => {
                    const d = new Date(berita.tanggal_upload);
                    return isNaN(d.getTime())
                      ? "Tanggal tidak valid"
                      : d.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                  })()
                : "Tanggal tidak tersedia"}
            </span>
          </div>

          {/*  gambar dari Quill tampil langsung */}
          <div
            className="prose prose-blue max-w-none text-gray-800 berita-konten"
            dangerouslySetInnerHTML={{ __html: berita.isi_berita || berita.isi || "" }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Berita Unggulan</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Artikel Terbaru</li>
              <li>Berita Populer</li>
              <li>Topik Hangat</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Tag</h2>
            <div className="flex flex-wrap gap-2">
              {berita.tags && berita.tags.length > 0 ? (
                berita.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tag/${tag.nama}`}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                  >
                    #{tag.nama}
                  </Link>
                ))
              ) : (
                <span className="text-gray-500 text-sm">Tidak ada tag</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailBerita;

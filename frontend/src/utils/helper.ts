// src/utils/helper.ts

/**
 * Ambil URL gambar pertama dari HTML konten (misalnya dari ReactQuill)
 * @param html - string HTML dari isi_berita
 * @returns string | null - URL gambar pertama yang ditemukan
 */
export function extractFirstImage(html: string | null): string | null {
  if (!html) return null;

  const div = document.createElement("div");
  div.innerHTML = html;

  const img = div.querySelector("img");
  return img?.src || null;
}

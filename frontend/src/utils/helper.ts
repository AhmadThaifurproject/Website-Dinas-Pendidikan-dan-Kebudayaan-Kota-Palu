// src/utils/helper.ts

/**
 * Ambil URL gambar pertama dari HTML konten (misalnya dari ReactQuill)
 * @param html - string HTML dari isi_berita
 * @returns string | null - URL gambar pertama yang ditemukan
 */
export function extractFirstImage(html: string | null): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}
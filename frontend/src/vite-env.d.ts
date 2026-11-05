/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Definisikan variabel kita di sini agar tidak merah di kodingan
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
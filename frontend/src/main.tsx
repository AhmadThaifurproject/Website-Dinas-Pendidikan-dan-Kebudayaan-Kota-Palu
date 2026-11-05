import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';
import App from "./App.tsx";
import "./index.css";
import "swiper/css";
import "swiper/css/autoplay";

// ==========================================================
// 1. ✅ KONFIGURASI GLOBAL AXIOS (DYNAMIC ENV)
// ==========================================================

// Mengambil URL dari .env (VITE_API_URL=http://localhost:8000/api)
const FULL_API_URL = import.meta.env.VITE_API_URL || '';

/**
 * PENTING: Sanctum membutuhkan Base URL (tanpa /api) untuk CSRF Cookie.
 * Kita membersihkan "/api" dari string jika ada agar baseURL tepat mengarah ke domain.
 */
axios.defaults.baseURL = FULL_API_URL.replace(/\/api$/, '');

axios.defaults.withCredentials = true; 
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// ✅ INTERCEPTOR: Memaksa Axios mengambil token CSRF dari Cookie
axios.interceptors.request.use(function (config) {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    
    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
});

// ==========================================================
// 2. ✅ RENDER APLIKASI
// ==========================================================
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
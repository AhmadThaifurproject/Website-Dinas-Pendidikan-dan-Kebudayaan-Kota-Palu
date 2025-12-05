// src/Components/Footer.tsx
import { Facebook, Instagram, X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Dinas */}
        <div>
          <h3 className="text-xl font-bold mb-4">Dinas Pendidikan Kota Palu</h3>
          <p className="text-sm text-gray-200">
            Jl. Balai Kota Timur, No. 123, Palu Timur, Kota Palu, Sulawesi Tengah
          </p>
          <p className="text-sm text-gray-200 mt-2">Email: disdik@palukota.go.id</p>
          <p className="text-sm text-gray-200">Telp: (0451) 123456</p>
        </div>

        {/* Link Navigasi */}
        <div>
          <h3 className="text-xl font-bold mb-4">Navigasi</h3>
          <ul className="space-y-2 text-gray-200 text-sm">
            <li><a href="#" className="hover:text-white">Beranda</a></li>
            <li><a href="#" className="hover:text-white">Profil</a></li>
            <li><a href="#" className="hover:text-white">Layanan</a></li>
            <li><a href="#" className="hover:text-white">Publikasi</a></li>
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h3 className="text-xl font-bold mb-4">Ikuti Kami</h3>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-gray-300">
              <Facebook />
            </a>
            <a href="https://www.instagram.com/disdikbud.kotapalu/" aria-label="Instagram" className="hover:text-gray-300">
              <Instagram />
            </a>
            <a href="#" aria-label="X (Twitter)" className="hover:text-gray-300">
              <X />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-300 mt-8">
        © {new Date().getFullYear()} Dinas Pendidikan Kota Palu. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { Download, FileText } from "lucide-react";

interface ButtonSaveBeritaProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  icon?: "download" | "file"; // pilih icon yang diinginkan
}

/**
 * Tombol Save Berita bergaya modern:
 * - bentuk pill, efek hover gradien + scale
 * - icon lucide-react opsional
 */
const ButtonSaveBerita: React.FC<ButtonSaveBeritaProps> = ({
  variant = "primary",
  icon,
  className = "",
  children,
  ...props
}) => {
  const base =
    "group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold " +
    "transition-all duration-300 focus:outline-none overflow-hidden";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 " +
      "hover:from-indigo-500 hover:to-blue-600 shadow-md hover:shadow-lg",
    secondary:
      "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 hover:scale-105 " +
      "hover:from-gray-400 hover:to-gray-500 shadow-md hover:shadow-lg",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:scale-105 " +
      "hover:from-pink-500 hover:to-red-600 shadow-md hover:shadow-lg",
  };

  const iconElement =
    icon === "download" ? (
      <Download size={18} className="transition-transform group-hover:rotate-12" />
    ) : icon === "file" ? (
      <FileText size={18} className="transition-transform group-hover:rotate-12" />
    ) : null;

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* ✨ efek “shine” */}
      <span className="absolute inset-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>

      {iconElement}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default ButtonSaveBerita;

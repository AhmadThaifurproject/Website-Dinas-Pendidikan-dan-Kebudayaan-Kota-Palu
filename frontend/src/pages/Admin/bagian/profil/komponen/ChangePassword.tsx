import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, AlertCircle, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
  // State untuk form data
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State untuk visibilitas password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State untuk validasi & feedback
  const [strength, setStrength] = useState(0);
  const [match, setMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Requirements list untuk visual feedback
  const requirements = [
    { regex: /.{8,}/, label: "Minimal 8 karakter" },
    { regex: /[0-9]/, label: "Mengandung angka" },
    { regex: /[A-Z]/, label: "Huruf kapital" },
    { regex: /[^A-Za-z0-9]/, label: "Simbol spesial (!@#$)" },
  ];

  // Logic: Hitung kekuatan password setiap kali input berubah
  useEffect(() => {
    let score = 0;
    requirements.forEach((req) => {
      if (req.regex.test(formData.newPassword)) score++;
    });
    setStrength(score);
    
    // Cek kecocokan password
    if (formData.confirmPassword) {
      setMatch(formData.newPassword === formData.confirmPassword);
    }
  }, [formData.newPassword, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 3 || !match) return;

    setIsSubmitting(true);
    // Simulasi API call
    setTimeout(() => {
      alert("Password berhasil diubah!");
      setIsSubmitting(false);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setStrength(0);
    }, 1500);
  };

  // Helper untuk warna strength bar
  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Header Area */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Ganti Password</h2>
          <p className="text-sm text-gray-500">Amankan akun Anda dengan password kuat.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* 1. Current Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Password Saat Ini</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-800"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* 2. New Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Password Baru</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-800"
              placeholder="Masukan password baru"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Strength Bar */}
          <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`} 
              style={{ width: `${(strength / 4) * 100}%` }}
            ></div>
          </div>
          
          {/* Validation Checklist */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                  req.regex.test(formData.newPassword) 
                    ? 'bg-green-100 border-green-200 text-green-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}>
                  <Check size={10} />
                </div>
                <span className={req.regex.test(formData.newPassword) ? 'text-gray-600' : 'text-gray-400'}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Konfirmasi Password</label>
          <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-3 rounded-lg border transition-all outline-none text-gray-800 ${
                !match && formData.confirmPassword 
                ? 'border-red-300 focus:ring-2 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
              }`}
              placeholder="Ulangi password baru"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Error Message for Mismatch */}
          {!match && formData.confirmPassword && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-pulse">
              <AlertCircle size={12} />
              <span>Password tidak cocok</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-3">
            <button 
                type="button" 
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
            >
                Batal
            </button>
            <button
                type="submit"
                disabled={strength < 3 || !match || isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white shadow-lg shadow-indigo-200 transition-all transform active:scale-95 ${
                    strength < 3 || !match || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'
                }`}
            >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Password'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
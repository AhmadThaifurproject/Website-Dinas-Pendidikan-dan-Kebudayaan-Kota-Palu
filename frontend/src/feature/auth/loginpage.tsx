import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Building2, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

// ==========================================================
// AXIOS DYNAMIC CONFIGURATION
// ==========================================================
const FULL_API_URL = import.meta.env.VITE_API_URL; 
const BASE_URL = FULL_API_URL.replace('/api', ''); 

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const LoginPage = () => {
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const [isRegister, setIsRegister] = useState(false);
  
  // ROLE STATE: 'admin' (Biasa) atau 'teknisi' (Super Admin)
  const [role, setRole] = useState<'admin' | 'teknisi'>('admin');
  
  const [identity, setIdentity] = useState(''); 
  const [password, setPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [passCriteria, setPassCriteria] = useState({
      length: false, upper: false, number: false, special: false
  });

  useEffect(() => {
      setPassCriteria({
          length: regPassword.length >= 8,
          upper: /[A-Z]/.test(regPassword),
          number: /\d/.test(regPassword),
          special: /[!@#$%^&*(),.?":{}|<>]/.test(regPassword)
      });
  }, [regPassword]);

  const palette = {
    bgIndigoWarm: '#1e1b4b', 
    bgIndigoSoft: '#312e81', 
    primaryIndigo: '#4f46e5', 
    primarySky: '#818cf8',    
    textDark: '#1e293b', 
    textMuted: '#64748b',          
    successGreen: '#10b981', 
    errorRed: '#ef4444',
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: { height: '100vh', width: '100%', display: 'grid', gridTemplateColumns: '62% 38%', fontFamily: "'Outfit', sans-serif", backgroundColor: '#ffffff', overflow: 'hidden' },
    leftPanel: { position: 'relative', background: `linear-gradient(135deg, ${palette.bgIndigoWarm} 0%, ${palette.bgIndigoSoft} 100%)`, display: 'flex', flexDirection: 'column', padding: '50px 60px', color: '#ffffff', overflow: 'hidden', zIndex: 1 },
    headerBrand: { display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 20 },
    logoBox: { width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${palette.primaryIndigo}, ${palette.primarySky})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)' },
    brandText: { fontSize: '16px', fontWeight: 800, letterSpacing: '0.5px', color: '#ffffff' },
    textSection: { marginTop: '40px', position: 'relative', zIndex: 20, maxWidth: '550px' },
    mainHeading: { fontSize: '56px', fontWeight: 800, lineHeight: '1.1', color: '#ffffff', marginBottom: '20px', letterSpacing: '-0.02em' },
    accentText: { background: `linear-gradient(to right, #a5b4fc, #818cf8)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' },
    narrativeText: { fontSize: '18px', color: '#c7d2fe', lineHeight: '1.6', fontWeight: 500 },
    graphicLayer: { position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' },
    orbContainer: { position: 'absolute', bottom: '-80px', left: '-80px', width: '450px', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    rightPanel: { position: 'relative', backgroundColor: '#ffffff', boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.05)', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    scrollContent: { minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' },
    formBox: { width: '100%', maxWidth: '360px' },
    formHead: { marginBottom: '24px', textAlign: 'center' },
    welcomeTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '28px', fontWeight: 700, color: palette.textDark, marginBottom: '6px' },
    welcomeDesc: { fontSize: '13px', color: palette.textMuted },
    roleContainer: { display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px', marginBottom: '20px' },
    roleButton: { flex: 1, padding: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    inputContainer: { marginBottom: '14px' },
    inputLabel: { display: 'block', fontSize: '11px', fontWeight: 600, color: palette.textMuted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    inputFieldWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '12px', zIndex: 2, transition: '0.2s ease', color: palette.textMuted, width: '16px' },
    inputField: { width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: `1px solid #e2e8f0`, fontSize: '13px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#ffffff', fontWeight: 500, color: palette.textDark, fontFamily: "'Outfit', sans-serif", height: '42px' },
    eyeButton: { position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: palette.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    ctaButton: { width: '100%', padding: '12px', marginTop: '16px', background: `linear-gradient(to right, ${palette.primaryIndigo}, #6366f1)`, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)', opacity: isLoading ? 0.7 : 1, pointerEvents: isLoading ? 'none' : 'auto' },
    toggleLink: { marginTop: '16px', textAlign: 'center', fontSize: '12px', color: palette.textMuted, cursor: 'pointer', fontWeight: 500 },
    linkHighlight: { color: palette.primaryIndigo, fontWeight: 700, marginLeft: '4px' },
    overlay: { position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: isRedirecting ? 1 : 0, pointerEvents: isRedirecting ? 'all' : 'none', transition: 'opacity 0.3s ease' }
  };

  const getInputStyle = (field: string) => ({
    ...styles.inputField,
    borderColor: focused === field ? palette.primaryIndigo : '#e2e8f0',
    backgroundColor: focused === field ? '#f5f3ff' : '#ffffff',
    boxShadow: focused === field ? `0 0 0 3px rgba(79, 70, 229, 0.1)` : 'none',
  });

  // --- LOGIC AUTHENTICATION ---
  const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
          if (isRegister) {
              const allCriteriaMet = Object.values(passCriteria).every(Boolean);
              if (!allCriteriaMet || regPassword !== regConfirmPassword) {
                  Toast.fire({ icon: 'warning', title: 'Periksa kembali form Anda.' });
                  setIsLoading(false);
                  return;
              }

              // Register
              await axios.post(`${FULL_API_URL}/auth/register`, {
                  name: regName,
                  email: regEmail,
                  password: regPassword
              });
              
              Toast.fire({ icon: 'success', title: 'Registrasi Berhasil!' });
              setIsRegister(false);
          } else {
              // 1. Ambil CSRF Cookie dari Base URL (Sanctum)
              await axios.get(`${BASE_URL}/sanctum/csrf-cookie`);

              // 2. Login
              const res = await axios.post(`${FULL_API_URL}/auth/login`, {
                  email: identity,
                  password: password,
                  role: role // Backend bisa memvalidasi apakah kredensial ini cocok dengan role yang dipilih
              });

              // --- FIX KRUSIAL: SIMPAN ROLE UNTUK SHARED LAYOUT DASHBOARD ---
              // Jika backend mengembalikan role asli, gunakan itu. Jika tidak, simpan state role dari UI.
              const userRoleData = res.data?.user?.role || role; 
              
              // MENGGUNAKAN SESSIONSTORAGE AGAR TERISOLASI PER TAB BROWSER
              sessionStorage.setItem('isLoggedIn', 'true');
              sessionStorage.setItem('userRole', userRoleData); 
              sessionStorage.setItem('userData', JSON.stringify(res.data.user || {}));
              
              // Jika backend Anda juga mengirimkan bearer token murni
              if (res.data.token) {
                 sessionStorage.setItem('token', res.data.token);
              }
              
              Toast.fire({ icon: 'success', title: `Berhasil masuk sebagai ${userRoleData.toUpperCase()}!` });
              setIsRedirecting(true);
              setTimeout(() => navigate('/admin/dashboard'), 2000);
          }
      } catch (error: any) {
          const msg = error.response?.data?.message || 'Gagal terhubung ke server. Periksa kredensial atau peran Anda.';
          Toast.fire({ icon: 'error', title: msg });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
       {/* Overlay loading saat redirect */}
       <div style={styles.overlay as React.CSSProperties}>
          <Loader2 size={48} className="animate-spin" color={palette.primaryIndigo} />
          <h3 style={{marginTop: 20, fontFamily: "'Outfit', sans-serif", color: palette.textDark, fontWeight: 600}}>
              Memasuki Dashboard Utama...
          </h3>
      </div>

      <div style={styles.leftPanel as React.CSSProperties}>
        <div style={{position:'relative', zIndex:20}}>
            <div style={styles.headerBrand as React.CSSProperties}>
                <div style={styles.logoBox as React.CSSProperties}><Building2 size={20} /></div>
                <span style={styles.brandText as React.CSSProperties}>DISDIKBUD PALU</span>
            </div>
            <div style={styles.textSection as React.CSSProperties}>
                <h1 style={styles.mainHeading as React.CSSProperties}>
                    Pendidikan & <br/><span style={styles.accentText as React.CSSProperties}>Kebudayaan.</span>
                </h1>
                <p style={styles.narrativeText as React.CSSProperties}>
                    Mewujudkan generasi cerdas berkarakter melalui tata kelola sistem informasi terpadu.
                </p>
            </div>
        </div>
        <div style={styles.graphicLayer as React.CSSProperties}>
            <div style={styles.orbContainer as React.CSSProperties}>
                <svg width="100%" height="100%" viewBox="0 0 600 600">
                    <defs>
                        <radialGradient id="sphereGrad" cx="35%" cy="35%" r="70%">
                            <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.6"/>
                            <stop offset="100%" stopColor="#4338ca" stopOpacity="0.2"/>
                        </radialGradient>
                    </defs>
                    <circle cx="300" cy="300" r="160" fill="url(#sphereGrad)" />
                </svg>
            </div>
        </div>
      </div>

      <div style={styles.rightPanel as React.CSSProperties}>
        <div style={styles.scrollContent as React.CSSProperties}>
            <div style={styles.formBox as React.CSSProperties}>
                <div style={styles.formHead as React.CSSProperties}>
                    <h2 style={styles.welcomeTitle as React.CSSProperties}>{isRegister ? "Registrasi Akses" : "Autentikasi Sistem"}</h2>
                    <p style={styles.welcomeDesc as React.CSSProperties}>Masukkan kredensial Anda yang sah.</p>
                </div>

                {!isRegister && (
                    <div style={styles.roleContainer as React.CSSProperties}>
                        <button type="button" onClick={() => setRole('admin')} style={{...styles.roleButton, backgroundColor: role === 'admin' ? '#fff' : 'transparent', color: role === 'admin' ? palette.primaryIndigo : palette.textMuted, boxShadow: role === 'admin' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'} as React.CSSProperties}><User size={14} /> Admin Biasa</button>
                        <button type="button" onClick={() => setRole('teknisi')} style={{...styles.roleButton, backgroundColor: role === 'teknisi' ? '#fff' : 'transparent', color: role === 'teknisi' ? palette.errorRed : palette.textMuted, boxShadow: role === 'teknisi' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'} as React.CSSProperties}><Lock size={14} /> Teknisi (Super)</button>
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    {isRegister ? (
                        <>
                            <div style={{...styles.inputContainer, padding: '10px', backgroundColor: '#fff1f2', border: '1px solid #ffe4e6', borderRadius: '8px', marginBottom: '16px'} as React.CSSProperties}>
                                <p style={{fontSize: '11px', color: palette.errorRed, fontWeight: 600, textAlign: 'center', margin: 0}}>⚠️ Registrasi hanya diizinkan untuk Operator.</p>
                            </div>
                            <div style={styles.inputContainer as React.CSSProperties}>
                                <label style={styles.inputLabel as React.CSSProperties}>Nama Lengkap</label>
                                <div style={styles.inputFieldWrapper as React.CSSProperties}>
                                    <User style={styles.inputIcon as React.CSSProperties} />
                                    <input type="text" style={getInputStyle('regName')} onFocus={()=>setFocused('regName')} onBlur={()=>setFocused(null)} value={regName} onChange={(e)=>setRegName(e.target.value)} required/>
                                </div>
                            </div>
                            <div style={styles.inputContainer as React.CSSProperties}>
                                <label style={styles.inputLabel as React.CSSProperties}>Email Kedinasan</label>
                                <div style={styles.inputFieldWrapper as React.CSSProperties}>
                                    <Mail style={styles.inputIcon as React.CSSProperties} />
                                    <input type="email" style={getInputStyle('regEmail')} onFocus={()=>setFocused('regEmail')} onBlur={()=>setFocused(null)} value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} required/>
                                </div>
                            </div>
                            <div style={styles.inputContainer as React.CSSProperties}>
                                <label style={styles.inputLabel as React.CSSProperties}>Password Keamanan</label>
                                <div style={styles.inputFieldWrapper as React.CSSProperties}>
                                    <Lock style={styles.inputIcon as React.CSSProperties} />
                                    {/* FIX: Mata Show/Hide Password Register */}
                                    <input type={showPassword ? "text" : "password"} style={getInputStyle('regPass')} onFocus={()=>setFocused('regPass')} onBlur={()=>setFocused(null)} value={regPassword} onChange={(e)=>setRegPassword(e.target.value)} required/>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton as React.CSSProperties}>
                                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>
                            <div style={styles.inputContainer as React.CSSProperties}>
                                <label style={styles.inputLabel as React.CSSProperties}>Konfirmasi Password</label>
                                <div style={styles.inputFieldWrapper as React.CSSProperties}>
                                    <Lock style={styles.inputIcon as React.CSSProperties} />
                                    <input type={showConfirmPassword ? "text" : "password"} style={getInputStyle('regConfirm')} onFocus={()=>setFocused('regConfirm')} onBlur={()=>setFocused(null)} value={regConfirmPassword} onChange={(e)=>setRegConfirmPassword(e.target.value)} required/>
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton as React.CSSProperties}>
                                        {showConfirmPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={styles.inputContainer as React.CSSProperties}>
                                <label style={styles.inputLabel as React.CSSProperties}>Email {role === 'teknisi' ? 'Teknisi' : 'Admin'}</label>
                                <div style={styles.inputFieldWrapper as React.CSSProperties}>
                                    <Mail style={styles.inputIcon as React.CSSProperties} />
                                    <input type="email" style={getInputStyle('identity')} onFocus={()=>setFocused('identity')} onBlur={()=>setFocused(null)} value={identity} onChange={(e)=>setIdentity(e.target.value)} placeholder="nama@disdik.palu" required/>
                                </div>
                            </div>
                            <div style={styles.inputContainer as React.CSSProperties}>
                                <label style={styles.inputLabel as React.CSSProperties}>Password</label>
                                <div style={styles.inputFieldWrapper as React.CSSProperties}>
                                    <Lock style={styles.inputIcon as React.CSSProperties} />
                                    {/* FIX: Mata Show/Hide Password Login */}
                                    <input type={showPassword ? "text" : "password"} style={getInputStyle('password')} onFocus={()=>setFocused('password')} onBlur={()=>setFocused(null)} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" required/>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton as React.CSSProperties}>
                                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={isLoading} style={styles.ctaButton as React.CSSProperties}>
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isRegister ? "Daftar Akun" : "Masuk Panel")}
                    </button>
                </form>

                <div style={styles.toggleLink as React.CSSProperties} onClick={() => { setIsRegister(!isRegister); setShowPassword(false); setRegPassword(''); }}>
                    {isRegister ? "Sudah memiliki mandat akses? " : "Belum punya mandat? "}
                    <span style={styles.linkHighlight as React.CSSProperties}>{isRegister ? "Login Sistem" : "Ajukan Akun"}</span>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginPage;
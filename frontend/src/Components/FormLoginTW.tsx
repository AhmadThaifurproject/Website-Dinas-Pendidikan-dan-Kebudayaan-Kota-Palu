import React, { useState, useEffect, useRef } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti'; // 🎉 Tambahan

export default function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
  }, [rememberMe]);

  useEffect(() => {
    let strength = 0;
    if (password.length > 5) strength += 30;
    if (/[A-Z]/.test(password)) strength += 30;
    if (/\d/.test(password)) strength += 40;
    setPasswordStrength(strength);
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/admin/login', { email, password }, { withCredentials: true });
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // 🎉 Jalankan animasi confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff0080', '#7928ca', '#4facfe', '#ffcc00'],
      });

      // Delay 1.5 detik sebelum redirect supaya confetti kelihatan
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1500);

    } catch {
      setError('Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black overflow-hidden font-poppins">
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: 'transparent' },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: 'push' },
              onHover: { enable: true, mode: 'bubble' },
            },
            modes: {
              bubble: { distance: 200, size: 8, duration: 0.4 },
              push: { quantity: 4 },
            },
          },
          particles: {
            color: { value: ['#ff0080', '#7928ca', '#4facfe'] },
            links: { enable: true, color: '#ffffff', opacity: 0.4 },
            move: { enable: true, speed: 1 },
            number: { value: 80 },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 4 } },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-8 py-10 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg shadow-2xl hover:shadow-pink-500/50 transition-shadow"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg"
        >
          Welcome Back
        </motion.h2>

        <form onSubmit={handleLogin} className="space-y-6">
        {/* Email */}
<motion.div whileFocus={{ scale: 1.02 }} className="relative">
  <input
    ref={emailRef}
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    id="email"
    placeholder=" "
    className="peer block w-full px-4 pt-6 pb-2 bg-white/20 text-white rounded-lg border border-white/30 
               focus:outline-none focus:ring-2 focus:ring-pink-500"
    required
  />
  <label
    htmlFor="email"
    className="absolute left-4 top-2 text-sm text-white/70 transition-all
               peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 
               peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400"
  >
    Email
  </label>
</motion.div>

{/* Password */}
<motion.div whileFocus={{ scale: 1.02 }} className="relative">
  <input
    type={passwordVisible ? 'text' : 'password'}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    id="password"
    placeholder=" "
    className="peer block w-full px-4 pt-6 pb-2 bg-white/20 text-white rounded-lg border border-white/30 
               focus:outline-none focus:ring-2 focus:ring-pink-500"
    required
  />
  <label
    htmlFor="password"
    className="absolute left-4 top-2 text-sm text-white/70 transition-all
               peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 
               peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400"
  >
    Password
  </label>
  <button
    type="button"
    onClick={togglePassword}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
  >
    {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</motion.div>
          {/* Password Strength */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${passwordStrength}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"
            />
          </div>

          {/* Remember Me */}
          <div className="flex justify-between items-center text-white text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-pink-500"
              />
              Remember me
            </label>
            <a href="#" className="hover:text-pink-400">Forgot password?</a>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold shadow-lg"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </motion.button>

          {error && <div className="text-red-400 text-center animate-bounce">{error}</div>}
        </form>
      </motion.div>
    </div>
  );
}

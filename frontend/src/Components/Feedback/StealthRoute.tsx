import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import NotFound from '../../feature/auth/features/NotFound.tsx';

const StealthRoute: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ HttpOnly Cookie: Langsung tembak API /me tanpa Header manual.
        // Axios otomatis bawa Cookie karena settingan withCredentials di main.tsx.
        await axios.get('/api/admin/me');
        setIsVerified(true);
      } catch (error) {
        // Jika Cookie salah/expired, Laravel kasih 401, kita anggap dia Siluman.
        localStorage.removeItem('isLoggedIn'); // Hapus flag pendukung saja
        setIsVerified(false);
      }
    };
    checkAuth();
  }, []);

  if (isVerified === null) return null; 
  return isVerified ? <Outlet /> : <NotFound />;
};

export default StealthRoute;
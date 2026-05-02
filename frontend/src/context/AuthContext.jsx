import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, meRequest, signupRequest } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pm_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('pm_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await meRequest();
        setUser(data.user);
        localStorage.setItem('pm_user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem('pm_token');
        localStorage.removeItem('pm_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('pm_token', data.token);
    localStorage.setItem('pm_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (payload) => {
    const data = await loginRequest(payload);
    persistSession(data);
  };

  const signup = async (payload) => {
    const data = await signupRequest(payload);
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem('pm_token');
    localStorage.removeItem('pm_user');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

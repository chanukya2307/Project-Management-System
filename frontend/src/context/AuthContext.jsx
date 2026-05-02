import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, meRequest, signupRequest } from '../services/authService.js';

const AuthContext = createContext(null);

const clearStoredSession = () => {
  localStorage.removeItem('pm_token');
  localStorage.removeItem('pm_user');
};

const readStoredUser = () => {
  const stored = localStorage.getItem('pm_user');

  if (!stored || stored === 'undefined' || stored === 'null') return null;

  try {
    return JSON.parse(stored);
  } catch {
    clearStoredSession();
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
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
        clearStoredSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const persistSession = (data) => {
    if (!data?.token || !data?.user) {
      clearStoredSession();
      throw new Error('Invalid authentication response');
    }

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
    clearStoredSession();
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

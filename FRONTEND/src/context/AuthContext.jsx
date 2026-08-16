import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/index.js';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user has a valid Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem('quickcl_token', session.access_token);
        getMe()
          .then((res) => {
            setUser(res.data);
            setLoading(false);
          })
          .catch(async () => {
            // Token invalid or profile missing — clear it completely
            await supabase.auth.signOut();
            localStorage.removeItem('quickcl_token');
            setUser(null);
            setLoading(false);
          });
      } else {
        localStorage.removeItem('quickcl_token');
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (session) {
          localStorage.setItem('quickcl_token', session.access_token);
        }
        window.location.href = '/login?type=recovery';
        return;
      }

      if (session) {
        localStorage.setItem('quickcl_token', session.access_token);
        try {
          const res = await getMe();
          setUser(res.data);
        } catch (err) {
          // If profile fetch fails (e.g. not synced yet), clear session to prevent redirect loops
          await supabase.auth.signOut();
          localStorage.removeItem('quickcl_token');
          setUser(null);
        }
      } else {
        localStorage.removeItem('quickcl_token');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('quickcl_token', token);
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('quickcl_token');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (newData) => {
    setUser((prev) => (prev ? { ...prev, ...newData } : null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — every component calls this
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

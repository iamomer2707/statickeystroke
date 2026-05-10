import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('skda_user');
    const savedAdmin = localStorage.getItem('skda_admin');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('skda_user', JSON.stringify(userData));
  };

  const adminLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('skda_admin', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('skda_user');
    localStorage.removeItem('skda_admin');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

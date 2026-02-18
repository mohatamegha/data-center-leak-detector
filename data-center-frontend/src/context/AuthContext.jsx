import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('dc_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email, password) => {
    const users = JSON.parse(localStorage.getItem('dc_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);

    if (found) {
      const u = { email: found.email, name: found.name };
      setUser(u);
      localStorage.setItem('dc_user', JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((name, email, password) => {
    const users = JSON.parse(localStorage.getItem('dc_users') || '[]');

    if (users.find(u => u.email === email)) return false;

    users.push({ name, email, password });
    localStorage.setItem('dc_users', JSON.stringify(users));

    const u = { email, name };
    setUser(u);
    localStorage.setItem('dc_user', JSON.stringify(u));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dc_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

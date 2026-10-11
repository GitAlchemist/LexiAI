import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('lexiai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, token, jurisdiction) => {
    const userData = { email, token, jurisdiction };
    setUser(userData);
    localStorage.setItem('lexiai_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lexiai_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
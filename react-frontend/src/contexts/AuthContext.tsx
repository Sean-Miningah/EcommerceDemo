// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/api/useAuth';
import { AuthResponse, LoginCredentials } from '@/types/api';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  login: ReturnType<typeof useAuth>['login'];
  signup: ReturnType<typeof useAuth>['signup'];
  logout: ReturnType<typeof useAuth>['logout'];
  getCurrentUser: ReturnType<typeof useAuth>['getCurrentUser'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, signup, logout, getCurrentUser } = useAuth();
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  const fetchUser = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    const res = await login(credentials);
    setUser(res.user);
    return res;
  };

  const handleSignup = async (credentials: Parameters<typeof signup>[0]) => {
    const res = await signup(credentials);
    setUser(res.user);
    return res;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

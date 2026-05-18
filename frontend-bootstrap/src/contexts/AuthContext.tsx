import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { JwtResponse } from '../types';
import { authService, cartService } from '../services/api';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: JwtResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string, phone?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'laptop_auth';
const GUEST_CART_KEY = 'laptop_guest_cart';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<JwtResponse | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ username, password });
      setUser(response);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
      const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
      if (Array.isArray(guestCart) && guestCart.length > 0) {
        await cartService.mergeCart(response.id, guestCart);
        localStorage.removeItem(GUEST_CART_KEY);
        window.dispatchEvent(new Event('guest-cart-synced'));
        toast.success('Guest cart synced');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, password: string, email?: string, phone?: string) => {
    setLoading(true);
    try {
      await authService.register({ username, password, email, phone });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(GUEST_CART_KEY);
    window.dispatchEvent(new Event('cart-reset'));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

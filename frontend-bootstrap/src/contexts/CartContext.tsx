import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem } from '../types';
import { toast } from 'react-toastify';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
}

const CART_STORAGE_KEY = 'laptop_guest_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [isAuthenticated, items]);

  const refreshCart = useCallback(async () => {
    if (!user) return;
    const data = await cartService.getCart(user.id);
    setItems(data);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart().catch(() => toast.error('Không thể tải giỏ hàng'));
    }
  }, [isAuthenticated, refreshCart, user]);

  useEffect(() => {
    const handleSynced = () => {
      localStorage.removeItem(CART_STORAGE_KEY);
      refreshCart().catch(() => toast.error('Không thể tải giỏ hàng'));
    };
    const handleReset = () => setItems([]);
    window.addEventListener('guest-cart-synced', handleSynced);
    window.addEventListener('cart-reset', handleReset);
    return () => {
      window.removeEventListener('guest-cart-synced', handleSynced);
      window.removeEventListener('cart-reset', handleReset);
    };
  }, [refreshCart]);

  const addItem = useCallback(async (item: CartItem) => {
    if (user) {
      const data = await cartService.addToCart(user.id, item.productDetailId, item.quantity);
      setItems(data);
      toast.success('Added to cart');
      return;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.productDetailId === item.productDetailId);
      if (existing) {
        toast.info('Updated quantity in cart');
        return prev.map((i) =>
          i.productDetailId === item.productDetailId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      toast.success('Added to cart');
      return [...prev, item];
    });
  }, [user]);

  const removeItem = useCallback(async (id: number) => {
    if (user) {
      const data = await cartService.removeItem(user.id, id);
      setItems(data);
      toast.info('Removed from cart');
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.info('Removed from cart');
  }, [user]);

  const updateQuantity = useCallback(async (id: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }
    if (user) {
      const data = await cartService.updateQuantity(user.id, id, quantity);
      setItems(data);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, [removeItem, user]);

  const clearCart = useCallback(async () => {
    if (user) {
      const data = await cartService.clearCart(user.id);
      setItems(data);
      return;
    }
    setItems([]);
  }, [user]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

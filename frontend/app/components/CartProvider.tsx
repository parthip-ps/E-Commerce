"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Cart, CartItem } from "@/types";
import { clientFetch } from "@/lib/api";
import { useAuth } from "./AuthProvider";

interface CartContextType {
  cart: Cart;
  itemCount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const emptyCart: Cart = { items: [], total: 0, updatedAt: null };

const CartContext = createContext<CartContextType>({
  cart: emptyCart,
  itemCount: 0,
  isLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  fetchCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await clientFetch<{ data: Cart }>("/api/cart", {}, token || undefined);
      setCart(res.data);
    } catch (_) {}
  }, [isAuthenticated, token]);

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    setIsLoading(true);
    try {
      const res = await clientFetch<{ data: Cart }>("/api/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      }, token || undefined);
      setCart(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const removeFromCart = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      const res = await clientFetch<{ data: Cart }>(`/api/cart/remove/${productId}`, {
        method: "DELETE",
      }, token || undefined);
      setCart(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await clientFetch<{ data: Cart }>("/api/cart/update", {
        method: "PUT",
        body: JSON.stringify({ productId, quantity }),
      }, token || undefined);
      setCart(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await clientFetch("/api/cart/clear", { method: "DELETE" }, token || undefined);
      setCart(emptyCart);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, itemCount, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

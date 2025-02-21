"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useProducts } from "./product-context";

interface CartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number; // Ensure quantity is tracked separately
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { updateStock, getStock } = useProducts();
  const [stockUpdateQueue, setStockUpdateQueue] = useState<{ id: string; change: number }[]>([]);
  const prevStockUpdateQueueRef = useRef<{ id: string; change: number }[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (stockUpdateQueue.length > 0 && stockUpdateQueue !== prevStockUpdateQueueRef.current) {
      stockUpdateQueue.forEach(({ id, change }) => {
        updateStock(id, change);
      });
      prevStockUpdateQueueRef.current = stockUpdateQueue;
      setStockUpdateQueue([]);
    }
  }, [stockUpdateQueue, updateStock]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      const currentStock = getStock(item.id);

      if (currentStock <= 0) {
        return prevCart; // Prevent adding if out of stock
      }

      if (existingItem) {
        if (existingItem.quantity < currentStock) {
          setStockUpdateQueue((prevQueue) => [...prevQueue, { id: item.id, change: -1 }]);
          return prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          return prevCart; // Prevent exceeding stock
        }
      } else {
        setStockUpdateQueue((prevQueue) => [...prevQueue, { id: item.id, change: -1 }]);
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (!existingItem) return prevCart;

      setStockUpdateQueue((prevQueue) => [...prevQueue, { id: productId, change: existingItem.quantity }]);
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const currentStock = getStock(item.id);

          if (newQuantity > currentStock) {
            return item; // Prevent exceeding available stock
          }

          const previousQuantity = item.quantity;
          const change = newQuantity - previousQuantity;

          if (change !== 0) {
            setStockUpdateQueue((prevQueue) => [...prevQueue, { id: productId, change: -change }]);
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
  quantity: number; // Stock quantity
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  fetchProducts: () => void;
  updateStock: (productId: string, change: number) => void;
  getStock: (productId: string) => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockUpdates, setStockUpdates] = useState<{ productId: string; change: number }[]>([]);

  // Fetch products from localStorage when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Save products to localStorage when they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  // ✅ NEW FIX: Apply stock updates safely in an effect
  useEffect(() => {
    if (stockUpdates.length > 0) {
      setProducts((prevProducts) => {
        return prevProducts.map((product) => {
          const update = stockUpdates.find((u) => u.productId === product.id);
          return update
            ? { ...product, quantity: Math.max(0, product.quantity + update.change) }
            : product;
        });
      });

      // Clear stock updates after applying
      setStockUpdates([]);
    }
  }, [stockUpdates]);

  const fetchProducts = () => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  };

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, product];
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter((product) => product.id !== id);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  // ✅ NEW FIX: Ensure stock updates happen outside render
  const updateStock = useCallback((productId: string, change: number) => {
    setStockUpdates((prevUpdates) => [...prevUpdates, { productId, change }]);
  }, []);

  const getStock = (productId: string): number => {
    const product = products.find((product) => product.id === productId);
    return product ? product.quantity : 0;
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, fetchProducts, updateStock, getStock }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
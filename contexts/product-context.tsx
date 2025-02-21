"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  hover_image_url: string;
  stock: number; // ✅ Ensure database column is named `stock`
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  fetchProducts: () => Promise<void>;
  updateStock: (productId: string, change: number) => Promise<void>;
  getStock: (productId: string) => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products:", error.message);
    } else {
      setProducts(data as Product[]);
    }
  };

  const addProduct = async (product: Product) => {
    const { data, error } = await supabase.from("products").insert([product]).select("*");
    if (error) {
      console.error("Error adding product:", error.message);
    } else {
      setProducts((prevProducts) => [...prevProducts, data[0]]);
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().match({ id });
    if (error) {
      console.error("Error deleting product:", error.message);
    } else {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    }
  };

  const updateStock = async (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    const newStock = Math.max(0, product.stock + change); // ✅ Ensure stock never goes negative

    const { error } = await supabase
      .from("products")
      .update({ stock: newStock }) // ✅ Ensure correct field name
      .eq("id", productId);

    if (error) {
      console.error("Error updating stock:", error.message, error.details);
    } else {
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)) // ✅ Ensure state updates correctly
      );
    }
  };

  const getStock = (productId: string): number => {
    const product = products.find((p) => p.id === productId);
    return product ? product.stock : 0;
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

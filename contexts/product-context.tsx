"use client"

import React, { createContext, useState, useContext, useEffect } from "react"

export interface Product {
  id: string
  name: string
  price: string
  image: string
  hoverImage: string
  stock: number  // Ensure stock is included here

}

interface ProductContextType {
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (id: string) => void
  fetchProducts: () => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])

  // Load products from localStorage on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products])

  // Fetch products from localStorage
  const fetchProducts = () => {
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }

  // Add new product & update local storage
  const addProduct = (product: Product) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, product]
      localStorage.setItem("products", JSON.stringify(updatedProducts))
      return updatedProducts
    })
  }

  // Remove product & update local storage
  const removeProduct = (id: string) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter(product => product.id !== id)
      localStorage.setItem("products", JSON.stringify(updatedProducts))
      return updatedProducts
    })
  }

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}

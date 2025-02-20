"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

// Define the WishlistItem interface (now includes `stock`)
interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  stock: number // ✅ Ensure stock is properly stored
}

// Define the WishlistContext type
interface WishlistContextType {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  clearWishlist: () => void
}

// Create the WishlistContext with default values
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// WishlistProvider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    // Load wishlist from localStorage (if available)
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("wishlist")
      return storedWishlist ? JSON.parse(storedWishlist) : []
    }
    return []
  })

  // Update localStorage whenever the wishlist changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist])

  // Add item to wishlist (if not already in it)
  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (!prev.some((wishlistItem) => wishlistItem.id === item.id)) {
        return [...prev, item]
      }
      return prev
    })
  }

  // Remove item from wishlist
  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  // Clear the entire wishlist
  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

// Hook to use WishlistContext
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

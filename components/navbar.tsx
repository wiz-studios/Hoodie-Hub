"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, X, Menu } from "lucide-react";
import { useCart } from "../contexts/cart-context";

export default function Navbar() {
  const { cart, removeFromCart, getCartTotal, getCartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-background bg-opacity-50 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          SDFM 2520
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/" className="text-primary hover:text-secondary transition-colors">
            Home
          </Link>
          <Link href="/#products" className="text-primary hover:text-secondary transition-colors">
            Shop
          </Link>
          <Link href="/#about" className="text-primary hover:text-secondary transition-colors">
            About
          </Link>
          <Link href="/#contact" className="text-primary hover:text-secondary transition-colors">
            Contact
          </Link>
          <Link href="/admin/add-product" className="text-primary hover:text-secondary transition-colors">
            Admin
          </Link>
        </div>

        {/* Cart & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Cart Button */}
          <div className="relative">
            <button onClick={toggleCart} className="flex items-center text-primary">
              <ShoppingCart className="w-6 h-6" />
              <span className="ml-1">{String(getCartCount())}</span> {/* ✅ Fixed TypeScript Error */}
            </button>
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-background rounded-md shadow-lg overflow-hidden z-20">
                <div className="py-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center px-4 py-2 hover:bg-accent">
                      <div className="flex-1">
                        <p className="text-primary">{item.name}</p>
                        <p className="text-secondary">
                          ${Number.parseFloat(String(item.price)).toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-accent hover:text-secondary">
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-accent px-4 py-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-primary">Total:</span>
                    <span className="font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <Link
                    href="/cart"
                    className="block w-full bg-secondary text-background py-2 text-center rounded-md font-semibold hover:bg-primary transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (Next to Cart) */}
          <button className="md:hidden text-primary" onClick={toggleMenu}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-background absolute top-full left-0 right-0 shadow-lg">
          <div className="flex flex-col space-y-2 p-4">
            <Link href="/" className="text-primary hover:text-secondary transition-colors" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/#products" className="text-primary hover:text-secondary transition-colors" onClick={toggleMenu}>
              Shop
            </Link>
            <Link href="/#about" className="text-primary hover:text-secondary transition-colors" onClick={toggleMenu}>
              About
            </Link>
            <Link href="/#contact" className="text-primary hover:text-secondary transition-colors" onClick={toggleMenu}>
              Contact
            </Link>
            <Link href="/admin/add-product" className="text-primary hover:text-secondary transition-colors" onClick={toggleMenu}>
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

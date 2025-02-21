"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, X, Menu, Heart } from "lucide-react";
import { useCart } from "../contexts/cart-context";
import { useWishlist } from "../contexts/wishlist-context";

export default function Navbar() {
  const { cart, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { wishlist } = useWishlist();

  // State for cart and menu toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle cart visibility
  const toggleCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsCartOpen((prev) => !prev);
  };

  // Toggle mobile menu visibility
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsMenuOpen((prev) => !prev);
  };

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
          <Link href="/wishlist" className="text-primary hover:text-secondary transition-colors flex items-center">
            <Heart className="w-5 h-5 mr-1" />
            <span suppressHydrationWarning>{typeof window !== "undefined" ? wishlist.length : 0}</span>
          </Link>
        </div>

        {/* Cart & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Cart Button */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={toggleCart}
              className="flex items-center text-primary focus:outline-none"
              aria-label="Toggle Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="ml-1" suppressHydrationWarning>
                {typeof window !== "undefined" ? getCartCount() : 0}
              </span>
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-background rounded-md shadow-lg overflow-hidden z-20"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                <div className="py-2">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center px-4 py-2 hover:bg-accent">
                        <div className="flex-1">
                          <p className="text-primary">{item.name}</p>
                          <p className="text-secondary">
                            ${Number.parseFloat(String(item.price)).toFixed(2)} x {item.stock}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent closing when removing an item
                            removeFromCart(item.id);
                          }}
                          className="text-accent hover:text-secondary focus:outline-none"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-secondary">Your cart is empty</p>
                  )}
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                  <div className="bg-accent px-4 py-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-primary">Total:</span>
                      <span className="font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <Link
                      href="/cart"
                      className="block w-full bg-secondary text-background py-2 text-center rounded-md font-semibold hover:bg-primary transition-colors focus:outline-none"
                      onClick={() => setIsCartOpen(false)}
                      aria-label="View Cart"
                    >
                      View Cart
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-background absolute top-full left-0 right-0 shadow-lg">
          <div className="flex flex-col space-y-2 p-4">
            <Link href="/" className="text-primary hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/#products" className="text-primary hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/#about" className="text-primary hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/#contact" className="text-primary hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/admin/add-product" className="text-primary hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
            <Link href="/wishlist" className="text-primary hover:text-secondary transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
              <Heart className="w-5 h-5 mr-1" />
              <span suppressHydrationWarning>
                Wishlist ({typeof window !== "undefined" ? wishlist.length : 0})
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

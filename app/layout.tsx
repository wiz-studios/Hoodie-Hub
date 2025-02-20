import { CartProvider } from "../contexts/cart-context";
import { ProductProvider } from "../contexts/product-context";
import { WishlistProvider } from "../contexts/wishlist-context"; 
import "../styles/globals.css";
import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}

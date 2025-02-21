import { CartProvider } from "../contexts/cart-context";
import { ProductProvider } from "../contexts/product-context";
import { WishlistProvider } from "../contexts/wishlist-context";
import "../styles/globals.css";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900"> {/* Light background for better contrast */}
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}

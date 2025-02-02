import { CartProvider } from "../contexts/cart-context"
import { ProductProvider } from "../contexts/product-context"
import "../styles/globals.css"
import type React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ProductProvider>
          <CartProvider>{children}</CartProvider>
        </ProductProvider>
      </body>
    </html>
  )
}



import './globals.css'
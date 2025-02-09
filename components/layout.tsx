import type { ReactNode } from "react"
import CustomCursor from "./custom-cursor"
import Navbar from "./navbar"
import Footer from "./footer"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <CustomCursor />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}


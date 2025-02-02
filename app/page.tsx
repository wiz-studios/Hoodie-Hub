import Layout from "../components/layout"
import SplashScreen from "../components/splash-screen"
import AutoSlidingBanner from "../components/auto-sliding-banner"
import ProductShowcase from "../components/product-showcase"
import AboutSection from "../components/about-section"
import ContactSection from "../components/contact-section"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"

export default function Home() {
  return (
    <Layout>
      <SplashScreen />
      <AutoSlidingBanner />
      <div className="container mx-auto px-4">
        <ProductShowcase />
        <div className="flex justify-center mt-12 mb-16">
          <Link
            href="/cart"
            className="inline-block bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            View Cart
          </Link>
        </div>
      </div>
      <AboutSection />
      <ContactSection />
      <ToastContainer />
    </Layout>
  )
}


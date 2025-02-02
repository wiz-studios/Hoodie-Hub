"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const images = [
  "/istockphoto-3.jpg",
  "/istockphoto-4.jpg",
  "/istockphoto-5.jpg"
];

export default function AutoSlidingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[80vh] md:h-screen overflow-hidden">
      {/* Background Image */}
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 px-6 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Premium Streetwear
        </h1>
        <button
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors text-sm md:text-base"
          onClick={() => {
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          SHOP
        </button>
      </div>
    </div>
  )
}

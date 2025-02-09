"use client";

import Image from "next/image"
import { motion } from "framer-motion"

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">About SDFM 2520</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
              alt="SDFM 2520 Workshop"
              width={600}
              height={400}
              className="rounded-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
            <p className="mb-4">
              SDFM 2520 was born from a passion for quality streetwear and a commitment to sustainable fashion. Our
              journey began in a small workshop, where we crafted each hoodie with meticulous attention to detail.
            </p>
            <p>
              Today, we continue to push the boundaries of style and comfort, creating premium hoodies that stand the
              test of time. Our mission is to deliver not just clothing, but a statement of individuality and conscious
              consumption.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


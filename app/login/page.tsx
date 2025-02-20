"use client";

import Login from "@/components/login"; // Ensure the correct import path
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login
          </h1>
          <Login />
        </div>
      </motion.div>
    </div>
  );
}

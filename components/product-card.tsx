"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "../contexts/cart-context";
import { toast } from "react-toastify";
import { useProducts } from "../contexts/product-context";

interface ProductCardProps {
  id: string;
  name: string;
  price: number | string;
  image: string;
  hoverImage: string;
  stock: number;
}

export function ProductCard({ id, name, price, image, hoverImage, stock }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { updateStock } = useProducts();
  const handleAddToCart = () => {
    if (stock > 0) {
      addToCart({
        id,
        name,
        price: typeof price === "number" ? price : Number.parseFloat(price),
        quantity: 1, // ✅ Always adding one item at a time
        image,
      });
  
      updateStock(id, -1); // ✅ Ensure stock decreases by exactly 1
  
      toast.success(`${name} added to cart!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(`${name} is out of stock!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  

  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden relative"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src={isHovered ? hoverImage : image}
          alt={name}
          width={300}
          height={400}
          objectFit="cover"
          className="transition-transform duration-300 transform hover:scale-110"
        />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <button className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors">
              Quick View
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-400">
          ${typeof price === "number" ? price.toFixed(2) : Number.parseFloat(price).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">Stock: {stock}</p>
        <button
          className={`mt-2 w-full py-2 rounded font-semibold transition-colors ${
            stock > 0 ? "bg-white text-black hover:bg-gray-200" : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </motion.div>
  );
}

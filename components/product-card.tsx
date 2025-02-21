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
  image_url?: string;
  hover_image_url?: string;
  stock: number;
}

export function ProductCard({ id, name, price, image_url, hover_image_url, stock }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const { addToCart } = useCart();
  const { updateStock } = useProducts();

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (stock > 0) {
      addToCart({
        id,
        name,
        price: Number(price), // ✅ Ensure price is a number
        stock,
        image: image_url || "", // ✅ Ensure image is always a string
        quantity: 1,
      });

      updateStock(id, -1);

      toast.success(`${name} added to cart for KES ${Number(price).toFixed(2)}!`);
    } else {
      toast.error(`${name} is out of stock!`);
    }
  };

  // Handle toggling product as a favorite
  const handleFavoriteToggle = () => {
    setIsFavorited((prev) => !prev);

    if (!isFavorited) {
      toast.success(`${name} added to favorites!`);
    } else {
      toast.info(`${name} removed from favorites!`);
    }
  };

  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden relative"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image rendering */}
      {image_url ? (
        <div className="relative w-full h-80 overflow-hidden">
          <Image
            src={isHovered && hover_image_url ? hover_image_url : image_url}
            alt={name}
            width={300}
            height={400}
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 transform hover:scale-110"
          />
        </div>
      ) : (
        <div className="relative w-full h-80 flex items-center justify-center bg-gray-700 text-white">
          No Image Available
        </div>
      )}

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-400">KES {Number(price).toFixed(2)}</p>
        <p className="text-sm text-gray-500">Stock: {stock}</p>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-2 rounded-full transition-colors"
          style={{
            backgroundColor: isFavorited ? "red" : "transparent",
            border: isFavorited ? "none" : "1px solid white",
          }}
        >
          <span className="text-white text-lg" role="img" aria-label="favorite">
            ❤️
          </span>
        </button>

        {/* Add to Cart Button */}
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

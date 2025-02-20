"use client";
import { useState } from "react"; // React's useState hook for managing component state
import { motion } from "framer-motion"; // Framer Motion for animations
import Image from "next/image"; // Next.js Image component for optimized images
import { useCart } from "../contexts/cart-context"; // Custom hook to manage cart context
import { toast } from "react-toastify"; // Toast notifications for user feedback
import { useProducts } from "../contexts/product-context"; // Custom hook to manage product context

// Define the interface for the ProductCardProps
interface ProductCardProps {
  id: string; // Unique identifier for the product
  name: string; // Name of the product
  price: number | string; // Price of the product (can be a number or string)
  image: string; // URL of the main product image
  hoverImage: string; // URL of the image displayed on hover
  stock: number; // Stock availability of the product
}

// Export the ProductCard functional component
export function ProductCard({ id, name, price, image, hoverImage, stock }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false); // State to track if the card is hovered
  const [isFavorited, setIsFavorited] = useState(false); // State to track if the product is favorited

  const { addToCart } = useCart(); // Function to add products to the cart from the cart context
  const { updateStock } = useProducts(); // Function to update product stock from the product context

  // Handler for adding the product to the cart
  const handleAddToCart = () => {
    if (stock > 0) {
      addToCart({
        id,
        name,
        price: typeof price === "number" ? price : Number.parseFloat(price), // Convert price to a number if it's a string
        quantity: 1, // Add one item at a time
        image,
      });

      updateStock(id, -1); // Decrease the stock by 1

      // Show a success toast notification with KES currency
      toast.success(`${name} added to cart for KES ${typeof price === "number" ? price.toFixed(2) : Number.parseFloat(price).toFixed(2)}!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } else {
      toast.error(`${name} is out of stock!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  };

  // Handler for toggling the favorite state
  const handleFavoriteToggle = () => {
    setIsFavorited((prev) => !prev); // Toggle the favorite state

    // Show a toast notification based on whether the product was added or removed from favorites
    if (!isFavorited) {
      toast.success(`${name} added to favorites!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.info(`${name} removed from favorites!`, {
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
      {/* Product Image Section */}
      <div className="relative w-full h-80 overflow-hidden"> {/* Container for the product image */}
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

      {/* Product Details Section */}
      <div className="p-4"> {/* Container for product details */}
        <h3 className="text-lg font-semibold">{name}</h3> {/* Product name */}
        <p className="text-gray-400">
          KES {typeof price === "number" ? price.toFixed(2) : Number.parseFloat(price).toFixed(2)} {/* Display price in KES */}
        </p>
        <p className="text-sm text-gray-500">Stock: {stock}</p> {/* Stock availability */}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle} // Call handleFavoriteToggle when clicked
          className="absolute top-2 right-2 p-2 rounded-full transition-colors" // Position and styling for the heart button
          style={{
            backgroundColor: isFavorited ? "red" : "transparent", // Change background color if favorited
            border: isFavorited ? "none" : "1px solid white", // Add a border if not favorited
          }}
        >
          <span className="text-white text-lg" role="img" aria-label="favorite">
            ❤️ {/* Heart emoji */}
          </span>
        </button>

        {/* Add to Cart Button */}
        <button
          className={`mt-2 w-full py-2 rounded font-semibold transition-colors ${
            stock > 0 ? "bg-white text-black hover:bg-gray-200" : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`} // Conditional styling based on stock availability
          onClick={handleAddToCart} // Call handleAddToCart when clicked
          disabled={stock === 0} // Disable the button if out of stock
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"} {/* Button text based on stock */}
        </button>
      </div>
    </motion.div>
  )
}

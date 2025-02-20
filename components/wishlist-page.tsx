"use client";

import { useWishlist } from "../contexts/wishlist-context";
import { useCart } from "../contexts/cart-context";
import { toast } from "react-toastify";
import { ProductCard } from "./product-card";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    toast.success(`${item.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="flex justify-center">
              <div className="w-full max-w-[300px]">
                <ProductCard
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  hoverImage={item.image}
                  stock={1}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

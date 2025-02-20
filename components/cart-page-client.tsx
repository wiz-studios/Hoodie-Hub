"use client";

import { useCart } from "../contexts/cart-context";
import { Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPageClient() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>
          Your cart is empty. {" "}
          <Link href="/#products" className="text-blue-500 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  {/* Ensure image is included and fallback to a placeholder */}
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-gray-600">
                      ${typeof item.price === "string" ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity || 0}</span>
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 rounded-full bg-red-200 hover:bg-red-300 ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-xl font-semibold">${(getCartTotal() || 0).toFixed(2)}</span>
            </div>
            <Link href="/login" className="block w-full">
              <button className="w-full bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors text-lg">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

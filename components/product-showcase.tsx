"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { useProducts } from "../contexts/product-context";

export default function ProductShowcase() {
  const { products, fetchProducts } = useProducts();
  const [localProducts, setLocalProducts] = useState(products);

  useEffect(() => {
    fetchProducts(); // Ensure the latest products are loaded
  }, []);

  useEffect(() => {
    setLocalProducts(products); // Update local state when products change
  }, [products]);

  return (
    <section id="products" className="py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {localProducts.length > 0 ? (
          localProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image_url={product.image_url} // ✅ Fixed field name
              hover_image_url={product.hover_image_url} // ✅ Fixed field name
              stock={product.stock} // ✅ Corrected from `quantity` to `stock`
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products available yet.</p>
        )}
      </div>
    </section>
  );
}

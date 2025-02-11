"use client";

import { useState } from "react";
import { useProducts } from "../contexts/product-context";
import { toast } from "react-toastify";

export default function AddProductForm() {
  const { addProduct, deleteProduct, products } = useProducts();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAddProduct = () => {
    if (!name || !price || !image || !quantity) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name,
      price: Number(price), // ✅ Ensure price is a number
      image: image.trim() || "/placeholder.svg",
      hoverImage: hoverImage.trim() || "/placeholder.svg",
      quantity: Number(quantity), // ✅ Ensure quantity is a number
    };

    addProduct(newProduct);
    toast.success("Product added successfully!");

    setName("");
    setPrice("");
    setImage("");
    setHoverImage("");
    setQuantity("");
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success("Product deleted!");
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
      />
      <input
        type="text"
        placeholder="Hover Image URL"
        value={hoverImage}
        onChange={(e) => setHoverImage(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
      />
      <button
        onClick={handleAddProduct}
        className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition-colors"
      >
        Add Product
      </button>

      {/* Product List */}
      <h2 className="text-2xl font-bold mt-6">Product Collection</h2>
      <div className="mt-4">
        {products.length === 0 ? (
          <p className="text-gray-400">No products added yet.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{product.name}</p>
                  <p className="text-gray-400">${product.price} | Qty: {product.quantity}</p>
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

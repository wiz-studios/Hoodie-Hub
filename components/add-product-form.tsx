"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "../contexts/product-context";
import { v4 as uuidv4 } from "uuid";

export default function AddProductForm() {
  const router = useRouter();
  const { products, addProduct, removeProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imageUrl: "",
    hoverImageUrl: "",
    stock: "",
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl || !formData.hoverImageUrl) {
      alert("Please enter both image URLs");
      return;
    }

    const newProduct = {
      id: uuidv4(),
      name: formData.name,
      price: formData.price,
      image: formData.imageUrl,
      hoverImage: formData.hoverImageUrl,
      stock: Number(formData.stock), // Ensure stock is a number
    };
    

    addProduct(newProduct);
    alert("Product added successfully!");
    setFormData({ name: "", price: "", imageUrl: "", hoverImageUrl: "", stock: "" });
    router.refresh();
  };

  const handleDelete = (id: string) => {
    if (removeProduct) {
      removeProduct(id);
      alert("Product deleted successfully!");
      router.refresh();
    } else {
      console.error("removeProduct function is not available in context.");
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="hoverImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hover Image URL
          </label>
          <input
            type="text"
            id="hoverImageUrl"
            name="hoverImageUrl"
            value={formData.hoverImageUrl}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
        </div>
        <div className="mt-6">
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700">
            Add Product
          </button>
        </div>
      </form>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Existing Products</h2>
        {products.map((product) => (
          <div key={product.id} className="flex justify-between items-center w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white mb-2">
            <div>
              <span>{product.name}</span>
              <p className="text-sm">Stock: {product.stock}</p>
            </div>
            <button onClick={() => handleDelete(product.id)} className="bg-red-600 text-white px-3 py-1 rounded-md">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

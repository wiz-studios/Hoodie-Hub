"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  hover_image_url: string;
  stock: number;
}

export default function AddProductForm() {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();

    // Set up real-time listener
    const subscription = supabase
      .channel("realtime products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setProducts((prev) => [payload.new as Product, ...prev]);
        } else if (payload.eventType === "DELETE") {
          setProducts((prev) => prev.filter((product) => product.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      toast.error("Error fetching products: " + error.message);
      return;
    }
    setProducts(data as Product[]);
  };

  const handleAddProduct = async () => {
    if (!name || !price || !image || !quantity) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          image_url: image.trim() || "/placeholder.svg",
          hover_image_url: hoverImage.trim() || "/placeholder.svg",
          stock: Number(quantity),
        },
      ]).select("*"); // Fetch inserted row

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Product added successfully!");
      if (data) {
        setProducts((prev) => [data[0] as Product, ...prev]); // Add to UI instantly
      }
      setName("");
      setPrice("");
      setImage("");
      setHoverImage("");
      setQuantity("");
    } catch (error) {
      toast.error("Error adding product: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Error deleting product.");
      return;
    }
    toast.success("Product deleted!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#09080d] text-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-[#fe6807] mb-6">Add Product</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]"
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]"
        />
        <input
          type="text"
          placeholder="Hover Image URL"
          value={hoverImage}
          onChange={(e) => setHoverImage(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]"
        />
        <button
          onClick={handleAddProduct}
          className="w-full bg-[#fe6807] text-white font-semibold py-3 rounded-xl hover:bg-[#191bdf] transition duration-300"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-8 text-center text-[#fe6807]">Product Collection</h2>
      <div className="mt-4">
        {products.length === 0 ? (
          <p className="text-gray-400 text-center">No products added yet.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{product.name}</p>
                  <p className="text-gray-400">${product.price} | Qty: {product.stock}</p>
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 px-4 py-2 text-white rounded-xl hover:bg-red-600"
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

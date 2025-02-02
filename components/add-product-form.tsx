"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProducts } from "../contexts/product-context"

export default function AddProductForm() {
  const router = useRouter()
  const { addProduct } = useProducts()
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [hoverImage, setHoverImage] = useState<File | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isHover: boolean) => {
    if (e.target.files && e.target.files[0]) {
      if (isHover) {
        setHoverImage(e.target.files[0])
      } else {
        setImage(e.target.files[0])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image || !hoverImage) {
      alert("Please select both images")
      return
    }

    const imageUrl = URL.createObjectURL(image)
    const hoverImageUrl = URL.createObjectURL(hoverImage)

    addProduct({
      ...formData,
      image: imageUrl,
      hoverImage: hoverImageUrl,
    })

    alert("Product added successfully!")
    setFormData({ id: "", name: "", price: "" })
    setImage(null)
    setHoverImage(null)
    router.refresh()
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div>
        <label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Product ID
        </label>
        <input
          type="text"
          id="id"
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(e) => handleImageChange(e, false)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="hoverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hover Image
        </label>
        <input
          type="file"
          id="hoverImage"
          name="hoverImage"
          onChange={(e) => handleImageChange(e, true)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>
    </form>
  )
}

"use client";
import { useState } from "react";
import { useCart } from "../contexts/cart-context";

// List of countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  // ... (rest of the countries)
];

export default function CheckoutForm() {
  const { getCartTotal, clearCart } = useCart();

  // State for form data and autocomplete
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Filter countries for autocomplete
    if (name === "country") {
      const matches = value.trim()
        ? countries.filter((country) =>
            country.toLowerCase().startsWith(value.toLowerCase())
          )
        : [];
      setFilteredCountries(matches);
    }
  };

  // Handle country selection from autocomplete
  const handleCountrySelect = (country: string) => {
    setFormData((prevData) => ({ ...prevData, country }));
    setFilteredCountries([]);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { ...formData, total: getCartTotal() });
    clearCart();
    alert("Thank you for your order!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl">
      {/* Form Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Checkout</h2>

      {/* Full Name and Email Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["name", "email"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
              {field === "name" ? "Full Name" : "Email"}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              id={field}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-100"
            />
          </div>
        ))}
      </div>

      {/* Address Field */}
      <div className="mt-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-100"
        />
      </div>

      {/* City, Country, and Zip Code Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-100"
          />
        </div>

        {/* Country with Autocomplete */}
        <div className="relative">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-100"
          />
          {filteredCountries.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md max-h-40 overflow-auto z-10">
              {filteredCountries.map((country) => (
                <li
                  key={country}
                  className="p-2 hover:bg-blue-100 cursor-pointer text-gray-800"
                  onClick={() => handleCountrySelect(country)}
                >
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Zip Code */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-100"
          />
        </div>
      </div>

      {/* Total and Submit Button */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-blue-600">
            ${(getCartTotal() || 0).toFixed(2)}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-lg"
        >
          Place Order
        </button>
      </div>
    </form>
  );
}
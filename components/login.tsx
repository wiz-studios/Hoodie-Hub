"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle user login
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/checkout");
    }

    setLoading(false);
  };

  // Handle user sign-up
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("User sign-up failed.");
      setLoading(false);
      return;
    }

    // Store additional user details in Supabase
    const { error: insertError } = await supabase.from("users").insert([
      { id: data.user.id, name, phone, email },
    ]);

    if (insertError) {
      setError("Failed to save user details: " + insertError.message);
      setLoading(false);
      return;
    }

    router.push("/checkout");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md md:max-w-lg lg:max-w-xl"
      >
        <Card className="rounded-2xl shadow-lg p-6 bg-white">
          {/* Header Text */}
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>

          {/* Display error message if any */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Signup Fields - Show only if user is signing up */}
          {isSignUp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Full Name Input */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm"
                />
              </div>

              {/* Phone Number Input */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Email Address Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm"
            />
          </div>

          {/* Password & Confirm Password Fields */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Password Input (Same width as Email) */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm"
              />
            </div>

            {/* Confirm Password Input - Only for Sign Up */}
            {isSignUp && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={isSignUp ? handleSignUp : handleLogin}
            className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:bg-gradient-to-l transition duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
          </button>

          {/* Toggle Sign Up / Login */}
          <p className="mt-4 text-center text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-orange-500 font-medium hover:underline">
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

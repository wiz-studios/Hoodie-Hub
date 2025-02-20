"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card"; // Import the Card component

export default function LoginPage() {
  // State variables for form fields and authentication status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup modes
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState<string | null>(null); // Store error messages

  // Initialize Supabase client and Next.js router
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Function to handle user login
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Attempt to log in using email and password
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError("Error logging in: " + error.message);
      } else {
        router.push("/checkout"); // Redirect to checkout page after successful login
      }
    } catch (err: any) {
      setError("An unexpected error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user sign-up
  const handleSignUp = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError("Error signing up: " + error.message);
        return;
      }

      if (!data?.user) {
        setError("Sign-up failed. Please try again.");
        return;
      }

      const userId = data.user.id;

      // Step 2: Insert additional user details into the `users` table
      const { error: insertError } = await supabase.from("users").upsert({
        id: userId,
        name,
        phone,
      });

      if (insertError) {
        setError("Failed to save user details: " + insertError.message);
        return;
      }

      alert("Sign-up successful! You can now log in.");
      setIsSignUp(false); // Switch back to login mode
    } catch (err: any) {
      setError("An unexpected error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          {/* Display form title based on login/signup mode */}
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>

          {/* Display error message if there is one */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Sign-up fields (Full Name & Phone Number) */}
          {isSignUp && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm"
                />
              </div>
            </>
          )}

          {/* Email field */}
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

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm"
            />
          </div>

          {/* Confirm Password field (only for sign-up) */}
          {isSignUp && (
            <div className="mb-4">
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

          {/* Login or Sign-up button */}
          <button
            onClick={isSignUp ? handleSignUp : handleLogin}
            className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:bg-gradient-to-l transition duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
          </button>

          {/* Toggle between login and signup */}
          <p className="mt-4 text-center text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-orange-500 font-medium hover:underline"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
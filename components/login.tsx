"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Error logging in: " + error.message);
        return;
      }
      router.push("/checkout");
    } catch (err: any) {
      setError("An unexpected error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError("Error signing up: " + error.message);
        return;
      }
      const { user } = data;
      if (!user) {
        setError("Sign-up failed. Please try again.");
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        setError("User ID not found. Please try logging in.");
        return;
      }
      const { error: insertError } = await supabase.from("users").insert([
        { id: userId, name, phone, email },
      ]);
      if (insertError) {
        setError("Failed to save user details: " + insertError.message);
        return;
      }
      toast.success("Sign-up successful! Now proceed to log in.", {
        position: "top-right",
      });
      setIsSignUp(false);
    } catch (err: any) {
      setError("An unexpected error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09080d] px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="w-full max-w-md">
        <Card className="p-6 shadow-lg bg-[#191bdf] text-white rounded-2xl">
          <h1 className="text-3xl font-semibold text-center mb-6">{isSignUp ? "Create an Account" : "Welcome Back"}</h1>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]" />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]" />
            </div>
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-white text-gray-900 shadow-sm focus:ring-[#fe6807] focus:border-[#fe6807]" />
              </div>
            )}
          </div>
          <button onClick={isSignUp ? handleSignUp : handleLogin} className="mt-4 w-full bg-[#fe6807] text-white font-semibold py-3 rounded-xl hover:bg-[#191bdf] transition duration-300" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
          <p className="mt-4 text-center text-white">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-[#fe6807] font-medium hover:underline">
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

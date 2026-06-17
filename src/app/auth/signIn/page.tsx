/** @format */

"use client";
import { createClient } from "../../../lib/supabase/client";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: "Anas", // Collected from an input field
          age: 27,
        },
      },
    });

    if (error) console.error("Signup failed:", error.message);
    else alert("Check your email for the confirmation link!");
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 max-w-sm p-8">
      <h2>Create an Account</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

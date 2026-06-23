/** @format */

"use client";

import { useState } from "react";
import { createClient } from "@/src/lib/supabase/client"; // Adjust this import path to your client file
import { signupAction } from "@/src/actions/authActions";

export default function SignupPage() {
  // State for form fields
  const [role, setRole] = useState<"contractor" | "subcontractor">(
    "contractor",
  );
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Status states to check connection legitimacy
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    // Instantiate your cookie-aware browser client
    // const supabase = createClient();

    const result = await signupAction({
      email,
      password,
      fullName,
      companyName,
      role,
    });

    // 2. If the server action returned an error, handle it here
    if (result && result.success === false) {
      setLoading(false);
      setStatusMessage({
        type: "error",
        text: `❌ Signup failed: ${result.error}`,
      });
      return;
    }
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   // options: {
    //   //   // Storing extra registration fields inside Supabase user metadata
    //   //   data: {
    //   //     full_name: fullName,
    //   //     company_name: companyName,
    //   //     user_role: role,
    //   //   },
    //   // },
    // });

    setLoading(false);

    // if (error) {
    //   setStatusMessage({
    //     type: "error",
    //     text: `❌ Connection failed: ${error.message}`,
    //   });
    // } else if (data?.user) {
    //   setStatusMessage({
    //     type: "success",
    //     text: "✅ Supabase connection legit! Check your email for the confirmation link.",
    //   });
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        {/* Header Block */}
        <div className="text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join thousands of construction professionals on CrewUp.
          </p>
        </div>

        {/* Feedback Messages */}
        {statusMessage && (
          <div
            className={`p-4 rounded-lg text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {/* Role Selection Blocks */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* General Contractor Option */}
            <div
              onClick={() => setRole("contractor")}
              className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                role === "contractor"
                  ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-600/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-blue-600 mb-2">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                General Contractor
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                I want to post projects and hire crews
              </p>
            </div>

            {/* Subcontractor Option */}
            <div
              onClick={() => setRole("subcontractor")}
              className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                role === "subcontractor"
                  ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-600/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-gray-400 mb-2">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Subcontractor
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                I want to find work and submit proposals
              </p>
            </div>
          </div>

          {/* Text Input Fields */}
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Contractor"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Company name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="ProBuild Solutions"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Work email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8+ chars, letter, number & special character"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Form Action Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Verifying connection..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Legal Disclaimers */}
        <div className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
          By signing up you agree to CrewUp's{" "}
          <a href="#" className="underline hover:text-slate-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-slate-600">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}

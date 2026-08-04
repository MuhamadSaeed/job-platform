"use client";

import { useState } from "react";
import { loginUser, getCurrentUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await loginUser(formData);
      localStorage.setItem("access_token", response.access_token);
      
      const user = await getCurrentUser();
      console.log(user);

      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-12">
      {/* Left Clean Modern Hero Section */}
      <div className="lg:col-span-5 bg-slate-50 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
        <div>
          <span className="text-[#2563EB] text-xl font-bold tracking-tight">
            Hirely
          </span>

          <div className="mt-16 space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Welcome back to your career hub.
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Log in to manage your 1-on-1 interview slots, connect with top HR professionals, and explore hiring opportunities.
            </p>
          </div>
        </div>

        {/* Minimal Feature List */}
        <div className="mt-12 space-y-4 pt-8 border-t border-slate-200/80">
          <FeatureItem text="Verified HR Professionals" />
          <FeatureItem text="1-on-1 Interview Coaching" />
          <FeatureItem text="Instant Feedback & Evaluation" />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-lg mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#0F172A]">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Login to continue your journey on Hirely.
          </p>
        </div>

        {/* Inline Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Inline Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm cursor-pointer mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#2563EB] hover:underline font-semibold"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition text-sm bg-white"
      />
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
      <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-xs font-bold shrink-0">
        ✓
      </div>
      <span>{text}</span>
    </div>
  );
}
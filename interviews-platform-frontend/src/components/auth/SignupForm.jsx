"use client";

import { registerUser } from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = [
  { label: "Applicant", value: "applicant" },
  { label: "HR", value: "hr" },
  { label: "Company", value: "company" },
];

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    national_id: "",
    phone_number: "",
    email: "",
    password: "",
    role: "applicant",
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
      await registerUser({
        ...formData,
        age: Number(formData.age),
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-12">
      {/* Left Hero Section */}
      <div className="lg:col-span-5 bg-slate-50 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
        <div>
          <span className="text-[#2563EB] text-xl font-bold tracking-tight">
            Hirely
          </span>

          <div className="mt-16 space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Start your career growth today.
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Book direct 1-on-1 sessions, schedule interviews, and network with top HR experts across top tech industries.
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
      <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A]">
            Create an Account
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Fill in your details below to set up your profile.
          </p>
        </div>

        {/* Inline Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            name="full_name"
            placeholder="e.g. John Doe"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <Input
            label="Age"
            type="number"
            name="age"
            placeholder="e.g. 24"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition bg-white text-sm"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <Input
            label="National ID"
            name="national_id"
            placeholder="National ID Number"
            value={formData.national_id}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone Number"
            name="phone_number"
            placeholder="01XXXXXXXXX"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="sm:col-span-2">
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition bg-white text-sm"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm mt-2 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2563EB] hover:underline font-semibold">
            Log in
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
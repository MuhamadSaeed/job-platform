"use client";

import { useState } from "react";
import {
  loginUser,
  getCurrentUser,
} from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Login
      const response = await loginUser(formData);

      // Save Token
      localStorage.setItem(
        "access_token",
        response.access_token
      );

      // Get current user
      const user = await getCurrentUser();

      console.log(user);

      // Redirect حسب الـ Role
      if (user.role === "hr") {
        router.push("/hr");
      } else if (user.role === "applicant") {
        router.push("/applicant");
      } else if (user.role === "company") {
        router.push("/company");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Welcome Back
        </h1>

        <p className="text-slate-500 mt-2">
          Login to continue your journey.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        {...props}
        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#2563EB]"
      />
    </div>
  );
}
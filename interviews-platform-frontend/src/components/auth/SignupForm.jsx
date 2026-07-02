"use client";

import { registerUser } from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  {
    label: "Applicant",
    value: "applicant",
  },
  {
    label: "HR",
    value: "hr",
  },
  {
    label: "Company",
    value: "company",
  },
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser({
        ...formData,
        age: Number(formData.age),
      });

alert("Account created successfully");
router.push("/login");


    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Create Account
        </h1>

        <p className="text-slate-500 mt-2">
          Start your journey and connect with HR professionals.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <Input
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
        />

        <Input
          label="Age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#2563EB]"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <Input
          label="National ID"
          name="national_id"
          value={formData.national_id}
          onChange={handleChange}
        />

        <Input
          label="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Role
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#2563EB]"
          >
            {roles.map((role) => (
              <option
                key={role.value}
                value={role.value}
              >
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
        >
          Create Account
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
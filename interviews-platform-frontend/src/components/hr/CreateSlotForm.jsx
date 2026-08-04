"use client";

import { useState } from "react";
import { createHrSlot } from "@/services/auth.service";

export default function CreateSlotForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    start_time: "",
    price: "",
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

    if (!formData.start_time || !formData.price) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await createHrSlot({
        start_time: new Date(formData.start_time).toISOString(),
        price: Number(formData.price),
      });

      setSuccess("Slot created successfully.");

      setFormData({
        start_time: "",
        price: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-[#0F172A]">
          Create New Slot
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          Set up a new interview time slot and price for applicants.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition text-sm bg-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Price (EGP)
            </label>
            <input
              type="number"
              name="price"
              placeholder="e.g. 500"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition text-sm bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold py-3.5 rounded-xl transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm mt-2"
        >
          {loading ? "Creating..." : "Create Slot"}
        </button>
      </form>
    </div>
  );
}
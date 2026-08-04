"use client";

import HrCard from "./HrCard";

export default function HrGrid({ hrs }) {
  if (!hrs || hrs.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-12 text-center">
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">
          No HR Professionals Found
        </h2>
        <p className="text-slate-500 text-sm">
          Try adjusting your search filters to find available HRs.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hrs.map((hr) => (
        <HrCard key={hr.user_id} hr={hr} />
      ))}
    </div>
  );
}
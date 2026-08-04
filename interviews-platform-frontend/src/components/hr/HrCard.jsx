"use client";

import Link from "next/link";
import { useState } from "react";
import { getImageUrl } from "@/services/auth.service";

export default function HrCard({ hr }) {
  const [imgError, setImgError] = useState(false);

  const photoPath = hr.profile_picture_path || hr.profile_picture;
  const imageUrl = getImageUrl(photoPath);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
      <div>
        {/* Banner Section */}
        <div className="h-28 bg-[#0B132B] relative">
          {hr.experience_years !== undefined && hr.experience_years !== null && (
            <span className="absolute top-3 right-3 bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20 shadow-sm">
              {hr.experience_years} Yrs Exp.
            </span>
          )}
        </div>

        {/* Floating Circular Avatar */}
        <div className="px-6 -mt-12 flex justify-start items-end relative z-10">
          <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 relative">
              {imageUrl && !imgError ? (
                <img
                  src={imageUrl}
                  alt={hr.full_name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-slate-400 font-bold text-[10px] text-center px-1">
                  No Photo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 pt-3 space-y-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] truncate group-hover:text-[#0B132B] transition-colors">
              {hr.full_name}
            </h2>

            <p className="text-[#0B132B] font-bold text-xs uppercase tracking-wider mt-0.5 truncate">
              {hr.job_title || "HR Specialist"}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium truncate">
              {hr.current_company ? hr.current_company : "Freelance / Independent"}
            </span>

            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Button Action */}
      <div className="p-6 pt-0">
        <Link href={`/hrs/${hr.user_id}`} className="block w-full">
          <button className="w-full bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold py-3 px-4 rounded-xl transition duration-200 cursor-pointer text-sm shadow-md">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
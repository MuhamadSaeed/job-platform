"use client";

import { useState } from "react";
import AvailableSlots from "./AvailableSlots";
import { getImageUrl } from "@/services/auth.service";

export default function HrDetails({ hr }) {
  const [imgError, setImgError] = useState(false);

  const photoPath = hr?.profile_picture_path || hr?.profile_picture;
  const cvPath = hr?.cv_path;
  const imageUrl = getImageUrl(photoPath);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Main Profile Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        {/* Header & Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
            {imageUrl && !imgError ? (
              <img
                src={imageUrl}
                alt={hr?.full_name || "HR Profile"}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 font-semibold text-xs text-center px-2">
                No Photo
              </span>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {hr?.full_name || "HR Professional"}
            </h1>

            <p className="text-[#0B132B] text-base font-bold mt-1">
              {hr?.job_title || "Specialized Interviewer"}
            </p>

            <p className="text-slate-500 text-sm mt-0.5">
              {hr?.current_company ? `Works at ${hr.current_company}` : "Company not specified"}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <InfoItem
            label="Experience"
            value={
              hr?.experience_years !== undefined && hr?.experience_years !== null
                ? `${hr.experience_years} Years`
                : "-"
            }
          />

          <InfoItem
            label="LinkedIn"
            value={
              hr?.linkedin_url ? (
                <a
                  href={hr.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline font-medium break-all"
                >
                  Open LinkedIn Profile
                </a>
              ) : (
                "-"
              )
            }
          />

          <InfoItem label="Skills" value={hr?.skills || "-"} />

          <InfoItem label="Achievements" value={hr?.achievements || "-"} />

          <div className="md:col-span-2">
            <InfoItem
              label="CV Document"
              value={
                cvPath ? (
                  <a
                    href={getImageUrl(cvPath)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#2563EB] hover:underline font-semibold"
                  >
                    View / Download CV
                  </a>
                ) : (
                  "-"
                )
              }
            />
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            About
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-700 leading-relaxed whitespace-pre-line text-sm">
            {hr?.bio || "No bio information provided."}
          </div>
        </div>
      </div>

      {/* Available Slots Component */}
      <AvailableSlots slots={hr?.available_slots || []} />
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-[#0F172A] text-sm break-words min-h-[46px] flex items-center">
        {value}
      </div>
    </div>
  );
}
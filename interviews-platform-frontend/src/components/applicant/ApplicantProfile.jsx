"use client";

import { useState } from "react";
import { getImageUrl } from "@/services/auth.service";

export default function ApplicantProfile({ profile }) {
  const [imgError, setImgError] = useState(false);

  const photoPath = profile?.profile_picture_path || profile?.profile_picture;
  const imageUrl = getImageUrl(photoPath);
  const cvUrl = profile?.cv_path ? getImageUrl(profile.cv_path) : null;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
        <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt="Applicant Profile"
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
            Applicant Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {profile?.is_student ? "Student" : "Graduate / Job Seeker"}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <ProfileItem label="University" value={profile?.university} />

        <ProfileItem label="Education" value={profile?.education} />

        <ProfileItem
          label="Graduation Year"
          value={profile?.graduation_year}
        />

        <ProfileItem label="Skills" value={profile?.skills} />

        <ProfileItem label="Experience" value={profile?.experience} />

        <ProfileItem
          label="LinkedIn"
          value={
            profile?.linkedin_url ? (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline font-medium break-all"
              >
                {profile.linkedin_url}
              </a>
            ) : null
          }
        />

        <ProfileItem
          label="GitHub"
          value={
            profile?.github_url ? (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline font-medium break-all"
              >
                {profile.github_url}
              </a>
            ) : null
          }
        />

        <ProfileItem
          label="Portfolio"
          value={
            profile?.portfolio_url ? (
              <a
                href={profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline font-medium break-all"
              >
                {profile.portfolio_url}
              </a>
            ) : null
          }
        />

        <div className="md:col-span-2">
          <ProfileItem
            label="CV Document"
            value={
              cvUrl ? (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#2563EB] hover:underline font-semibold"
                >
                  View CV Document
                </a>
              ) : null
            }
          />
        </div>

        <div className="md:col-span-2">
          <ProfileItem label="Bio" value={profile?.bio} />
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-[#0F172A] text-sm break-words min-h-[46px] flex items-center">
        {value || "-"}
      </div>
    </div>
  );
}
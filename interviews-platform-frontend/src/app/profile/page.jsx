"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getHrProfile, getApplicantProfile } from "@/services/auth.service";
import HrProfile from "@/components/hr/HrProfile";
import ApplicantProfile from "@/components/applicant/ApplicantProfile";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [roleProfile, setRoleProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        if (userData.role === "hr") {
          try {
            const hrData = await getHrProfile();
            setRoleProfile(hrData);
          } catch (err) {
            if (err.status !== 404) console.error(err);
          }
        } else if (userData.role === "applicant") {
          try {
            const applicantData = await getApplicantProfile();
            setRoleProfile(applicantData);
          } catch (err) {
            if (err.status !== 404) console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-medium text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Account Overview
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your personal details and specialized profile.
            </p>
          </div>

          <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B132B] text-white shadow-sm">
            Role: {user?.role || "Member"}
          </span>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: General Info */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-[#0F172A] text-base">
                  {user?.full_name || "User"}
                </h2>
                <p className="text-xs text-slate-500 break-all">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <InfoItem label="Phone Number" value={user?.phone_number} />
              <InfoItem label="National ID" value={user?.national_id} />
              <InfoItem label="Age" value={user?.age} />
              <InfoItem label="Gender" value={user?.gender} />
            </div>
          </div>

          {/* Right Column: Role Specific Profile */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {user?.role === "hr" && (
              <>
                {roleProfile ? (
                  <>
                    <HrProfile profile={roleProfile} />

                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                      <Link href="/profile/edit">
                        <button className="bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold text-sm px-5 py-3 rounded-xl transition duration-200 cursor-pointer shadow-sm">
                          Edit HR Profile
                        </button>
                      </Link>

                      <Link href="/profile/slots">
                        <button className="bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold text-sm px-5 py-3 rounded-xl transition duration-200 cursor-pointer shadow-sm">
                          Manage Interview Slots
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-slate-600 text-sm">
                      You have not completed your HR profile details yet.
                    </p>
                    <Link href="/profile/edit" className="inline-block">
                      <button className="bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold text-sm px-6 py-3 rounded-xl transition duration-200 cursor-pointer shadow-sm">
                        Complete HR Profile
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {user?.role === "applicant" && (
              <>
                {roleProfile ? (
                  <>
                    <ApplicantProfile profile={roleProfile} />

                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                      <Link href="/profile/edit">
                        <button className="bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold text-sm px-5 py-3 rounded-xl transition duration-200 cursor-pointer shadow-sm">
                          Edit Applicant Profile
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-slate-600 text-sm">
                      You have not completed your Applicant profile details yet.
                    </p>
                    <Link href="/profile/edit" className="inline-block">
                      <button className="bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold text-sm px-6 py-3 rounded-xl transition duration-200 cursor-pointer shadow-sm">
                        Complete Applicant Profile
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-[#0F172A] break-words">
        {value ?? "-"}
      </p>
    </div>
  );
}
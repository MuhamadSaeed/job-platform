"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth.service";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data =
          await getCurrentUser();

        setUser(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">
          My Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileItem
            label="Full Name"
            value={user.full_name}
          />

          <ProfileItem
            label="Email"
            value={user.email}
          />

          <ProfileItem
            label="Phone Number"
            value={user.phone_number}
          />

          <ProfileItem
            label="National ID"
            value={user.national_id}
          />

          <ProfileItem
            label="Age"
            value={user.age}
          />

          <ProfileItem
            label="Gender"
            value={user.gender}
          />

          <ProfileItem
            label="Email Verified"
            value={
              user.email_verified
                ? "Yes"
                : "No"
            }
          />

          <ProfileItem
            label="Phone Verified"
            value={
              user.phone_verified
                ? "Yes"
                : "No"
            }
          />
        </div>
      </div>
    </div>
  );
}

function ProfileItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">
        {label}
      </p>

      <div className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
        {value}
      </div>
    </div>
  );
}
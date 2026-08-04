"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth.service";
import HrProfileForm from "@/components/hr/HrProfileForm";
import ApplicantProfileForm from "@/components/applicant/ApplicantProfileForm";

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 font-medium bg-[#F8FAFC]">
        Loading form...
      </div>
    );
  }

  if (user?.role === "hr") {
    return <HrProfileForm />;
  }

  if (user?.role === "applicant") {
    return <ApplicantProfileForm />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-600 font-medium bg-[#F8FAFC]">
      Profile edit is not available for this account type.
    </div>
  );
}
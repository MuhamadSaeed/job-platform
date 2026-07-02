"use client";

import { useEffect, useState } from "react";
import { getHrProfile } from "@/services/auth.service";
import HrProfile from "@/components/hr/HrProfile";
import Link from "next/link";
export default function HrPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getHrProfile();
        setProfile(data);
      } catch (error) {
        if (error.status === 404) {
          setNotFound(true);
        } else {
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-3">
            HR Profile
          </h1>

          <p className="text-slate-500 mb-6">
            You haven't created your HR profile yet.
          </p>

<Link href="/hr/edit">
  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
    Complete Profile
  </button>
</Link>
        </div>
      </div>
    );
  }

  return <HrProfile profile={profile} />;
}
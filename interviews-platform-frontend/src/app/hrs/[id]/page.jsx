"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getHrDetails } from "@/services/auth.service";
import HrDetails from "@/components/hr/HrDetails";

export default function HrPage() {
  const { id } = useParams();

  const [hr, setHr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHr() {
      try {
        const data = await getHrDetails(id);
        setHr(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadHr();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 font-medium bg-[#F8FAFC]">
        Loading profile...
      </div>
    );
  }

  if (!hr) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
            HR Profile Not Found
          </h1>
          <p className="text-slate-500 text-sm">
            The requested HR profile does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-6">
      <HrDetails hr={hr} />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import HrScheduleList from "@/components/schedule/HrScheduleList";
import { getHrSchedule } from "@/services/auth.service";

export default function HrSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await getHrSchedule();
        setSchedules(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-medium text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          Loading schedule...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            My Interview Schedule
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage your upcoming booked interview sessions with applicants.
          </p>
        </div>

        <HrScheduleList schedules={schedules} />
      </div>
    </main>
  );
}
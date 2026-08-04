"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { lockInterviewSlot } from "@/services/auth.service";

export default function AvailableSlots({ slots = [] }) {
  const router = useRouter();
  const [loadingSlotId, setLoadingSlotId] = useState(null);

  async function handleBook(slotId) {
    try {
      setLoadingSlotId(slotId);
      await lockInterviewSlot(slotId);
      router.push(`/payment/${slotId}`);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to lock interview slot");
    } finally {
      setLoadingSlotId(null);
    }
  }

  if (!slots.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center py-12 shadow-sm">
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">
          Available Interview Slots
        </h2>
        <p className="text-slate-500 text-sm">
          No available interview slots right now. Check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">
            Available Interview Slots
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Select a slot to lock and proceed with booking your interview.
          </p>
        </div>

        <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full border border-slate-200">
          Available: {slots.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slots.map((slot) => {
          const isLoading = loadingSlotId === slot.id;

          return (
            <div
              key={slot.id}
              className="border border-slate-200 hover:border-slate-300 rounded-xl p-5 bg-white transition duration-200 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                    Interview Time
                  </span>
                  <span className="text-lg font-extrabold text-[#0F172A]">
                    {slot.price}{" "}
                    <span className="text-xs font-semibold text-slate-500">
                      EGP
                    </span>
                  </span>
                </div>

                <p className="text-sm font-bold text-[#0F172A]">
                  {new Date(slot.start_time).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  disabled={isLoading}
                  onClick={() => handleBook(slot.id)}
                  className="w-full bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold py-3 px-5 rounded-xl transition duration-200 cursor-pointer text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Locking Slot..." : "Book Interview"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
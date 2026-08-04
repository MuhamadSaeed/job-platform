"use client";

import { useEffect, useState } from "react";
import { getHrSlots, deleteHrSlot } from "@/services/auth.service";
import CreateSlotForm from "./CreateSlotForm";
import Link from "next/link";

export default function HrSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSlots() {
    try {
      setLoading(true);
      const data = await getHrSlots();
      setSlots(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  async function handleDelete(slotId) {
    const confirmDelete = confirm("Are you sure you want to delete this slot?");
    if (!confirmDelete) return;

    try {
      await deleteHrSlot(slotId);
      loadSlots();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center text-slate-500 font-medium text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          Loading slots...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Interview Slots
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Create and manage availability for candidate 1-on-1 sessions.
            </p>
          </div>

          <Link href="/profile/schedule">
            <button className="bg-[#0B132B] hover:bg-[#1C2541] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-200 cursor-pointer shadow-sm">
              View Schedule
            </button>
          </Link>
        </div>

        {/* Create Slot Form Container */}
        <CreateSlotForm onSuccess={loadSlots} />

        {/* Slots Grid Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Active Slots
            </h2>

            <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full border border-slate-200">
              Total: {slots.length}
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-500 text-sm font-medium">
                No interview slots found. Create your first slot above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots.map((slot) => {
                const isBooked = slot.is_booked;

                return (
                  <div
                    key={slot.id}
                    className="border border-slate-200 hover:border-slate-300 rounded-xl p-5 bg-white transition duration-200 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                            isBooked
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {isBooked ? "Booked" : "Available"}
                        </span>

                        <span className="text-lg font-extrabold text-[#0F172A]">
                          {slot.price}{" "}
                          <span className="text-xs font-semibold text-slate-500">
                            EGP
                          </span>
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                          Date & Time
                        </p>
                        <p className="text-sm font-bold text-[#0F172A]">
                          {new Date(slot.start_time).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>

                    {!isBooked && (
                      <div className="pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="w-full sm:w-auto bg-slate-100 hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                        >
                          Delete Slot
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
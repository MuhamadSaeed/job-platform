"use client";

import { useEffect, useState } from "react";
import { getAllHrs } from "@/services/auth.service";
import HrGrid from "@/components/hr/HrGrid";

export default function HrsPage() {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [specialty, setSpecialty] = useState("");

  async function loadHrs(name = "", spec = "") {
    try {
      setLoading(true);
      const data = await getAllHrs(name, spec);
      setHrs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHrs();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    loadHrs(searchName, specialty);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-medium text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          Loading HR experts...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Find an HR Professional
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Browse verified HR experts and book a 1-on-1 mock interview session.
            </p>
          </div>

          <span className="self-start sm:self-center bg-slate-100 text-slate-700 font-semibold text-xs px-3.5 py-1.5 rounded-full border border-slate-200">
            Available Experts: {hrs.length}
          </span>
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
          >
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Name Search
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition text-sm bg-white"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Specialty / Title
              </label>
              <input
                type="text"
                placeholder="Search by specialty or title..."
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition text-sm bg-white"
              />
            </div>

            <div className="sm:col-span-2 sm:self-end">
              <button
                type="submit"
                className="w-full bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold py-2.5 px-5 rounded-xl transition duration-200 cursor-pointer shadow-sm text-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Grid Section */}
        <HrGrid hrs={hrs} />
        
      </div>
    </div>
  );
}
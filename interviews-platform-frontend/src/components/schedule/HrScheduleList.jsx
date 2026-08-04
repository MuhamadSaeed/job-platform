"use client";

export default function HrScheduleList({ schedules }) {
  if (!schedules.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center py-12 shadow-sm">
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">
          No Scheduled Interviews
        </h2>
        <p className="text-slate-500 text-sm">
          You don&apos;t have any booked interview sessions at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div
          key={schedule.slot_id}
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          {/* Main Info Container */}
          <div className="flex-1 space-y-5 w-full">
            {/* Header Status Badges */}
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                Upcoming
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">
                Slot #{schedule.slot_id}
              </span>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Applicant Name
                </p>
                <p className="text-sm font-bold text-[#0F172A] capitalize">
                  {schedule.student_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  University / Inst.
                </p>
                <p className="text-sm font-semibold text-slate-700 capitalize">
                  {schedule.student_university || "Not Provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Interview Date
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {new Date(schedule.start_time).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Session Price
                </p>
                <p className="text-sm font-bold text-[#0F172A]">
                  {schedule.price} EGP
                </p>
              </div>
            </div>

            {/* Time Remaining Badge */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Remaining:
              </span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                {schedule.time_remaining}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex items-center justify-end">
            <a
              href={schedule.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold py-3 px-6 rounded-xl text-center text-sm transition duration-200 cursor-pointer shadow-sm"
            >
              Join Meeting
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
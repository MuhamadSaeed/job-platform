"use client";

export default function NotificationList({ notifications = [] }) {
  if (!notifications.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center py-12 shadow-sm">
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">
          No Notifications
        </h2>
        <p className="text-slate-500 text-sm">
          You don&apos;t have any notifications or interview confirmations yet.
        </p>
      </div>
    );
  }

  const formatMeetingLink = (link) => {
    if (!link) return "#";
    if (link.startsWith("http://") || link.startsWith("https://")) {
      return link;
    }
    return `https://${link}`;
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const rawLink =
          notification.meeting_link ||
          notification.link ||
          notification.zoom_link;
        const hasValidLink = Boolean(rawLink);
        const meetingUrl = formatMeetingLink(rawLink);

        return (
          <div
            key={notification.slot_id}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            {/* Details Section */}
            <div className="flex-1 space-y-5 w-full">
              {/* Status Header */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    notification.is_upcoming
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {notification.is_upcoming ? "Upcoming" : "Finished"}
                </span>

                <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  Interview Confirmed
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    HR Professional
                  </p>
                  <p className="text-sm font-bold text-[#0F172A]">
                    {notification.hr_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Company
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {notification.hr_company || "Not Specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Interview Date
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(notification.start_time).toLocaleString(
                      undefined,
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Time Remaining
                  </p>
                  <p className="text-sm font-semibold text-emerald-700">
                    {notification.time_remaining}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex items-center justify-end">
              {hasValidLink ? (
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#0B132B] hover:bg-[#1C2541] text-white font-semibold py-3 px-6 rounded-xl text-center text-sm transition duration-200 cursor-pointer shadow-sm"
                >
                  Join Meeting
                </a>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto bg-slate-100 text-slate-400 font-semibold py-3 px-6 rounded-xl text-center text-sm border border-slate-200 cursor-not-allowed"
                >
                  No Link Provided
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
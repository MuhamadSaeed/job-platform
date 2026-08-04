"use client";

import { useEffect, useState } from "react";
import NotificationList from "@/components/notifications/NotificationList";
import { getApplicantNotifications } from "@/services/auth.service";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getApplicantNotifications();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 font-medium bg-[#F8FAFC]">
        Loading notifications...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">
            My Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your confirmed interview bookings and join scheduled meetings.
          </p>
        </div>

        <NotificationList notifications={notifications} />
      </div>
    </main>
  );
}
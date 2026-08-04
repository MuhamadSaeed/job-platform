"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/services/auth.service";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setUser(null);
          return;
        }
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    router.push("/login");
  };

  // If loading or user is not logged in, don't show navbar
  if (loading || !user) {
    return null;
  }

  return (
    <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo / Title */}
        <Link href="/" className="text-xl font-bold text-[#0F172A] tracking-tight">
          JobPlatform
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink href="/profile" active={pathname === "/profile"}>
            Profile
          </NavLink>

          {/* HR Nav Items */}
          {user.role === "hr" && (
            <>
              <NavLink href="/profile/slots" active={pathname === "/profile/slots"}>
                My Slots
              </NavLink>
              <NavLink href="/profile/schedule" active={pathname === "/hr/schedule"}>
                My Schedule
              </NavLink>
            </>
          )}

          {/* Applicant Nav Items */}
          {user.role === "applicant" && (
            <>
              <NavLink href="/hrs" active={pathname === "/hrs"}>
                Find HRs
              </NavLink>
              <NavLink href="/notifications" active={pathname === "/notifications"}>
                My Slots
              </NavLink>
            </>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-2 text-sm font-semibold text-slate-500 hover:text-red-600 px-3 py-2 rounded-xl transition duration-200 cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer ${
        active
          ? "bg-blue-50 text-[#2563EB]"
          : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  );
}
/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useLogout } from "@/lib/useLogout";
import { 
  LayoutDashboard, 
  BookOpen,
  Map,
  Users,
  UserRound,
  LogOut, 
  UserCheck,
  ClipboardList,
  Receipt,
  Landmark,
  Calendar
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { askLogout, logoutDialog } = useLogout();
  const [waitingCount, setWaitingCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ waitingInvoices: number; waitingPrepayments: number }>("/api/admin/notifications")
      .then((res) => {
        if (!cancelled) setWaitingCount((res.waitingInvoices || 0) + (res.waitingPrepayments || 0));
      })
      .catch(() => {
        if (!cancelled) setWaitingCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const desktopNavLinks = [
    {
      label: "Dashboard",
      href: "/app/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Program",
      href: "/app/admin/program",
      icon: BookOpen,
    },
    {
      label: "Roadmap",
      href: "/app/admin/roadmap",
      icon: Map,
    },
    {
      label: "Tentor",
      href: "/app/admin/tentor",
      icon: Users,
    },
    {
      label: "Murid",
      href: "/app/admin/murid",
      icon: UserRound,
    },
    {
      label: "Enrollment",
      href: "/app/admin/enrollment",
      icon: ClipboardList,
    },
    {
      label: "Jadwal",
      href: "/app/admin/jadwal",
      icon: Calendar,
    },
    {
      label: "Tagihan",
      href: "/app/admin/tagihan",
      icon: Receipt,
    },
    {
      label: "Rekening",
      href: "/app/admin/rekening",
      icon: Landmark,
    },
  ];

  const mobileNavLinks = [
    {
      label: "Dashboard",
      href: "/app/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Program",
      href: "/app/admin/program",
      icon: BookOpen,
    },
    {
      label: "Tentor",
      href: "/app/admin/tentor",
      icon: Users,
    },
    {
      label: "Murid",
      href: "/app/admin/murid",
      icon: UserRound,
    },
    {
      label: "Enrollment",
      href: "/app/admin/enrollment",
      icon: ClipboardList,
    },
    {
      label: "Jadwal",
      href: "/app/admin/jadwal",
      icon: Calendar,
    },
    {
      label: "Tagihan",
      href: "/app/admin/tagihan",
      icon: Receipt,
    },
    {
      label: "Rekening",
      href: "/app/admin/rekening",
      icon: Landmark,
    },
  ];

  return (
    <div className="min-h-screen bg-[#6d8fc4] text-gray-800 font-sans flex flex-col md:flex-row relative print:bg-white print:text-black print:min-h-0">

      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-white/60 shadow-xl flex-col gap-6 p-6 bg-white/30 backdrop-blur-2xl z-50 pt-16 print:hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent">
            Nurman Course
          </h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
            Admin Portal
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          {desktopNavLinks.map((link) => {
            const Icon = link.icon;
            // Exact active matching or sub-paths
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? "bg-[#4a70a9] text-white font-bold shadow-lg shadow-[#4a70a9]/30"
                    : "text-gray-600 hover:bg-white/50 hover:text-gray-900 active:scale-[0.98]"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{link.label}</span>
                {link.href === "/app/admin/tagihan" && waitingCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                    {waitingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-gray-200/50 pt-4 flex flex-col gap-1">
          <Link
            href="/app"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white/50 rounded-xl transition-colors duration-200 font-medium active:scale-[0.98]"
          >
            <UserCheck size={20} />
            <span className="text-sm">Pilih Portal</span>
          </Link>
          <button
            onClick={askLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-medium active:scale-[0.98] w-full text-left"
          >
            <LogOut size={20} />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow md:ml-64 flex flex-col min-h-screen relative z-10 pb-24 md:pb-8 print:ml-0 print:pt-0 print:pb-0">
        <div className="w-full flex-grow flex flex-col">
          {children}
        </div>
      </main>

      {/* Mobile BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-3 bg-white/85 backdrop-blur-lg border-t border-white/60 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl pb-[max(env(safe-area-inset-bottom),12px)] print:hidden">
        {mobileNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-colors duration-150 ${
                isActive
                  ? "bg-[#4a70a9]/15 text-[#4a70a9] font-bold px-4"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] mt-1 font-medium">{link.label}</span>
              {link.href === "/app/admin/tagihan" && waitingCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none ring-2 ring-white">
                  {waitingCount}
                </span>
              )}
            </Link>
          );
        })}
        <Link
          href="/app"
          className="flex flex-col items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-800"
        >
          <UserCheck size={20} />
          <span className="text-[10px] mt-1 font-medium">Portal</span>
        </Link>
        <button
          onClick={askLogout}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-red-500 hover:text-red-700"
        >
          <LogOut size={20} />
          <span className="text-[10px] mt-1 font-medium">Keluar</span>
        </button>
      </nav>

      {logoutDialog}
    </div>
  );
}

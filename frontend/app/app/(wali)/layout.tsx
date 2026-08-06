/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  ClipboardList,
  User
} from "lucide-react";

interface WaliLayoutProps {
  children: React.ReactNode;
}

export default function WaliLayout({ children }: WaliLayoutProps) {
  const pathname = usePathname();
  const [unpaidCount, setUnpaidCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ unpaidInvoices: number }>("/api/me/notifications")
      .then((res) => {
        if (!cancelled) setUnpaidCount(res.unpaidInvoices || 0);
      })
      .catch(() => {
        if (!cancelled) setUnpaidCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const navLinks = [
    {
      label: "Dashboard",
      href: "/app/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Program Anak",
      href: "/app/program",
      icon: GraduationCap,
    },
    {
      label: "Jadwal",
      href: "/app/jadwal",
      icon: Calendar,
    },
    {
      label: "Laporan",
      href: "/app/laporan",
      icon: ClipboardList,
    },
    {
      label: "Tagihan",
      href: "/app/tagihan",
      icon: CreditCard,
    },
  ];

  const mobileNavLinks = [
    {
      label: "Program Anak",
      href: "/app/program",
      icon: GraduationCap,
    },
    {
      label: "Jadwal",
      href: "/app/jadwal",
      icon: Calendar,
    },
    {
      label: "Dashboard",
      href: "/app/dashboard",
      icon: LayoutDashboard,
      isCenter: true,
    },
    {
      label: "Laporan",
      href: "/app/laporan",
      icon: ClipboardList,
    },
    {
      label: "Tagihan",
      href: "/app/tagihan",
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-[#6d8fc4] text-gray-800 font-sans flex flex-col md:flex-row relative">

      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-white/60 shadow-xl flex-col gap-6 p-6 bg-white/30 backdrop-blur-2xl z-50 pt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent">
            Nurman Course
          </h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
            Parent Portal
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
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
                {link.href === "/app/tagihan" && unpaidCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                    {unpaidCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-gray-200/50 pt-4 flex flex-col gap-1">
          <Link
            href="/app/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
              pathname === "/app/profile"
                ? "bg-[#4a70a9] text-white font-bold shadow-lg shadow-[#4a70a9]/30"
                : "text-gray-600 hover:bg-white/50 hover:text-gray-900 active:scale-[0.98]"
            }`}
          >
            <User size={20} />
            <span className="text-sm">Profil Saya</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow md:ml-64 flex flex-col min-h-screen relative z-10 pb-20 md:pb-8">
        {/* Mobile TopBar: brand + Profile Avatar */}
        <div className="md:hidden sticky z-40 flex items-center justify-between gap-2 px-4 py-2 bg-white/70 backdrop-blur-xl border-b border-white/60 top-0">
          <span className="text-base font-bold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
            Nurman Course
          </span>
          <Link
            href="/app/profile"
            className="w-10 h-10 rounded-full bg-[#4a70a9]/10 border border-[#4a70a9]/20 flex items-center justify-center text-[#4a70a9] hover:bg-[#4a70a9]/20 active:scale-95 transition-all"
          >
            <User size={20} />
          </Link>
        </div>

        <div className="w-full flex-grow flex flex-col">
          {children}
        </div>
      </main>

      {/* Mobile BottomNavBar (Dashboard in center, raised 3D effect, icons only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 bg-white/85 backdrop-blur-lg border-t border-white/60 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl pb-[env(safe-area-inset-bottom)] h-[calc(52px+env(safe-area-inset-bottom))]">
        {mobileNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          
          if (link.isCenter) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 -translate-y-4 shadow-[0_6px_16px_rgba(74,112,169,0.35)] border-2 active:scale-95 ${
                  isActive
                    ? "bg-[#4a70a9] border-white text-white shadow-[0_8px_20px_rgba(74,112,169,0.45)] ring-4 ring-[#4a70a9]/10"
                    : "bg-[#e8f0fe] border-[#4a70a9]/30 text-[#4a70a9] hover:bg-[#d0e1fd]"
                }`}
              >
                {/* 3D Inner Shadow / Glossy Reflection */}
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-white/0 to-white/20 pointer-events-none" />
                <Icon size={24} className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.15)]" />
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? "text-[#4a70a9] bg-[#4a70a9]/10"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <Icon size={25} />
              {link.href === "/app/tagihan" && unpaidCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none ring-2 ring-white">
                  {unpaidCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

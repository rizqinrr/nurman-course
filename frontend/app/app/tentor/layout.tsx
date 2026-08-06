/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app — mobile: top bar brand-only + badge, bottom 5 icons profile left, dashboard center 3D */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/lib/useLogout";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  LogOut,
  CalendarDays,
  User,
  GraduationCap,
} from "lucide-react";

interface TentorLayoutProps {
  children: React.ReactNode;
}

export default function TentorLayout({ children }: TentorLayoutProps) {
  const pathname = usePathname();
  const { askLogout, logoutDialog } = useLogout();

  const desktopNavLinks = [
    { label: "Dashboard Sesi", href: "/app/tentor/dashboard", icon: LayoutDashboard },
    { label: "Jadwal", href: "/app/tentor/jadwal", icon: CalendarDays },
    { label: "Laporan Harian", href: "/app/tentor/laporan-harian", icon: FileText },
    { label: "Laporan Perkembangan", href: "/app/tentor/laporan-perkembangan", icon: TrendingUp },
  ];

  type MobileNavItem = { label: string; href: string; icon: React.ElementType; isCenter?: boolean };
  const mobileNavLinks: MobileNavItem[] = [
    { label: "Jadwal", href: "/app/tentor/jadwal", icon: CalendarDays },
    { label: "Harian", href: "/app/tentor/laporan-harian", icon: FileText },
    { label: "Dashboard", href: "/app/tentor/dashboard", icon: LayoutDashboard, isCenter: true },
    { label: "Rapor", href: "/app/tentor/laporan-perkembangan", icon: TrendingUp },
    { label: "Profil", href: "/app/tentor/profil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#6d8fc4] text-gray-800 font-sans flex flex-col md:flex-row relative print:bg-white print:text-black print:min-h-0">
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-white/60 shadow-xl flex-col gap-6 p-6 bg-white/30 backdrop-blur-2xl z-50 pt-16 print:hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent">Nurman Course</h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Tentor Portal</p>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {desktopNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive ? "bg-[#4a70a9] text-white font-bold shadow-lg shadow-[#4a70a9]/30" : "text-gray-600 hover:bg-white/50 hover:text-gray-900 active:scale-[0.98]"}`}>
                <Icon size={20} /><span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
          <Link
            href="/app/tentor/profil"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 mt-1 ${pathname.startsWith("/app/tentor/profil") ? "bg-[#4a70a9] text-white font-bold shadow-lg shadow-[#4a70a9]/30" : "text-gray-600 hover:bg-white/50 hover:text-gray-900 active:scale-[0.98]"}`}
          >
            <User size={20} /><span className="text-sm">Profil</span>
          </Link>
        </div>
        <div className="border-t border-gray-200/50 pt-4 flex flex-col gap-1">
          <button onClick={askLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-medium active:scale-[0.98] w-full text-left">
            <LogOut size={20} /><span className="text-sm">Keluar</span>
          </button>
        </div>
      </nav>

      {logoutDialog}

      <main className="flex-grow md:ml-64 flex flex-col min-h-screen relative z-10 pb-20 md:pb-8 print:ml-0 print:pt-0 print:pb-0">
        <div className="md:hidden sticky z-40 flex items-center justify-between gap-3 px-4 py-2.5 bg-white/75 backdrop-blur-xl border-b border-white/60 top-0 print:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#4a70a9]/10 border border-[#4a70a9]/15 flex items-center justify-center text-[#4a70a9] shrink-0">
              <GraduationCap size={16} />
            </div>
            <span className="text-[15px] font-extrabold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap">Nurman Course</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="rounded-full bg-[#4a70a9]/10 border border-[#4a70a9]/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#4a70a9]">Tentor</span>
          </div>
        </div>
        <div className="w-full flex-grow flex flex-col">{children}</div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-1.5 sm:px-2 bg-white/90 backdrop-blur-xl border-t border-white/60 shadow-[0_-8px_24px_rgba(74,112,169,0.12)] rounded-t-[22px] pb-[env(safe-area-inset-bottom)] h-[calc(58px+env(safe-area-inset-bottom))] print:hidden">
        {mobileNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          if (link.isCenter) {
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className={`relative flex items-center justify-center w-[60px] h-[60px] rounded-full transition-all duration-300 -translate-y-5 shadow-[0_8px_20px_rgba(74,112,169,0.35)] border-[3px] active:scale-95 ${isActive ? "bg-[#4a70a9] border-white text-white shadow-[0_10px_24px_rgba(74,112,169,0.5)] ring-4 ring-[#4a70a9]/15" : "bg-[#eef4ff] border-white text-[#4a70a9] hover:bg-[#dbe8ff]"}`}
              >
                <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/35 to-white/0 pointer-events-none" />
                <Icon size={26} className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
              </Link>
            );
          }
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className={`flex items-center justify-center w-[46px] h-[42px] rounded-[14px] transition-all duration-150 active:scale-90 ${isActive ? "text-[#4a70a9] bg-[#4a70a9]/12 ring-1 ring-[#4a70a9]/15" : "text-gray-400 hover:text-gray-600 hover:bg-gray-500/[0.06]"}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
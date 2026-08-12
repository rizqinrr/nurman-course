/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app — mobile: top bar brand-only + badge, bottom 5 icons profile left, dashboard center 3D */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLogout } from "@/lib/useLogout";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  LogOut,
  CalendarDays,
  User,
  X,
} from "lucide-react";

interface TentorLayoutProps {
  children: React.ReactNode;
}

export default function TentorLayout({ children }: TentorLayoutProps) {
  const pathname = usePathname();
  const { askLogout, logoutDialog } = useLogout();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    if (mobileNavOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

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
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-[#2e4b7a] shadow-[0_8px_18px_rgba(74,112,169,0.5)]">
              <Image src="/Nlogo.png" alt="Logo Nurman Course" width={500} height={500} priority className="h-10 w-10 rounded-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent">Nurman Course</h1>
          </div>
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
          <button
            type="button"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((v) => !v)}
            className={`inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-full border-2 border-white/80 bg-[#2e4b7a] shadow-[0_5px_12px_rgba(74,112,169,0.5)] transition-transform duration-300 active:scale-95 ${mobileNavOpen ? "translate-x-3" : "translate-x-0"}`}
          >
            <Image src="/Nlogo.png" alt="Logo Nurman Course" width={500} height={500} priority className="h-10 w-10 rounded-full object-cover" />
          </button>
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

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden print:hidden ${mobileNavOpen ? "" : "pointer-events-none"}`}
      >
        <div
          aria-hidden
          onClick={() => setMobileNavOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileNavOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi tentor"
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-white/95 backdrop-blur-2xl border-r border-white/60 shadow-2xl flex flex-col gap-4 p-4 pt-5 transition-transform duration-300 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent">
                Nurman Course
              </h1>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                Tentor Portal
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup menu navigasi"
              onClick={() => setMobileNavOpen(false)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:bg-[#4a70a9]/10 hover:text-[#4a70a9] active:scale-95 transition-all shrink-0"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            {desktopNavLinks.map((link) => {
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
                </Link>
              );
            })}
          </div>

          <div className="border-t border-gray-200/50 pt-4 flex flex-col gap-1">
            <button
              onClick={askLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 font-medium active:scale-[0.98] w-full text-left"
            >
              <LogOut size={20} />
              <span className="text-sm">Keluar</span>
            </button>
          </div>
        </aside>
      </div>

      {logoutDialog}
    </div>
  );
}
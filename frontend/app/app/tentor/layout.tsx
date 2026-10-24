/* Hallmark · genre: warm-editorial · design-system: design.md · designed-as-mobile-app */
"use client";

import React, { useEffect, useState } from "react";
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
  X,
  Menu,
} from "lucide-react";

interface TentorLayoutProps {
  children: React.ReactNode;
}

export default function TentorLayout({ children }: TentorLayoutProps) {
  const pathname = usePathname();
  const { askLogout, logoutDialog } = useLogout({
    message: "Kamu akan keluar dari Portal Tentor nCourse.",
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navPathname, setNavPathname] = useState(pathname);

  if (navPathname !== pathname) {
    setNavPathname(pathname);
    setMobileNavOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    if (mobileNavOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  const navLinks = [
    { label: "Beranda", href: "/app/tentor/dashboard", icon: LayoutDashboard },
    { label: "Jadwal", href: "/app/tentor/jadwal", icon: CalendarDays },
    { label: "Harian", href: "/app/tentor/laporan-harian", icon: FileText },
    { label: "Rapor", href: "/app/tentor/laporan-perkembangan", icon: TrendingUp },
    { label: "Profil", href: "/app/tentor/profil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#14233a] font-sans flex flex-col md:flex-row relative print:bg-white print:text-black print:min-h-0">
      {/* Desktop Sidebar */}
      <nav
        aria-label="Navigasi Portal Tentor"
        className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-[#E5DDD0] flex-col justify-between p-5 bg-white z-40 print:hidden"
      >
        <div>
          <div className="flex items-center gap-3 pb-5 border-b border-[#E5DDD0]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2e4b7a] p-1.5 shadow-xs">
              <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true">
                <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#f2c14e" />
                <path d="M25 11.5v5" stroke="#f2c14e" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M9.5 27V17l13 10V17" fill="none" stroke="#fffdf9" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[#14233a] block leading-none">
                n<span className="text-[#4a70a9]">Course</span>
              </span>
              <span className="mt-1 inline-block rounded-full bg-[#EAF0F8] px-2 py-0.5 text-[10px] font-bold text-[#224477]">
                Portal Tentor
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-[#2e4b7a] text-white font-bold shadow-xs"
                      : "text-[#434750] font-semibold hover:bg-[#F7F4EF] hover:text-[#14233a]"
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#E5DDD0] pt-4">
          <button
            type="button"
            onClick={askLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 text-[#b91c1c] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] rounded-xl transition-colors font-bold text-sm w-full text-left cursor-pointer"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow md:ml-64 flex flex-col min-h-screen relative z-10 pb-24 md:pb-10 print:ml-0 print:pt-0 print:pb-0">
        {/* Mobile Top Header */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-2.5 bg-[#F7F4EF] border-b border-[#E5DDD0] print:hidden">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#E5DDD0] text-[#14233a] hover:bg-[#EAF0F8] active:scale-95 transition-all"
            >
              <Menu size={18} />
            </button>
            <Link href="/app/tentor/dashboard" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2e4b7a] p-1.5 shadow-xs">
                <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true">
                  <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#f2c14e" />
                  <path d="M25 11.5v5" stroke="#f2c14e" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M9.5 27V17l13 10V17" fill="none" stroke="#fffdf9" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-base font-extrabold tracking-tight text-[#14233a]">
                n<span className="text-[#4a70a9]">Course</span>
              </span>
              <span className="rounded-full bg-[#EAF0F8] border border-[#B8CDE4] px-2 py-0.5 text-[10px] font-bold text-[#224477]">
                Tentor
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/app/tentor/profil"
              aria-label="Profil Tentor"
              className="w-8 h-8 rounded-full bg-white border border-[#E5DDD0] flex items-center justify-center text-[#14233a] hover:border-[#4a70a9]"
            >
              <User size={15} />
            </Link>
            <button
              type="button"
              onClick={askLogout}
              aria-label="Keluar dari akun"
              title="Keluar dari akun"
              className="w-8 h-8 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#B91C1C] hover:bg-[#FEE2E2] active:scale-95 transition-all cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        <div className="w-full flex-grow flex flex-col">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Navigasi Bawah Tentor"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 items-center px-2 bg-white border-t border-[#E5DDD0] shadow-[0_-4px_16px_rgba(20,35,58,0.06)] pb-[env(safe-area-inset-bottom)] h-[calc(62px+env(safe-area-inset-bottom))] print:hidden"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-[#2e4b7a] font-bold" : "text-[#535761] font-medium hover:text-[#14233a]"
              }`}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-[#EAF0F8] text-[#2e4b7a]" : "bg-transparent"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              <span className="text-[10px] leading-tight">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-0 z-50 md:hidden print:hidden ${mobileNavOpen ? "" : "pointer-events-none"}`}>
        <div
          aria-hidden
          onClick={() => setMobileNavOpen(false)}
          className={`absolute inset-0 bg-[#14233a]/40 transition-opacity duration-200 ${
            mobileNavOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi tentor"
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-white border-r border-[#E5DDD0] shadow-xl flex flex-col justify-between p-5 transition-transform duration-200 ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E5DDD0]">
              <div>
                <span className="text-lg font-extrabold text-[#14233a] block leading-none">
                  n<span className="text-[#4a70a9]">Course</span>
                </span>
                <span className="text-xs font-semibold text-[#535761] mt-1 block">
                  Portal Tentor
                </span>
              </div>
              <button
                type="button"
                aria-label="Tutup menu navigasi"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-[#535761] hover:bg-[#F7F4EF] hover:text-[#14233a]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive
                        ? "bg-[#2e4b7a] text-white font-bold"
                        : "text-[#434750] font-semibold hover:bg-[#F7F4EF]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E5DDD0] pt-4">
            <button
              type="button"
              onClick={askLogout}
              className="flex items-center gap-3 px-3.5 py-2.5 text-[#b91c1c] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] rounded-xl font-bold text-sm w-full text-left cursor-pointer"
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </div>
        </aside>
      </div>

      {logoutDialog}
    </div>
  );
}

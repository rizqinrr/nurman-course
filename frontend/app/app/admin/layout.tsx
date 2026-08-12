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
  Calendar,
  Menu,
  X
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { askLogout, logoutDialog } = useLogout();
  const [waitingCount, setWaitingCount] = useState(0);
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
      <main className="flex-grow md:ml-64 flex flex-col min-h-screen relative z-10 pb-6 md:pb-8 print:ml-0 print:pt-0 print:pb-0">
        {/* Mobile TopBar: hamburger + brand */}
        <div className="md:hidden sticky z-40 flex items-center justify-between gap-3 px-4 py-2.5 bg-white/75 backdrop-blur-xl border-b border-white/60 top-0 print:hidden">
          <button
            type="button"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#4a70a9]/10 border border-[#4a70a9]/15 text-[#4a70a9] hover:bg-[#4a70a9]/20 active:scale-95 transition-all shrink-0"
          >
            <Menu size={22} />
          </button>
          <span className="text-[15px] font-extrabold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
            Nurman Course
          </span>
          <span className="rounded-full bg-[#4a70a9]/10 border border-[#4a70a9]/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#4a70a9] shrink-0">
            Admin
          </span>
        </div>

        <div className="w-full flex-grow flex flex-col">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden print:hidden ${mobileNavOpen ? "" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          aria-hidden
          onClick={() => setMobileNavOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileNavOpen ? "opacity-100" : "opacity-0"}`}
        />
        {/* Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi admin"
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-white/95 backdrop-blur-2xl border-r border-white/60 shadow-2xl flex flex-col gap-4 p-4 pt-5 transition-transform duration-300 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent">
                Nurman Course
              </h1>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                Admin Portal
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
            {mobileNavLinks.map((link) => {
              const Icon = link.icon;
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
        </aside>
      </div>

      {logoutDialog}
    </div>
  );
}

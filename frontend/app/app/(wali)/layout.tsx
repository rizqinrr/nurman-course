/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-app-bg text-app-text-mid font-dm flex flex-col md:flex-row relative">

      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-app-border shadow-sm flex-col gap-6 p-6 bg-app-surface z-50 pt-16">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-app-border bg-[#2e4b7a]">
              <Image src="/Nlogo.png" alt="Logo Nurman Course" width={500} height={500} priority className="h-10 w-10 rounded-full object-cover" />
            </div>
            <h1 className="text-2xl font-normal text-app-text font-playfair">
              Nurman <span className="italic text-app-primary">Course</span>
            </h1>
          </div>
          <p className="text-xs font-semibold text-app-text-muted uppercase tracking-wider mt-1">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-[6px] transition-colors duration-200 ${
                  isActive
                    ? "bg-app-primary text-app-white font-semibold shadow-sm"
                    : "text-app-text-mid hover:bg-app-white hover:text-app-text active:scale-[0.98]"
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

        <div className="border-t border-app-border/40 pt-4 flex flex-col gap-1">
          <Link
            href="/app/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-[6px] transition-colors duration-200 ${
              pathname === "/app/profile"
                ? "bg-app-primary text-app-white font-semibold shadow-sm"
                : "text-app-text-mid hover:bg-app-white hover:text-app-text active:scale-[0.98]"
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
        <div className="md:hidden sticky z-40 flex items-center justify-between gap-2 px-4 py-2 bg-app-surface/95 backdrop-blur-sm border-b border-app-border top-0">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-app-border bg-[#2e4b7a]">
              <Image src="/Nlogo.png" alt="Logo Nurman Course" width={500} height={500} priority className="h-7 w-7 rounded-full object-cover" />
            </span>
            <span className="text-base font-normal text-app-text font-playfair">
              Nurman <span className="italic text-app-primary">Course</span>
            </span>
          </span>
          <Link
            href="/app/profile"
            className="w-10 h-10 rounded-[6px] bg-app-white border border-app-border flex items-center justify-center text-app-primary hover:bg-app-surface active:scale-95 transition-all"
          >
            <User size={20} />
          </Link>
        </div>

        <div className="w-full flex-grow flex flex-col">
          {children}
        </div>
      </main>

      {/* Mobile BottomNavBar (Dashboard in center, raised 3D effect, icons only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 bg-app-surface border-t border-app-border shadow-sm rounded-t-2xl pb-[env(safe-area-inset-bottom)] h-[calc(52px+env(safe-area-inset-bottom))]">
        {mobileNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          
          if (link.isCenter) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 -translate-y-4 shadow-sm border-2 active:scale-95 ${
                  isActive
                    ? "bg-app-primary border-app-white text-app-white"
                    : "bg-app-white border-app-border text-app-primary hover:bg-app-surface"
                }`}
              >
                <Icon size={24} />
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center justify-center w-12 h-10 rounded-[6px] transition-all duration-150 active:scale-90 ${
                isActive
                  ? "text-app-primary bg-app-primary/10"
                  : "text-app-text-muted hover:text-app-text"
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

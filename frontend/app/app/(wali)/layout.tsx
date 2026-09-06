/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  Home,
  GraduationCap,
  CalendarDays,
  Receipt,
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
      label: "Beranda",
      href: "/app/dashboard",
      icon: Home,
    },
    {
      label: "Program",
      href: "/app/program",
      icon: GraduationCap,
    },
    {
      label: "Jadwal",
      href: "/app/jadwal",
      icon: CalendarDays,
    },
    {
      label: "Tagihan",
      href: "/app/tagihan",
      icon: Receipt,
    },
    {
      label: "Laporan",
      href: "/app/laporan",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0ECE1] text-app-text-mid font-dm flex justify-center selection:bg-[#4a70a9]/20">
      {/* Mobile Frame Container (Max-W-MD, Centered on Desktop) */}
      <div className="w-full max-w-md min-h-screen bg-[#F7F4EF] flex flex-col relative shadow-2xl border-x border-[#E5DDD0]/60">
        {/* TopBar: Universal (Brand + Profile) */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm border-b border-[#E5DDD0] shadow-sm">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#E5DDD0] bg-[#2e4b7a]">
              <Image src="/Nlogo.png" alt="Logo Nurman Course" width={500} height={500} priority className="h-7 w-7 rounded-full object-cover" />
            </span>
            <span className="text-base font-normal text-app-text font-playfair tracking-tight">
              Nurman <span className="italic text-app-primary">Course</span>
            </span>
          </span>
          <Link
            href="/app/profile"
            aria-label="Buka Profil"
            className="w-9 h-9 rounded-full bg-[#F5F2FF] border border-[#E5DDD0] flex items-center justify-center text-app-primary hover:bg-[#EAF0F8] active:scale-95 transition-all shadow-xs"
          >
            <User size={18} />
          </Link>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-grow flex flex-col min-h-[calc(100vh-120px)] relative z-10 pb-20">
          <div className="w-full flex-grow flex flex-col">
            {children}
          </div>
        </main>

        {/* BottomNavBar: 100% Stitch Mobile Style (Centered inside Max-W-MD frame) */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-[#E5DDD0]/90 shadow-[0_-4px_12px_rgba(26,26,46,0.06)] flex justify-around items-center py-2 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors duration-150 active:scale-95 ${
                  isActive
                    ? "text-[#30578f] font-semibold"
                    : "text-[#737781] hover:text-[#30578f]"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? "font-bold text-[#30578f]" : "font-normal text-[#737781]"}`}>
                  {link.label}
                </span>
                {link.href === "/app/tagihan" && unpaidCount > 0 && (
                  <span className="absolute -top-0.5 right-1 inline-flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none ring-2 ring-white">
                    {unpaidCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

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
  X,
  ChevronRight,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navGroups = [
  {
    label: "Overview",
    links: [{ label: "Dashboard", href: "/app/admin", icon: LayoutDashboard }],
  },
  {
    label: "Kelola layanan",
    links: [
      { label: "Program", href: "/app/admin/program", icon: BookOpen },
      { label: "Roadmap", href: "/app/admin/roadmap", icon: Map },
    ],
  },
  {
    label: "Orang & delivery",
    links: [
      { label: "Tentor", href: "/app/admin/tentor", icon: Users },
      { label: "Murid", href: "/app/admin/murid", icon: UserRound },
      { label: "Enrollment", href: "/app/admin/enrollment", icon: ClipboardList },
      { label: "Jadwal", href: "/app/admin/jadwal", icon: Calendar },
    ],
  },
  {
    label: "Keuangan",
    links: [
      { label: "Tagihan", href: "/app/admin/tagihan", icon: Receipt },
      { label: "Rekening", href: "/app/admin/rekening", icon: Landmark },
    ],
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { askLogout, logoutDialog } = useLogout();
  const [waitingCount, setWaitingCount] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ user: { name: string } }>("/api/users/me")
      .then((res) => {
        if (!cancelled) setAdminName(res.user?.name || "Admin");
      })
      .catch(() => {
        if (!cancelled) setAdminName("Admin");
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const isActive = (href: string) => href === "/app/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="admin-portal min-h-screen bg-[#eef3f8] text-[#14233a] selection:bg-[#4a70a9]/20 print:bg-white print:text-black">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17.5rem] flex-col bg-[#101f36] text-white lg:flex print:hidden">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/app/admin" className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101f36]">
            <span className="text-lg font-black tracking-[-0.04em]">nurman<span className="text-[#f2c14e]">course</span></span>
            <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#aebdd1]">Admin command center</span>
          </Link>
        </div>

        <nav aria-label="Navigasi admin" className="flex-1 overflow-y-auto px-4 py-5">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-6 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7e91ad]">{group.label}</p>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e] ${active ? "bg-[#4a70a9] text-white" : "text-[#b8c5d6] hover:bg-white/10 hover:text-white"}`}
                    >
                      <Icon size={17} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
                      <span>{link.label}</span>
                      {link.href === "/app/admin/tagihan" && waitingCount > 0 && (
                        <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-md bg-[#f2c14e] px-1.5 py-0.5 text-[10px] font-black text-[#14233a]">{waitingCount}</span>
                      )}
                      {active && <ChevronRight size={15} className="ml-auto text-white/70" aria-hidden="true" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <Link href="/app" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#b8c5d6] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]">
            <UserCheck size={17} aria-hidden="true" />
            <span>Pilih portal</span>
          </Link>
          <button type="button" onClick={askLogout} className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-[#f1a7a7] transition-colors hover:bg-red-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]">
            <LogOut size={17} aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[17.5rem] print:pl-0">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-[#d4dfeb] bg-[#eef3f8]/95 px-4 backdrop-blur-md sm:px-6 lg:px-10 print:hidden">
          <button type="button" aria-label="Buka menu navigasi admin" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#c7d4e2] bg-white text-[#284970] transition-colors hover:border-[#4a70a9] hover:text-[#4a70a9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9] lg:hidden">
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="hidden items-center gap-2 text-xs font-bold text-[#657991] lg:flex">
            <span className="h-2 w-2 rounded-full bg-[#3fa66b]" aria-hidden="true" />
            Operasional aktif
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-[#657991] sm:inline">Ruang kerja admin</span>
            <Link href="/app/profile" aria-label={`Buka profil ${adminName}`} className="grid h-9 w-9 place-items-center rounded-full bg-[#dbe7f3] text-xs font-black text-[#284970] transition-colors hover:bg-[#cbdced] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]">{adminName.slice(0, 1).toUpperCase()}</Link>
          </div>
        </header>
        <div className="w-full">{children}</div>
      </main>

      <div className={`fixed inset-0 z-50 lg:hidden ${mobileNavOpen ? "" : "pointer-events-none"}`}>
        <button type="button" aria-label="Tutup menu navigasi" onClick={() => setMobileNavOpen(false)} className={`absolute inset-0 h-full w-full bg-[#081426]/60 transition-opacity ${mobileNavOpen ? "opacity-100" : "opacity-0"}`} />
        <aside role="dialog" aria-modal="true" aria-label="Menu navigasi admin" className={`absolute inset-y-0 left-0 flex w-[min(21rem,88vw)] flex-col bg-[#101f36] text-white shadow-2xl transition-transform ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-start justify-between border-b border-white/10 px-5 py-5">
            <div>
              <span className="text-lg font-black tracking-[-0.04em]">nurman<span className="text-[#f2c14e]">course</span></span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#aebdd1]">Admin command center</span>
            </div>
            <button type="button" aria-label="Tutup menu navigasi" onClick={() => setMobileNavOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-[#b8c5d6] hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"><X size={20} aria-hidden="true" /></button>
          </div>
          <nav aria-label="Navigasi admin mobile" className="flex-1 overflow-y-auto px-4 py-5">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-6">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7e91ad]">{group.label}</p>
                <div className="space-y-1">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return <Link key={link.href} href={link.href} onClick={() => setMobileNavOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold ${active ? "bg-[#4a70a9] text-white" : "text-[#b8c5d6] hover:bg-white/10 hover:text-white"}`}><Icon size={17} aria-hidden="true" /><span>{link.label}</span>{link.href === "/app/admin/tagihan" && waitingCount > 0 && <span className="ml-auto rounded-md bg-[#f2c14e] px-1.5 py-0.5 text-[10px] font-black text-[#14233a]">{waitingCount}</span>}</Link>;
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="border-t border-white/10 px-4 py-4">
            <Link href="/app" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#b8c5d6] hover:bg-white/10 hover:text-white"><UserCheck size={17} aria-hidden="true" /><span>Pilih portal</span></Link>
            <button type="button" onClick={askLogout} className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-[#f1a7a7] hover:bg-red-400/10 hover:text-white"><LogOut size={17} aria-hidden="true" /><span>Keluar</span></button>
          </div>
        </aside>
      </div>
      {logoutDialog}
    </div>
  );
}

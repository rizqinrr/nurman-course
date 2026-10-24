"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Home,
  LayoutDashboard,
  MapPin,
  Menu,
  MessageCircle,
  Route,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-learn-display" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-learn-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-learn-mono" });

export default function ContentShell({ children }: { children: React.ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<"program" | "layanan" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProgramOpen, setMobileProgramOpen] = useState(false);
  const [mobileLayananOpen, setMobileLayananOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Halo nCourse, saya ingin tanya info program belajar dan materi mandiri."
  )}`;

  return (
    <div className={`learn-shell ${display.variable} ${body.variable} ${mono.variable} min-h-screen text-[#102d2b] selection:bg-[#f58a3d]/30`}>
      <header className="sticky top-0 z-50 bg-[#fffdf9] border-b border-[#d9d2c2]">
        <div
          ref={navRef}
          className="mx-auto flex h-16 max-w-[1140px] items-center justify-between gap-4 px-4 sm:px-6"
        >
          {/* Logo Brand -> Halaman Utama (/) */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9] shrink-0"
            title="Kembali ke Halaman Utama nCourse"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2e4b7a] p-1.5 shadow-xs transition-transform group-hover:scale-105">
              <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true">
                <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#f2c14e" />
                <path d="M25 11.5v5" stroke="#f2c14e" strokeWidth="1.6" strokeLinecap="round" />
                <path
                  d="M9.5 27V17l13 10V17"
                  fill="none"
                  stroke="#fffdf9"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight text-[#14233a]">
              n<span className="text-[#4a70a9]">Course</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Navigasi materi" className="hidden lg:flex items-center gap-1 text-sm font-semibold text-[#50647a]">
            {/* 1. Dropdown Program Belajar */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("program")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "program" ? null : "program")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-semibold ${
                  activeDropdown === "program" ? "bg-[#eae4d3] text-[#14233a]" : "hover:bg-[#f7f5ef] hover:text-[#14233a]"
                }`}
                aria-expanded={activeDropdown === "program"}
              >
                <span>Program Belajar</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "program" ? "rotate-180 text-[#2e4b7a]" : "text-[#7a8a9e]"
                  }`}
                />
              </button>

              {activeDropdown === "program" && (
                <div className="absolute top-full left-0 pt-2 w-80 animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="bg-[#fffdf9] border-2 border-[#d9d2c2] rounded-2xl p-2.5 shadow-[0_12px_28px_rgba(20,35,58,0.12)]">
                    <div className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#7a8a9e]">
                      3 Jalur Belajar nCourse
                    </div>

                    <Link
                      href="/materi"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f7f5ef] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#eaf0f9] text-[#2e4b7a] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#2e4b7a] group-hover:text-white transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14233a] text-sm group-hover:text-[#2e4b7a] transition-colors">
                          Belajar Mandiri
                        </div>
                        <div className="text-xs text-[#6a7d94] mt-0.5 leading-snug">
                          Artikel modul &amp; praktik mandiri coding/web
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/course/materi"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f7f5ef] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#eaf0f9] text-[#2e4b7a] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#2e4b7a] group-hover:text-white transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14233a] text-sm group-hover:text-[#2e4b7a] transition-colors">
                          Kelas Bimbingan
                        </div>
                        <div className="text-xs text-[#6a7d94] mt-0.5 leading-snug">
                          Materi &amp; proyek (Privat / Grup Kecil)
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/course/program"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f7f5ef] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#fef3c7] text-[#92400e] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#f2c14e] group-hover:text-[#493b12] transition-colors">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14233a] text-sm group-hover:text-[#2e4b7a] transition-colors">
                          Les Privat Guru ke Rumah
                        </div>
                        <div className="text-xs text-[#6a7d94] mt-0.5 leading-snug">
                          Calistung, Ngaji &amp; Mapel SD–SMP
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Dropdown Layanan & Area */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("layanan")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "layanan" ? null : "layanan")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-semibold ${
                  activeDropdown === "layanan" ? "bg-[#eae4d3] text-[#14233a]" : "hover:bg-[#f7f5ef] hover:text-[#14233a]"
                }`}
                aria-expanded={activeDropdown === "layanan"}
              >
                <span>Layanan &amp; Area</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "layanan" ? "rotate-180 text-[#2e4b7a]" : "text-[#7a8a9e]"
                  }`}
                />
              </button>

              {activeDropdown === "layanan" && (
                <div className="absolute top-full left-0 pt-2 w-80 animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="bg-[#fffdf9] border-2 border-[#d9d2c2] rounded-2xl p-2.5 shadow-[0_12px_28px_rgba(20,35,58,0.12)]">
                    <div className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#7a8a9e]">
                      Jangkauan &amp; Estimasi Biaya
                    </div>

                    <Link
                      href="/jangkauan"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f7f5ef] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#15803d] group-hover:text-white transition-colors">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14233a] text-sm group-hover:text-[#2e4b7a] transition-colors flex items-center gap-1.5">
                          <span>Peta Jangkauan Les</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]"></span>
                        </div>
                        <div className="text-xs text-[#6a7d94] mt-0.5 leading-snug">
                          Cek jangkauan tentor di Cilacap &amp; sekitar
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/cek-rute"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f7f5ef] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#eaf0f9] text-[#2e4b7a] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#2e4b7a] group-hover:text-white transition-colors">
                        <Route className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14233a] text-sm group-hover:text-[#2e4b7a] transition-colors">
                          Cek Rute &amp; Biaya Transport
                        </div>
                        <div className="text-xs text-[#6a7d94] mt-0.5 leading-snug">
                          Kalkulator tarif &amp; jarak riil jalan
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-[#d9d2c2] mx-1" aria-hidden="true" />

            {/* Menu Materi Existing (Dipertahankan) */}
            <Link
              href="/materi"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#2e4b7a] transition-colors hover:bg-[#f7f5ef]"
            >
              <BookOpen size={15} aria-hidden="true" />
              <span>Katalog</span>
            </Link>
            <Link
              href="/jalur-belajar"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#50647a] transition-colors hover:bg-[#f7f5ef] hover:text-[#14233a]"
            >
              <Route size={15} aria-hidden="true" />
              <span>Jalur belajar</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Koleksi Saya */}
            <Link
              href="/app/materi"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-[#d9d2c2] bg-[#fffdf9] px-2.5 sm:px-3 text-xs sm:text-sm font-bold text-[#14233a] shadow-xs transition-colors hover:border-[#4a70a9] hover:bg-[#f7f5ef]"
            >
              <UserRound size={15} className="text-[#2e4b7a]" aria-hidden="true" />
              <span className="hidden sm:inline">Koleksi saya</span>
            </Link>

            {/* Portal Siswa */}
            <Link
              href="/app/dashboard"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#2e4b7a] px-3 sm:px-3.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#22395e]"
            >
              <LayoutDashboard size={15} aria-hidden="true" />
              <span>Portal Siswa</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-[#d9d2c2] bg-[#fffdf9] text-[#14233a] hover:bg-[#f7f5ef] transition-colors"
              aria-label="Buka menu navigasi materi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#d9d2c2] bg-[#fffdf9] px-4 py-3 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
            {/* Quick links */}
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#d9d2c2]/70">
              <Link
                href="/materi"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#eaf0f9] text-xs font-bold text-[#2e4b7a]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Katalog Materi</span>
              </Link>
              <Link
                href="/jalur-belajar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2 rounded-xl border border-[#d9d2c2] text-xs font-bold text-[#50647a]"
              >
                <Route className="w-3.5 h-3.5 text-[#2e4b7a]" />
                <span>Jalur Belajar</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#d9d2c2]/70">
              <Link
                href="/app/materi"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2 rounded-xl border border-[#d9d2c2] text-xs font-bold text-[#50647a]"
              >
                <UserRound className="w-3.5 h-3.5 text-[#2e4b7a]" />
                <span>Koleksi Saya</span>
              </Link>
              <Link
                href="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#2e4b7a] text-xs font-bold text-white"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Portal Siswa</span>
              </Link>
            </div>

            {/* Mobile Section 1: Program Belajar */}
            <div className="border border-[#d9d2c2] rounded-xl overflow-hidden bg-[#f7f5ef]">
              <button
                type="button"
                onClick={() => setMobileProgramOpen(!mobileProgramOpen)}
                className="w-full flex items-center justify-between p-2.5 text-xs font-bold text-[#14233a]"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#2e4b7a]" />
                  Program Belajar nCourse
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${mobileProgramOpen ? "rotate-180 text-[#2e4b7a]" : "text-[#7a8a9e]"}`}
                />
              </button>
              {mobileProgramOpen && (
                <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-[#d9d2c2]/60 bg-[#fffdf9]">
                  <Link
                    href="/materi"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#2e4b7a]" />
                    <span>Belajar Mandiri (Materi Online)</span>
                  </Link>
                  <Link
                    href="/course/materi"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#2e4b7a]" />
                    <span>Kelas Bimbingan (Materi &amp; Proyek)</span>
                  </Link>
                  <Link
                    href="/course/program"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                  >
                    <Home className="w-3.5 h-3.5 text-[#92400e]" />
                    <span>Les Privat Guru ke Rumah</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Section 2: Layanan & Area */}
            <div className="border border-[#d9d2c2] rounded-xl overflow-hidden bg-[#f7f5ef]">
              <button
                type="button"
                onClick={() => setMobileLayananOpen(!mobileLayananOpen)}
                className="w-full flex items-center justify-between p-2.5 text-xs font-bold text-[#14233a]"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#15803d]" />
                  Layanan &amp; Area
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${mobileLayananOpen ? "rotate-180 text-[#15803d]" : "text-[#7a8a9e]"}`}
                />
              </button>
              {mobileLayananOpen && (
                <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-[#d9d2c2]/60 bg-[#fffdf9]">
                  <Link
                    href="/jangkauan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Peta Jangkauan Les</span>
                  </Link>
                  <Link
                    href="/cek-rute"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                  >
                    <Route className="w-3.5 h-3.5 text-[#2e4b7a]" />
                    <span>Cek Rute &amp; Biaya Transport</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-1">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] py-2 text-xs font-extrabold text-white shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Konsultasi Belajar via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t border-[#d9d2c2] bg-[#14233a] px-4 py-8 text-[#dbe7f3] sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">nCourse Belajar Mandiri</p>
            <p className="text-xs text-[#8ea2be] mt-0.5">Belajar pelan-pelan. Bikin sesuatu nyata.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <Link href="/" className="font-bold text-[#dbe7f3] hover:text-white transition-colors">
              Halaman Utama
            </Link>
            <Link href="/app/dashboard" className="font-bold text-[#dbe7f3] hover:text-white transition-colors">
              Portal Siswa
            </Link>
            <Link href="/materi" className="inline-flex items-center gap-1.5 font-bold text-[#f2c14e] hover:underline">
              <span>Semua materi</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function CompletionMark({ done }: { done: boolean }) {
  return (
    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${done ? "border-[#d8662e] bg-[#d8662e] text-white" : "border-[#9abaae] text-transparent"}`}>
      <Check size={15} strokeWidth={3} aria-hidden="true" />
    </span>
  );
}

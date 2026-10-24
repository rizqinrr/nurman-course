"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Compass,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Route,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function Landing2Nav() {
  const [activeDropdown, setActiveDropdown] = useState<"program" | "layanan" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProgramOpen, setMobileProgramOpen] = useState(false);
  const [mobileLayananOpen, setMobileLayananOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
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
    "Halo nCourse, saya ingin tanya info program belajar dan les privat."
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-[#fffdf9] border-b border-[#d9d2c2]">
      <div
        ref={navRef}
        className="max-w-[1140px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-[#14233a] tracking-tight shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#2e4b7a] flex items-center justify-center p-1.5 shadow-xs">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <rect width="32" height="32" rx="7" fill="#2e4b7a" />
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
          <span className="font-display font-extrabold text-[#14233a]">
            n<span className="text-[#4a70a9]">Course</span>
          </span>
        </Link>

        {/* Desktop Navigation Links with Dropdowns */}
        <nav
          className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#50647a]"
          aria-label="Navigasi Utama"
        >
          {/* Dropdown 1: Program Belajar */}
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

            {/* Dropdown Menu 1 */}
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
                        Artikel modul & praktik mandiri bikin website/coding
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
                        Bimbingan materi & proyek (Privat atau Grup Kecil)
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
                        Calistung, Ngaji & Mapel SD–SMP dengan laporan harian
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown 2: Layanan & Area */}
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

            {/* Dropdown Menu 2 */}
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
                        Cek zona wilayah tentor di Cilacap &amp; sekitarnya
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
                        Kalkulator jarak riil jalan &amp; tarif transparan
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Standalone Link: Tanya Jawab */}
          <a
            href="#faq"
            className="px-3 py-2 rounded-lg hover:bg-[#f7f5ef] hover:text-[#14233a] transition-colors"
          >
            Tanya Jawab
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/login"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-[#d9d2c2] bg-[#fffdf9] px-2.5 sm:px-3 text-xs sm:text-sm font-bold text-[#14233a] shadow-xs transition-colors hover:border-[#4a70a9] hover:bg-[#f7f5ef]"
          >
            <span>Masuk</span>
          </Link>
          <Link
            href="/course/program"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#2e4b7a] px-3 sm:px-3.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#22395e]"
          >
            <span>Mulai Belajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-[#d9d2c2] bg-[#fffdf9] text-[#14233a] hover:bg-[#f7f5ef] transition-colors"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#d9d2c2] bg-[#fffdf9] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Section 1: Program Belajar */}
          <div className="border border-[#d9d2c2] rounded-xl overflow-hidden bg-[#f7f5ef]">
            <button
              type="button"
              onClick={() => setMobileProgramOpen(!mobileProgramOpen)}
              className="w-full flex items-center justify-between p-3 text-sm font-bold text-[#14233a]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2e4b7a]" />
                Program Belajar
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileProgramOpen ? "rotate-180 text-[#2e4b7a]" : "text-[#7a8a9e]"}`}
              />
            </button>
            {mobileProgramOpen && (
              <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-[#d9d2c2]/60 bg-[#fffdf9]">
                <Link
                  href="/materi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#2e4b7a]" />
                  <span>Belajar Mandiri (Materi Online)</span>
                </Link>
                <Link
                  href="/course/materi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                >
                  <Users className="w-3.5 h-3.5 text-[#2e4b7a]" />
                  <span>Kelas Bimbingan (Materi &amp; Proyek)</span>
                </Link>
                <Link
                  href="/course/program"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                >
                  <Home className="w-3.5 h-3.5 text-[#92400e]" />
                  <span>Les Privat (Calistung, Ngaji, SD–SMP)</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Section 2: Layanan & Area */}
          <div className="border border-[#d9d2c2] rounded-xl overflow-hidden bg-[#f7f5ef]">
            <button
              type="button"
              onClick={() => setMobileLayananOpen(!mobileLayananOpen)}
              className="w-full flex items-center justify-between p-3 text-sm font-bold text-[#14233a]"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#15803d]" />
                Layanan &amp; Area
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileLayananOpen ? "rotate-180 text-[#15803d]" : "text-[#7a8a9e]"}`}
              />
            </button>
            {mobileLayananOpen && (
              <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-[#d9d2c2]/60 bg-[#fffdf9]">
                <Link
                  href="/jangkauan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                >
                  <Compass className="w-3.5 h-3.5 text-[#15803d]" />
                  <span>Peta Jangkauan Les</span>
                </Link>
                <Link
                  href="/cek-rute"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-[#14233a] hover:bg-[#f7f5ef]"
                >
                  <Route className="w-3.5 h-3.5 text-[#2e4b7a]" />
                  <span>Cek Rute &amp; Biaya Transport</span>
                </Link>
              </div>
            )}
          </div>

          {/* Tanya Jawab & Hubungi WA */}
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 text-center text-sm font-bold text-[#50647a] hover:text-[#14233a] hover:bg-[#f7f5ef] rounded-xl"
            >
              Tanya Jawab (FAQ)
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] py-2.5 text-sm font-extrabold text-white shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tanya Customer Care via WA</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Landing2Nav() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#d3dddf]">
      <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/landing2" className="flex items-center gap-2.5 font-bold text-lg text-[#243c4c] tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-[#243c4c] flex items-center justify-center p-1.5 shadow-sm">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <rect width="32" height="32" rx="7" fill="#243C4C" />
              <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#ACBCBF" />
              <path d="M25 11.5v5" stroke="#ACBCBF" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M9.5 27V17l13 10V17" fill="none" stroke="#F7F9F8" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <span>Nurman Course</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5c7787]" aria-label="Navigasi Utama">
          <a href="#kelas" className="hover:text-[#243c4c] transition-colors">
            Kelas Mandiri
          </a>
          <a href="#les" className="hover:text-[#243c4c] transition-colors">
            Les Privat
          </a>
          <a href="#jalur" className="hover:text-[#243c4c] transition-colors">
            Jalur Belajar
          </a>
          <a href="#faq" className="hover:text-[#243c4c] transition-colors">
            Tanya Jawab
          </a>
          <Link href="/materi" className="hover:text-[#243c4c] transition-colors">
            Katalog Materi
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-[#5c7787] hover:text-[#243c4c] px-3 py-1.5 transition-colors"
          >
            Masuk
          </Link>
          <a
            href="/course/config"
            className="px-4 sm:px-5 py-2 rounded-full bg-[#3f7499] hover:bg-[#243c4c] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Mulai Belajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

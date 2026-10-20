"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Landing2Nav() {
  return (
    <header className="sticky top-0 z-40 bg-[#fffdf9]/90 backdrop-blur-md border-b border-[#d9d2c2]">
      <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/landing2" className="flex items-center gap-2.5 font-bold text-lg text-[#14233a] tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-[#2e4b7a] flex items-center justify-center p-1.5 shadow-sm">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <rect width="32" height="32" rx="7" fill="#2e4b7a" />
              <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#f2c14e" />
              <path d="M25 11.5v5" stroke="#f2c14e" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M9.5 27V17l13 10V17" fill="none" stroke="#fffdf9" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display font-extrabold text-[#14233a]">Nurman Course</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#50647a]" aria-label="Navigasi Utama">
          <a href="#kelas" className="hover:text-[#4a70a9] transition-colors">
            Kelas Mandiri
          </a>
          <a href="#les" className="hover:text-[#4a70a9] transition-colors">
            Les Privat
          </a>
          <Link href="/jangkauan" className="hover:text-[#4a70a9] transition-colors flex items-center gap-1 text-[#2e4b7a] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Peta Jangkauan
          </Link>
          <Link href="/cek-rute" className="hover:text-[#4a70a9] transition-colors text-[#2e4b7a] font-bold">
            Cek Rute & Biaya
          </Link>
          <a href="#jalur" className="hover:text-[#4a70a9] transition-colors">
            Jalur Belajar
          </a>
          <a href="#faq" className="hover:text-[#4a70a9] transition-colors">
            Tanya Jawab
          </a>
          <Link href="/materi" className="hover:text-[#4a70a9] transition-colors">
            Katalog Materi
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-[#50647a] hover:text-[#14233a] px-3 py-1.5 transition-colors"
          >
            Masuk
          </Link>
          <a
            href="/course/config"
            className="px-4 sm:px-5 py-2 rounded-xl bg-[#4a70a9] hover:bg-[#3d6094] text-white text-xs sm:text-sm font-bold shadow-[0_3px_0_#2b4875] transition-all duration-150 active:translate-y-0.5 active:shadow-none inline-flex items-center gap-1.5"
          >
            <span>Mulai Belajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

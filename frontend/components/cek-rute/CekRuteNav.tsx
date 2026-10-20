"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle, Route, X } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function CekRuteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Halo Nurman Course, saya ingin tanya informasi rute dan biaya kunjungan les privat."
  )}`;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#d9d2c2] bg-[#f7f5ef]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Brand Logo */}
        <Link href="/landing2" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#2e4b7a] bg-[#2e4b7a] shadow-[0_4px_0_#14233a] transition-transform group-hover:scale-105">
            <svg
              className="h-6 w-6 text-[#fffdf9]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" fill="#f2c14e" stroke="#2e4b7a" strokeWidth="1" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <span className="font-display text-xl font-extrabold tracking-tight text-[#14233a]">
              Nurman<span className="text-[#4a70a9]">Course</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-[#50647a]">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Kalkulator Rute Jalan
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/landing2"
            className="rounded-lg px-3.5 py-2 text-sm font-bold text-[#50647a] transition-colors hover:bg-[#eae4d3] hover:text-[#14233a]"
          >
            Beranda
          </Link>
          <Link
            href="/course/program"
            className="rounded-lg px-3.5 py-2 text-sm font-bold text-[#50647a] transition-colors hover:bg-[#eae4d3] hover:text-[#14233a]"
          >
            Pilihan Les
          </Link>
          <Link
            href="/jangkauan"
            className="rounded-lg px-3.5 py-2 text-sm font-bold text-[#50647a] transition-colors hover:bg-[#eae4d3] hover:text-[#14233a]"
          >
            Peta Jangkauan
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#4a70a9] bg-[#eaf0f9] px-3.5 py-1.5 text-sm font-extrabold text-[#2e4b7a] shadow-xs">
            <Route className="h-4 w-4 text-[#4a70a9]" />
            Cek Rute & Biaya
          </span>
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9] px-4 py-2 text-sm font-bold text-[#14233a] shadow-[0_2px_0_#d9d2c2] transition hover:-translate-y-0.5 hover:border-[#4a70a9]"
          >
            Masuk Portal
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#166534] bg-[#22c55e] px-4 py-2 text-sm font-extrabold text-white shadow-[0_4px_0_#15803d] transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Tanya via WA
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9] p-2 text-[#14233a] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b-2 border-[#d9d2c2] bg-[#f7f5ef] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/landing2"
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#14233a] hover:bg-[#eae4d3]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/course/program"
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#14233a] hover:bg-[#eae4d3]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pilihan Les Privat
            </Link>
            <Link
              href="/jangkauan"
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#14233a] hover:bg-[#eae4d3]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Peta Jangkauan
            </Link>
            <div className="flex items-center gap-2 rounded-lg bg-[#eaf0f9] px-3 py-2 text-sm font-extrabold text-[#2e4b7a]">
              <Route className="h-4 w-4" />
              Cek Rute & Biaya (Aktif)
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t-2 border-[#d9d2c2] pt-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#22c55e] py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#15803d]"
              >
                <MessageCircle className="h-4 w-4" />
                Konsultasi WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

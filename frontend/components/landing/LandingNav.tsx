"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Cara kerja", href: "#tentang" },
  { label: "Program", href: "#program" },
  { label: "Tutor", href: "#tutor" },
  { label: "Cerita keluarga", href: "#testimoni" },
];

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#b8c9dd] bg-[#edf4fb]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="#beranda" aria-label="Nurman Course, beranda" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2e4b7a] p-1 shadow-[0_8px_20px_rgba(46,75,122,0.18)]">
            <Image src="/Nlogo.png" alt="Logo Nurman Course" width={44} height={44} className="rounded-xl" priority />
          </span>
          <span className="text-lg font-black tracking-[-0.03em] text-[#17345d]">Nurman <span className="text-[#4a70a9]">Course</span></span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => <a key={link.href} href={link.href} className="text-sm font-bold text-[#536781] transition hover:text-[#2e4b7a]">{link.label}</a>)}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#2e4b7a] transition hover:bg-white">Masuk</Link>
          <Link href="/course/program" className="inline-flex items-center gap-2 rounded-xl bg-[#4a70a9] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(74,112,169,0.24)] transition hover:bg-[#3a5a99]">Pilih program <ArrowUpRight size={16} /></Link>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} className="grid h-11 w-11 place-items-center rounded-xl border border-[#b8c9dd] bg-white text-[#2e4b7a] md:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>

      {open && (
        <div className="border-t border-[#b8c9dd] bg-[#edf4fb] px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-[#536781] hover:bg-white">{link.label}</a>)}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl border border-[#b8c9dd] bg-white px-4 py-3 text-center text-sm font-bold text-[#2e4b7a]">Masuk</Link>
              <Link href="/course/program" onClick={() => setOpen(false)} className="rounded-xl bg-[#4a70a9] px-4 py-3 text-center text-sm font-bold text-white">Pilih program</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

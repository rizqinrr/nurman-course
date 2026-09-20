import Link from "next/link";
import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from "next/font/google";
import { ArrowRight, BookOpen, Check, Grid3X3, Route, UserRound } from "lucide-react";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-learn-display" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-learn-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-learn-mono" });

export default function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`learn-shell ${display.variable} ${body.variable} ${mono.variable} min-h-screen text-[#102d2b] selection:bg-[#f58a3d]/30`}>
      <header className="sticky top-0 z-50 border-b border-[#c7d4e2] bg-[#f1f5f8]/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/materi" className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0752d] focus-visible:ring-offset-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#14233a] text-white transition-transform group-hover:-translate-y-0.5"><Grid3X3 size={17} aria-hidden="true" /></span>
            <span className="font-display text-base font-black tracking-[-0.04em] text-[#14233a]">n<span className="text-[#d8662e]">course</span><span className="ml-2 hidden text-[10px] font-bold uppercase tracking-[0.15em] text-[#71849a] sm:inline">Learning desk</span></span>
          </Link>
          <nav aria-label="Navigasi materi" className="flex items-center gap-1 sm:gap-2">
            <Link href="/materi" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#284970] transition-colors hover:bg-[#dbe7f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]"><BookOpen size={16} aria-hidden="true" /><span className="hidden sm:inline">Katalog</span></Link>
            <Link href="/jalur-belajar" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#657991] transition-colors hover:bg-[#dbe7f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]"><Route size={16} aria-hidden="true" /><span className="hidden sm:inline">Jalur belajar</span></Link>
            <Link href="/app/materi" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#c7d4e2] bg-white px-3 text-sm font-bold text-[#284970] transition-colors hover:border-[#4a70a9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]"><UserRound size={16} aria-hidden="true" /><span className="hidden sm:inline">Koleksi saya</span></Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-[#c7d4e2] bg-[#14233a] px-4 py-8 text-[#dbe7f3] sm:px-6 lg:px-10"><div className="mx-auto flex max-w-[90rem] flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-bold">Belajar pelan-pelan. Bikin sesuatu.</p><Link href="/materi" className="inline-flex items-center gap-2 font-bold text-[#f2c14e]">Lihat semua materi <ArrowRight size={15} aria-hidden="true" /></Link></div></footer>
    </div>
  );
}

export function CompletionMark({ done }: { done: boolean }) {
  return <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${done ? "border-[#d8662e] bg-[#d8662e] text-white" : "border-[#9abaae] text-transparent"}`}><Check size={15} strokeWidth={3} aria-hidden="true" /></span>;
}

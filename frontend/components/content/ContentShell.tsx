import Link from "next/link";
import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from "next/font/google";
import { ArrowRight, BookOpen, Check, Grid3X3, Route, Wrench } from "lucide-react";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-learn-display" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-learn-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-learn-mono" });

export default function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`learn-shell ${display.variable} ${body.variable} ${mono.variable} min-h-screen text-[#102d2b] selection:bg-[#f58a3d]/30`}>
      <header className="sticky top-0 z-50 border-b border-[#b7d2c4]/70 bg-[#f5f0e7]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/materi" className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58a3d] focus-visible:ring-offset-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0e4d45] text-[#f5f0e7] shadow-[0_3px_0_#082e2a] transition-transform group-hover:-translate-y-0.5">
              <Grid3X3 size={19} aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-[-0.03em]">Belajar<span className="text-[#f0752d]">.dev</span></span>
          </Link>
          <nav aria-label="Navigasi materi" className="flex items-center gap-1 sm:gap-2">
            <Link href="/materi" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#0e4d45] transition-colors hover:bg-[#dcece2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58a3d]"><BookOpen size={17} aria-hidden="true" /><span className="hidden sm:inline">Katalog</span></Link><Link href="/jalur-belajar" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#55716c] transition-colors hover:bg-[#dcece2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58a3d]"><Route size={17} aria-hidden="true" /><span className="hidden sm:inline">Jalur belajar</span></Link>
            <Link href="/app/materi" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#55716c] transition-colors hover:bg-[#dcece2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58a3d]"><Wrench size={17} aria-hidden="true" /><span className="hidden sm:inline">Koleksi saya</span></Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-[#b7d2c4] bg-[#0e4d45] px-4 py-10 text-[#e7f0e7] sm:px-6 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="font-bold">Belajar pelan-pelan. Bikin sesuatu.</p><Link href="/materi" className="inline-flex items-center gap-2 font-bold text-[#f9b36c]">Lihat semua materi <ArrowRight size={15} /></Link></div></footer>
    </div>
  );
}

export function CompletionMark({ done }: { done: boolean }) {
  return <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${done ? "border-[#f0752d] bg-[#f0752d] text-white" : "border-[#9abaae] text-transparent"}`}><Check size={15} strokeWidth={3} aria-hidden="true" /></span>;
}

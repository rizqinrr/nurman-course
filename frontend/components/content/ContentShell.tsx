import Link from "next/link";
import Image from "next/image";
import { BookOpen, LayoutDashboard } from "lucide-react";

export default function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1a1a18] selection:bg-[#4a70a9]/25">
      <header className="sticky top-0 z-50 border-b border-[#d8d0c3] bg-[#f7f4ef]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/materi" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9] focus-visible:ring-offset-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#294d7e]">
              <Image src="/Nlogo.png" alt="" width={36} height={36} className="h-8 w-8 rounded-full object-cover" />
            </span>
            <span className="font-playfair text-lg tracking-tight">Nurman <em className="text-[#4a70a9]">Course</em></span>
          </Link>
          <nav aria-label="Navigasi materi" className="flex items-center gap-1 sm:gap-2">
            <Link href="/materi" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#294d7e] hover:bg-[#e9eef5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]">
              <BookOpen size={17} aria-hidden="true" />
              <span className="hidden sm:inline">Materi</span>
            </Link>
            <Link href="/app/materi" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#3d3d3a] hover:bg-[#ede8df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]">
              <LayoutDashboard size={17} aria-hidden="true" />
              <span className="hidden sm:inline">Koleksi saya</span>
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

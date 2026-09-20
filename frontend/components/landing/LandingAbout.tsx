"use client";

import { BarChart3, CalendarClock, MessagesSquare, UserCheck, type LucideIcon } from "lucide-react";
import { aboutPoints } from "@/data/landing";

const icons: Record<string, LucideIcon> = { chart: BarChart3, user: UserCheck, calendar: CalendarClock, message: MessagesSquare };

export default function LandingAbout() {
  return (
    <section id="tentang" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-10" aria-label="Tentang Nurman Course">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#14233a] sm:text-5xl">Pendampingan yang mengikuti kecepatan anak.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#627894]">Bukan kelas ramai. Setiap anak didampingi sesuai kebutuhan, dan orang tua tetap terhubung lewat laporan progres berkala.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-[#c4d3e3] bg-white/70 px-4 py-3 text-sm font-bold text-[#355276]"><MessagesSquare size={17} className="text-[#4a70a9]" /> Online &amp; offline</span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-[#c4d3e3] bg-white/70 px-4 py-3 text-sm font-bold text-[#355276]"><CalendarClock size={17} className="text-[#4a70a9]" /> Jadwal fleksibel</span>
          </div>
        </div>
        <div className="divide-y divide-[#c4d3e3] border-y border-[#c4d3e3]">
          {aboutPoints.map((point) => {
            const Icon = icons[point.icon] ?? UserCheck;
            return (
              <div key={point.id} className="flex gap-5 py-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#dbe6f3] text-[#2e4b7a]"><Icon size={21} /></span>
                <div><h3 className="text-lg font-black tracking-[-0.03em] text-[#294568]">{point.title}</h3><p className="mt-1.5 text-sm leading-6 text-[#627894]">{point.description}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

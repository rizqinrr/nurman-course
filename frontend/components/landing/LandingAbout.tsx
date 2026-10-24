"use client";

import { BarChart3, CalendarClock, MessagesSquare, UserCheck, type LucideIcon } from "lucide-react";
import { aboutPoints } from "@/data/landing";

const icons: Record<string, LucideIcon> = { chart: BarChart3, user: UserCheck, calendar: CalendarClock, message: MessagesSquare };

export default function LandingAbout() {
  return (
    <section id="tentang" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-10" aria-label="Tentang nCourse">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-[#14233a] sm:text-5xl">
            Pendampingan yang mengikuti kecepatan anak.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#50647a]">
            Bukan kelas ramai. Setiap anak didampingi sesuai kebutuhan, dan orang tua tetap terhubung lewat laporan progres berkala.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9] px-4 py-2.5 font-mono text-xs font-bold text-[#2e4b7a] shadow-sm">
              <MessagesSquare size={16} className="text-[#4a70a9]" /> Online &amp; offline
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9] px-4 py-2.5 font-mono text-xs font-bold text-[#2e4b7a] shadow-sm">
              <CalendarClock size={16} className="text-[#4a70a9]" /> Jadwal fleksibel
            </span>
          </div>
        </div>
        <div className="divide-y-2 divide-[#d9d2c2] border-y-2 border-[#d9d2c2]">
          {aboutPoints.map((point) => {
            const Icon = icons[point.icon] ?? UserCheck;
            return (
              <div key={point.id} className="flex gap-5 py-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-[#c5d5e5] bg-[#e3eef9] text-[#2e4b7a]">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-black tracking-[-0.02em] text-[#203652]">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#50647a]">{point.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

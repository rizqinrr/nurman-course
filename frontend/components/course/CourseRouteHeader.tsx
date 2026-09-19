"use client";

import { ArrowLeft, Check, MapPinned } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseRouteHeaderProps {
  current: 1 | 2 | 3 | 4;
  title: string;
  subtitle?: string;
}

const steps = ["Arah", "Fokus", "Level", "Jadwal"];

export default function CourseRouteHeader({
  current,
  title,
  subtitle,
}: CourseRouteHeaderProps) {
  const router = useRouter();

  return (
    <header className="mb-7 sm:mb-9">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#aec2da] bg-white/75 px-4 text-sm font-bold text-[#355276] shadow-sm transition hover:border-[#4a70a9] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a70a9]"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Kembali
        </button>
        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#627894]">
          <MapPinned size={16} className="text-[#4a70a9]" aria-hidden="true" />
          Peta belajar
        </span>
      </div>
      <div className="relative mb-6 flex items-center justify-between px-1">
        <div className="absolute left-4 right-4 top-3 h-px bg-[#c4d3e3]" aria-hidden="true" />
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const complete = stepNumber < current;
          const active = stepNumber === current;
          return (
            <div
              key={step}
              aria-current={active ? "step" : undefined}
              className="relative z-10 flex flex-col items-center gap-2 bg-[#edf4fb] px-1 text-center"
            >
              <span className={`grid h-6 w-6 place-items-center rounded-full border text-xs font-black ${complete ? "border-[#4a70a9] bg-[#4a70a9] text-white" : active ? "border-[#f2c14e] bg-[#fff5cb] text-[#5e4b14]" : "border-[#aec2da] bg-[#edf4fb] text-[#8da3bd]"}`}>
                {complete ? <Check size={13} aria-hidden="true" /> : stepNumber}
              </span>
              <span className={`text-xs font-bold sm:text-xs ${active ? "text-[#294568]" : "text-[#8da3bd]"}`}>{step}{complete && <span className="sr-only"> selesai</span>}</span>
            </div>
          );
        })}
      </div>
      <h1 className="max-w-xl text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[#14233a] sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-xl text-base leading-7 text-[#536781] sm:text-lg">{subtitle}</p>}
    </header>
  );
}

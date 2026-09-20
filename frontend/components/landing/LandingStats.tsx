"use client";

import CountUp from "@/components/course/CountUp";
import { landingStats } from "@/data/landing";

export default function LandingStats() {
  return (
    <section className="border-y border-[#b8c9dd] bg-[#2e4b7a] text-white" aria-label="Nurman Course dalam angka">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-10">
        {landingStats.map((stat, index) => (
          <div key={stat.id} className={`py-6 sm:py-8 ${index % 2 === 0 ? "pr-4" : "border-l border-white/20 pl-4"} lg:border-l lg:border-white/20 lg:px-7 ${index === 0 ? "lg:border-l-0 lg:pl-0" : ""}`}>
            <p className="text-3xl font-black tracking-[-0.05em] text-[#f7d976] sm:text-4xl"><CountUp value={stat.value} suffix={stat.suffix ?? ""} /></p>
            <p className="mt-1 text-xs font-bold leading-5 text-[#d9e5f2] sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

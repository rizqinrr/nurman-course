"use client";

import CountUp from "@/components/course/CountUp";
import { landingStats } from "@/data/landing";

export default function LandingStats() {
  return (
    <section className="border-y-2 border-[#1c304f] bg-[#223d68] text-white shadow-inner" aria-label="nCourse dalam angka">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-10">
        {landingStats.map((stat, index) => (
          <div
            key={stat.id}
            className={`py-6 sm:py-8 ${
              index % 2 === 0 ? "pr-4" : "border-l-2 border-white/15 pl-4"
            } lg:border-l-2 lg:border-white/15 lg:px-7 ${
              index === 0 ? "lg:border-l-0 lg:pl-0" : ""
            }`}
          >
            <p className="font-display text-3xl font-black tracking-[-0.04em] text-[#f2c14e] sm:text-4xl">
              <CountUp value={stat.value} suffix={stat.suffix ?? ""} />
            </p>
            <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#d0e0f2] sm:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

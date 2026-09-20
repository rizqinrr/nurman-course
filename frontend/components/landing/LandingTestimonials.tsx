"use client";

import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/landing";

export default function LandingTestimonials() {
  return (
    <section id="testimoni" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-10" aria-label="Testimoni Nurman Course">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#14233a] sm:text-5xl">Cerita keluarga yang sudah berjalan bersama.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#627894]">Cuplikan pengalaman orang tua dan siswa selama belajar di Nurman Course.</p>
        </div>
        <div className="space-y-5">
          {testimonials.map((item, index) => (
            <figure key={item.id} className={`rounded-[1.75rem] border p-6 sm:p-7 ${index === 0 ? "border-[#e3ba4f] bg-[#fff5cb]" : "border-[#c4d3e3] bg-white/75"}`}>
              <Quote size={22} className={index === 0 ? "text-[#806512]" : "text-[#8da3bd]"} aria-hidden="true" />
              <blockquote className="mt-3 text-lg font-semibold leading-8 tracking-[-0.01em] text-[#294568] sm:text-xl">“{item.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center justify-between border-t border-[#c4d3e3] pt-4">
                <span><span className="block text-sm font-black text-[#294568]">{item.name}</span><span className="block text-xs font-semibold text-[#627894]">{item.role}</span></span>
                <span className="flex gap-0.5" aria-label="Rating 5 dari 5">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={14} className="fill-[#f2c14e] text-[#f2c14e]" />)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

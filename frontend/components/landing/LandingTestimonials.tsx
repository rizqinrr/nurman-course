"use client";

import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/landing";

export default function LandingTestimonials() {
  return (
    <section id="testimoni" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-10" aria-label="Testimoni nCourse">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-[#14233a] sm:text-5xl">
            Cerita keluarga yang sudah berjalan bersama.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#50647a]">
            Cuplikan pengalaman orang tua dan siswa selama belajar di nCourse.
          </p>
        </div>
        <div className="space-y-5">
          {testimonials.map((item, index) => (
            <figure
              key={item.id}
              className={`rounded-2xl border-2 p-6 sm:p-7 shadow-[0_12px_28px_-18px_rgba(27,48,77,0.18)] ${
                index === 0 ? "border-[#e3ba4f] bg-[#fff9df]" : "border-[#d9d2c2] bg-[#fffdf9]"
              }`}
            >
              <Quote size={22} className={index === 0 ? "text-[#806512]" : "text-[#8da3bd]"} aria-hidden="true" />
              <blockquote className="mt-3 font-display text-lg font-bold leading-8 tracking-[-0.01em] text-[#203652] sm:text-xl">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-between border-t-2 border-[#e6dfd1] pt-4">
                <span>
                  <span className="block font-display font-black text-sm text-[#203652]">{item.name}</span>
                  <span className="block font-mono text-xs font-semibold text-[#627894]">{item.role}</span>
                </span>
                <span className="flex gap-0.5" aria-label="Rating 5 dari 5">
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star key={star} size={14} className="fill-[#f2c14e] text-[#f2c14e]" />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

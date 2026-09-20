"use client";

import Image from "next/image";
import { tutors } from "@/data/landing";

export default function LandingTutors() {
  return (
    <section id="tutor" className="border-y border-[#b8c9dd] bg-[#e2ecf7] py-20 sm:py-28" aria-label="Tutor Nurman Course">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#14233a] sm:text-5xl">Tentor yang menemani di setiap simpul rute.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#627894]">Tentor terpilih dengan latar pendidikan relevan dan sabar mendampingi anak.</p>
          </div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#4a70a9]">{tutors.length} tutor unggulan</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor, index) => (
            <article key={tutor.nickname} className="group overflow-hidden rounded-[1.75rem] border border-[#c4d3e3] bg-white/80 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(46,75,122,0.12)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#dbe6f3]">
                <Image src={tutor.photo} alt={tutor.nickname} fill sizes="(min-width: 1024px) 384px, (min-width: 640px) 45vw, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-[#2e4b7a] text-sm font-black text-white">0{index + 1}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black tracking-[-0.03em] text-[#294568]">{tutor.nickname}</h3>
                <p className="mt-1 text-sm font-bold text-[#4a70a9]">{tutor.major}</p>
                <p className="mt-3 text-sm leading-6 text-[#627894]">{tutor.university}</p>
                <p className="mt-2 text-sm leading-6 text-[#536781]">{tutor.focus}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

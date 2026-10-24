"use client";

import Image from "next/image";
import { tutors } from "@/data/landing";

export default function LandingTutors() {
  return (
    <section id="tutor" className="border-y-2 border-[#d9d2c2] bg-[#ede8d8]/40 py-20 sm:py-28" aria-label="Tutor nCourse">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-[#14233a] sm:text-5xl">
              Tentor yang menemani di setiap simpul rute.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#50647a]">
              Tentor terpilih dengan latar pendidikan relevan dan sabar mendampingi anak.
            </p>
          </div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#4a70a9]">
            {tutors.length} tutor unggulan
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor, index) => (
            <article
              key={tutor.nickname}
              className="group overflow-hidden rounded-2xl border-2 border-[#d9d2c2] bg-[#fffdf9] shadow-[0_12px_28px_-18px_rgba(27,48,77,0.18)] transition-all hover:-translate-y-1 hover:border-[#4a70a9] hover:shadow-[0_16px_34px_-16px_rgba(27,48,77,0.26)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-[#d9d2c2] bg-[#e6eff8]">
                <Image src={tutor.photo} alt={tutor.nickname} fill sizes="(min-width: 1024px) 384px, (min-width: 640px) 45vw, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-[#2e4b7a] font-mono text-xs font-bold text-white shadow-sm">
                  0{index + 1}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-black tracking-[-0.02em] text-[#203652]">{tutor.nickname}</h3>
                <p className="mt-1 font-mono text-xs font-bold text-[#4a70a9]">{tutor.major}</p>
                <p className="mt-3 text-sm leading-6 text-[#627894]">{tutor.university}</p>
                <p className="mt-2 text-sm leading-6 text-[#50647a]">{tutor.focus}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

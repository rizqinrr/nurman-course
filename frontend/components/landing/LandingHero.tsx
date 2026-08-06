"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleCheck, Search, Sparkles, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { heroBenefits } from "@/data/landing";

const AVATARS = [
  { src: "/tutors/kak-aisyah.svg", alt: "Kak Aisyah" },
  { src: "/tutors/kak-fikri.svg", alt: "Kak Kiki" },
  { src: "/tutors/kak-nadine.svg", alt: "Kak Nadine" },
];

const HERO_FLOATING = [
  { icon: CircleCheck, label: "Jadwal fleksibel" },
  { icon: Star, label: "Laporan progres" },
];

export default function LandingHero() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/course/program");
  };

  return (
    <section
      id="beranda"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28"
      aria-label="Hero Nurman Course"
    >
      {/* Decorative gradient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#4a70a9]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
        {/* Left content */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold text-[#4a70a9] shadow-sm backdrop-blur-md sm:text-sm">
            <Star
              size={14}
              strokeWidth={2.25}
              fill="currentColor"
              aria-hidden="true"
            />
            Les privat favorit keluarga
          </span>

          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Belajar lebih dekat,{" "}
            <span className="bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent">
              hasil lebih nyata
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-900 sm:text-lg">
            Les privat online &amp; offline untuk SD–SMP. Materi, jenjang, dan
            calistung. Pilih sendiri, atur jadwalmu, langsung daftar lewat
            WhatsApp.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex max-w-md items-center gap-1 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-lg backdrop-blur-md focus-within:border-[#4a70a9]"
          >
            <Search
              size={18}
              className="ml-3 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari program les..."
              aria-label="Cari program les"
              className="w-full bg-transparent px-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 sm:text-base"
            />
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#4a70a9] px-4 text-sm font-semibold text-white transition-all hover:bg-[#3a5a99] sm:h-11 sm:px-5"
            >
              <span className="hidden sm:inline">Cari</span>
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
            </button>
          </form>

          {/* Social proof */}
          <div className="mt-7 flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATARS.map((avatar) => (
                <Image
                  key={avatar.src}
                  src={avatar.src}
                  alt={avatar.alt}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">5+ siswa aktif</p>
              <p className="text-xs text-gray-500 sm:text-sm">
                Dipercaya orang tua di Cilacap
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right content */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative z-10 mx-auto w-full max-w-md"
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 -rotate-3 rounded-[2.5rem] bg-gradient-to-br from-[#4a70a9]/25 to-indigo-300/30 blur-xl"
            />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 p-8 shadow-[0_24px_60px_rgba(74,112,169,0.25)] backdrop-blur-xl sm:p-10">
              <div className="ml-8 flex items-center gap-4 sm:ml-14">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 bg-[#2e4b7a] shadow-md">
                  <Image
                    src="/Nlogo.png"
                    alt="Logo Nurman Course"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                </span>
                <div>
                  <p className="text-lg font-black text-gray-900">
                    Nurman Course
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#4a70a9]">
                    Les Privat
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Harga mulai dari
                </p>
                <p className="price-pulse mt-2 inline-block rounded-2xl px-4 py-1.5 text-4xl font-black text-[#4a70a9] sm:text-5xl">
                  15rb
                  <span className="text-lg font-bold text-gray-600">/sesi</span>
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {heroBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:translate-x-1 hover:border-[#4a70a9]/30 hover:bg-white/85 hover:shadow-md"
                  >
                    <CircleCheck
                      size={20}
                      strokeWidth={2.25}
                      className="shrink-0 text-[#4a70a9]"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold text-gray-800">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4a70a9]/10 px-4 py-2 text-xs font-semibold text-[#4a70a9]">
                <Sparkles size={14} strokeWidth={2.25} aria-hidden="true" />
                Daftar sekarang, konsultasi gratis
              </div>
            </div>

            {/* Floating chips */}
            {HERO_FLOATING.map((chip, index) => {
              const Icon = chip.icon;
              return (
                <motion.div
                  key={chip.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 + index * 0.15 }}
                  className={`absolute z-20 flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-bold text-gray-800 shadow-lg backdrop-blur-md ${
                    index === 0
                      ? "-left-4 top-8 sm:-left-6"
                      : "-right-2 bottom-8 sm:-right-4"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={2.25}
                    className="text-[#4a70a9]"
                    aria-hidden="true"
                  />
                  {chip.label}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

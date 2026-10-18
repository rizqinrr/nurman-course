"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, MapPin, MessageCircle, UserRoundCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const avatars = [
  { src: "/tutors/kak-aisyah.svg", alt: "Kak Aisyah" },
  { src: "/tutors/kak-fikri.svg", alt: "Kak Kiki" },
  { src: "/tutors/kak-nadine.svg", alt: "Kak Nadine" },
];

const routeNodes = [
  { icon: MapPin, title: "Pilih kebutuhan", detail: "Materi, jenjang, atau calistung" },
  { icon: UserRoundCheck, title: "Cocokkan tentor", detail: "Pendamping yang sesuai fokus belajar" },
  { icon: CalendarDays, title: "Atur jadwal", detail: "Online atau offline, lebih fleksibel" },
  { icon: MessageCircle, title: "Mulai lewat WhatsApp", detail: "Konfirmasi dan konsultasi gratis" },
];

export default function LandingHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="beranda" className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40" aria-label="Nurman Course">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#d9d2c2] bg-[#fffdf9] px-4 py-2 font-mono text-xs font-bold text-[#2e4b7a]">
            <span className="h-2 w-2 rounded-full bg-[#f2c14e]" />
            Les privat online &amp; offline di Cilacap
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-[#14233a] sm:text-6xl lg:text-[4.75rem]">
            Temukan rute belajar yang pas untuk anak.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#50647a] sm:text-lg sm:leading-8">
            Pilih fokus belajar, cocokkan dengan tentor, atur jadwal, lalu mulai. Orang tua tetap tahu perkembangan anak lewat laporan progres berkala.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/course/program" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4a70a9] px-6 text-sm font-bold text-white shadow-[0_4px_0_#2b4875] transition-transform hover:-translate-y-0.5 hover:bg-[#3d6094]">
              Susun pilihan belajar <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <Link href="/login?mode=register" className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9] px-6 text-sm font-bold text-[#2e4b7a] transition hover:border-[#4a70a9]">
              Buat akun member
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((avatar) => (
                <Image key={avatar.src} src={avatar.src} alt={avatar.alt} width={42} height={42} className="h-11 w-11 rounded-full border-2 border-[#d9d2c2] bg-white object-cover" />
              ))}
            </div>
            <div className="text-sm">
              <p className="font-mono text-xs font-black uppercase tracking-[0.08em] text-[#2e4b7a]">5 siswa aktif</p>
              <p className="text-xs text-[#627894]">didampingi tutor terpilih</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={reduceMotion ? false : { opacity: 0, x: 22 }} animate={reduceMotion ? undefined : { opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-xl">
          <div className="route-board relative overflow-hidden rounded-[2rem] border-2 border-[#d9d2c2] bg-[#fffdf9] p-5 shadow-[0_24px_50px_-20px_rgba(27,48,77,0.2)] sm:p-8">
            <div className="mb-7 flex items-center justify-between border-b-2 border-[#e6dfd1] pb-5">
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#4a70a9]">Peta mulai belajar</p>
                <p className="mt-1 text-sm font-semibold text-[#627894]">Empat langkah, tanpa bingung mulai dari mana.</p>
              </div>
              <Image src="/Nlogo.png" alt="" width={48} height={48} className="rounded-2xl bg-[#2e4b7a] p-1 shadow-md" />
            </div>
            <div className="relative space-y-4">
              <div className="route-line absolute bottom-8 left-6 top-8 w-0.5 bg-[#d9d2c2]" aria-hidden="true" />
              {routeNodes.map((node, index) => {
                const Icon = node.icon;
                const isDestination = index === routeNodes.length - 1;
                return (
                  <div
                    key={node.title}
                    className={`route-node relative flex items-center gap-4 rounded-xl border-2 p-4 ${
                      isDestination
                        ? "border-[#e3ba4f] bg-[#fff9df]"
                        : "border-[#e0d9ca] bg-[#faf8f3]"
                    }`}
                    style={{ animationDelay: `${index * 0.8}s` }}
                  >
                    <span
                      className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                        isDestination ? "bg-[#f2c14e] text-[#493b12]" : "bg-[#4a70a9] text-white"
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="font-display font-black tracking-[-0.02em] text-[#203652]">{node.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-[#627894] sm:text-sm">{node.detail}</p>
                    </div>
                    {index < routeNodes.length - 1 && <span className="ml-auto font-mono text-xs font-black text-[#8da3bd]">0{index + 1}</span>}
                    {isDestination && <Check size={20} className="ml-auto text-[#806512]" />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 rounded-xl border-2 border-[#1c304f] bg-[#2e4b7a] px-4 py-3 font-mono text-xs font-bold text-white shadow-[0_4px_0_#142238] sm:-left-8">
            Mulai 15rb / sesi
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import {
  BarChart3,
  CalendarClock,
  MessagesSquare,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/course/Reveal";
import { aboutPoints } from "@/data/landing";

const ICONS: Record<string, LucideIcon> = {
  chart: BarChart3,
  user: UserCheck,
  calendar: CalendarClock,
  message: MessagesSquare,
};

export default function LandingAbout() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="tentang"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
      aria-label="Tentang Nurman Course"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4a70a9]/80">
              Tentang Kami
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Les privat yang dekat dengan keluarga
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              Nurman Course hadir untuk menemani anak belajar dengan pendekatan
              personal, bukan kelas ramai. Pendampingan yang menyesuaikan
              kecepatan dan kebutuhan tiap siswa. Orang tua tetap terhubung
              lewat laporan progres berkala.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#4a70a9] shadow-sm backdrop-blur-md">
              <MessagesSquare size={16} strokeWidth={2.25} aria-hidden="true" />
              Online &amp; offline, di rumah tentor atau siswa
            </div>

            <div className="mt-4">
              <motion.a
                href="https://discord.gg/ydZx8h5Uj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/70 bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#5865F2] shadow-sm backdrop-blur-md hover:bg-white/90 hover:shadow-md transition-colors"
                whileHover={reduceMotion ? undefined : { 
                  scale: 1.05, 
                  rotate: [0, -3, 3, -3, 3, 0] 
                }}
                transition={{ duration: 0.4 }}
              >
                <svg
                  viewBox="0 0 127.14 96.36"
                  className="h-5 w-5 fill-[#5865F2]"
                  aria-hidden="true"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.8,6.83,77.19,77.19,0,0,0,49.5,0,105.15,105.15,0,0,0,19.06,8.07C-3.41,41.51-1,74,10.26,90.68A105.73,105.73,0,0,0,41.9,96.36a77.7,77.7,0,0,0,8.77-14.28,68.7,68.7,0,0,1-13.85-6.65c1.17-.85,2.3-1.74,3.37-2.67a75.52,75.52,0,0,0,73.88,0c1.07.93,2.2,1.82,3.37,2.67a68.66,68.66,0,0,1-13.86,6.65,77.86,77.86,0,0,0,8.78,14.28,105.73,105.73,0,0,0,31.64-5.68C128.52,74,130.91,41.51,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                </svg>
                Gabung Server Discord
              </motion.a>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {aboutPoints.map((point, index) => {
            const Icon = ICONS[point.icon] ?? UserCheck;
            return (
              <motion.div
                key={point.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: reduceMotion ? 0 : index * 0.08,
                }}
              >
                <GlassCard className="h-full p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4a70a9]/10">
                    <Icon
                      size={22}
                      strokeWidth={2.25}
                      className="text-[#4a70a9]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                    {point.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

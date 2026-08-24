"use client";

import {
  BookOpen,
  GraduationCap,
  Monitor,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/course/Reveal";
import { landingCategories } from "@/data/landing";

const ICONS: Record<string, LucideIcon> = {
  monitor: Monitor,
  graduation: GraduationCap,
  book: BookOpen,
  sparkles: Sparkles,
};

export default function LandingCategories() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <section id="program" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-app-primary">
            Program Belajar
          </p>
          <h2 className="mt-2 font-playfair text-3xl font-normal tracking-tight text-app-text sm:text-4xl">
            Pilih jalur yang paling pas
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-app-text-muted sm:text-base">
            Semua program bisa online atau offline, dengan jadwal yang fleksibel
            dan laporan progres untuk orang tua.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {landingCategories.map((category, index) => {
          const Icon = ICONS[category.icon] ?? Sparkles;
          return (
            <motion.div
              key={category.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: reduceMotion ? 0 : index * 0.08,
              }}
            >
              <div
                onClick={() => router.push(category.route)}
                className="group h-full p-6 text-center rounded-2xl border border-app-border bg-app-surface shadow-sm cursor-pointer transition-all hover:bg-app-white"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[6px] bg-app-primary/10 transition-transform duration-300 group-hover:scale-105">
                  <Icon
                    size={28}
                    strokeWidth={2.25}
                    className="text-app-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-playfair text-lg font-normal text-app-text">{category.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-app-text-mid">
                  {category.description}
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-app-primary">
                  {category.countLabel}
                  <ArrowRight
                    size={14}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

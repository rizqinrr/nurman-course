"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/course/Reveal";
import { featuredPrograms } from "@/data/landing";

export default function FeaturedPrograms() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <Reveal className="mt-12 sm:mt-14">
      <section aria-label="Program favorit Nurman Course">
        <div className="mb-4 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a70a9]/80">
            Program favorit
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Pilih jalur belajar yang pas
          </h2>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Langsung masuk alur pendaftaran sesuai kebutuhan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {featuredPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: reduceMotion ? 0 : index * 0.07,
              }}
            >
              <GlassCard
                onClick={() => router.push(program.route)}
                className="p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                        {program.label}
                      </h3>
                      {program.badge ? (
                        <span className="rounded-full bg-[#4a70a9]/12 px-2.5 py-0.5 text-xs font-semibold text-[#4a70a9]">
                          {program.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-sm text-gray-600 sm:text-base">
                      {program.description}
                    </p>
                  </div>
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#4a70a9] shadow-sm">
                    <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

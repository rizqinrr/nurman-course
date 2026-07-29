"use client";

import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import CountUp from "@/components/course/CountUp";
import Reveal from "@/components/course/Reveal";
import { socialStats } from "@/data/landing";

export default function SocialProof() {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal className="mt-10 sm:mt-12">
      <section aria-label="Bukti sosial Nurman Course">
        <div className="mb-4 px-1 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a70a9]/80">
            Dipercaya keluarga
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Angka yang tumbuh bareng siswa
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {socialStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: reduceMotion ? 0 : index * 0.08,
              }}
            >
              <GlassCard className="p-5 text-center sm:p-6">
                <p className="text-3xl font-bold text-[#4a70a9] sm:text-4xl">
                  <CountUp value={stat.value} suffix={stat.suffix ?? ""} />
                </p>
                <p className="mt-2 text-sm font-medium text-gray-600 sm:text-base">
                  {stat.label}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

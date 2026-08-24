"use client";

import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import CountUp from "@/components/course/CountUp";
import Reveal from "@/components/course/Reveal";
import { landingStats } from "@/data/landing";

export default function LandingStats() {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal className="relative z-20 mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {landingStats.map((stat, index) => (
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
            <div className="rounded-2xl border border-app-border bg-app-surface p-5 text-center sm:p-6 shadow-sm">
              <p className="font-playfair text-3xl font-normal text-app-primary sm:text-4xl">
                <CountUp value={stat.value} suffix={stat.suffix ?? ""} />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-app-text-muted sm:text-sm">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import CountUp from "@/components/course/CountUp";
import Reveal from "@/components/course/Reveal";
import { landingStats } from "@/data/landing";

export default function LandingStats() {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal className="relative z-20 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
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
            <GlassCard className="p-5 text-center sm:p-6">
              <p className="text-3xl font-black text-[#4a70a9] sm:text-4xl">
                <CountUp value={stat.value} suffix={stat.suffix ?? ""} />
              </p>
              <p className="mt-2 text-xs font-medium text-gray-600 sm:text-sm">
                {stat.label}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}

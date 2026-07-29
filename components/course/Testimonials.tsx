"use client";

import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/course/Reveal";
import { testimonials } from "@/data/landing";

export default function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal className="mt-12 sm:mt-14">
      <section aria-label="Testimoni singkat Nurman Course">
        <div className="mb-4 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a70a9]/80">
            Kata mereka
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Testimoni singkat
          </h2>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Cuplikan pengalaman orang tua dan siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: reduceMotion ? 0 : index * 0.07,
              }}
            >
              <GlassCard className="p-5 sm:p-6">
                <Quote
                  size={20}
                  strokeWidth={2.25}
                  className="text-[#4a70a9]/70"
                  aria-hidden="true"
                />
                <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                  “{item.quote}”
                </p>
                <div className="mt-4 border-t border-white/60 pt-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 sm:text-sm">{item.role}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

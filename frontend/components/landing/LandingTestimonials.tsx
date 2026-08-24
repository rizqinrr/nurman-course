"use client";

import { Quote, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/course/Reveal";
import { testimonials } from "@/data/landing";

export default function LandingTestimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="testimoni"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
      aria-label="Testimoni Nurman Course"
    >
      <Reveal>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-app-primary">
            Kata Mereka
          </p>
          <h2 className="mt-2 font-playfair text-3xl font-normal tracking-tight text-app-text sm:text-4xl">
            Dipercaya orang tua &amp; siswa
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-app-text-muted sm:text-base">
            Cuplikan pengalaman keluarga yang sudah belajar bersama Nurman Course.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.id}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
              delay: reduceMotion ? 0 : index * 0.08,
            }}
          >
            <div className="flex h-full flex-col p-6 rounded-2xl border border-app-border bg-app-surface shadow-sm">
              <Quote
                size={20}
                strokeWidth={2.25}
                className="text-app-primary/70"
                aria-hidden="true"
              />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-app-text-mid sm:text-base">
                “{item.quote}”
              </p>
              <div className="mt-4 border-t border-app-border pt-4">
                <div className="flex items-center gap-0.5" aria-label="Rating 5 dari 5">
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star
                      key={star}
                      size={14}
                      strokeWidth={2.25}
                      className="text-amber-400 fill-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mt-2 font-playfair text-sm font-normal text-app-text">{item.name}</p>
                <p className="text-xs text-app-text-muted sm:text-sm">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

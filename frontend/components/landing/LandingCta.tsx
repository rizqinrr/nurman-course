"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import Reveal from "@/components/course/Reveal";

export default function LandingCta() {
  const router = useRouter();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-br from-[#4a70a9] to-indigo-600 p-8 text-center shadow-[0_24px_60px_rgba(74,112,169,0.35)] sm:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
            Siap mulai belajar?
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            Daftarkan anak Anda sekarang, konsultasi gratis dulu
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">
            Pilih program, atur konfigurasi belajar, dan lanjut ke WhatsApp
            untuk konfirmasi jadwal. Semua cepat dan mudah.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/course/program")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#4a70a9] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              Pilih Program
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
            </button>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/60 bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/25 sm:w-auto"
            >
              <MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
              Tanya Admin
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

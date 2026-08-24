"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import Reveal from "@/components/course/Reveal";

export default function LandingCta() {
  const router = useRouter();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-app-border bg-app-surface p-8 text-center shadow-sm sm:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-app-primary">
            Siap mulai belajar?
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-playfair text-3xl font-normal tracking-tight text-app-text sm:text-4xl">
            Daftarkan anak Anda sekarang, konsultasi gratis dulu
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-app-text-mid sm:text-base">
            Pilih program, atur konfigurasi belajar, dan lanjut ke WhatsApp
            untuk konfirmasi jadwal. Semua cepat dan mudah.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/course/program")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-app-primary px-7 py-3.5 text-sm font-semibold text-app-white shadow-sm transition-all hover:bg-app-secondary sm:w-auto"
            >
              Pilih Program
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
            </button>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-app-border bg-app-white px-7 py-3.5 text-sm font-semibold text-app-primary transition-all hover:bg-app-surface hover:text-app-secondary sm:w-auto"
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

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function LandingCta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-[#1c304f] bg-[#223d68] px-6 py-12 text-white shadow-[0_24px_50px_-20px_rgba(27,48,77,0.35)] sm:px-12 sm:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#4a70a9]/60 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <h2 className="font-display max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              Langkah terakhir di peta: mulai kelas pertama anak.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#d0e0f2]">
              Pilih program, atur konfigurasi belajar, lalu konfirmasi jadwal. Konsultasi gratis sebelum memulai.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/course/program"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f2c14e] px-6 text-sm font-black text-[#42330b] shadow-[0_4px_0_#b58921] transition-transform hover:-translate-y-0.5 hover:bg-[#fad868]"
            >
              Pilih program <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <MessageCircle size={18} /> Tanya admin
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

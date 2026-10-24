import { ArrowRight, MessageCircle } from "lucide-react";

export default function Landing2Cta() {
  return (
    <section className="py-20 bg-[#f2efe7]/50 border-t-2 border-[#d9d2c2] text-center">
      <div className="max-w-[720px] mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#14233a]">
          Mulai dari yang paling pas untukmu atau anakmu.
        </h2>
        <p className="text-base sm:text-lg text-[#50647a] mt-3 mb-8 leading-relaxed">
          Mau mulai baca materi gratis sekarang, atau konsultasikan kebutuhan les privat anak secara santai lewat WhatsApp?
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#kelas"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4a70a9] px-7 text-sm font-bold text-white shadow-[0_4px_0_#2b4875] transition-transform hover:-translate-y-0.5 hover:bg-[#3d6094]"
          >
            Jelajahi Kelas Mandiri <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </a>

          <a
            href="https://wa.me/6281234567890?text=Halo%20nCourse,%20saya%20ingin%20tanya%20seputar%20les%20privat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9] px-7 text-sm font-bold text-[#2e4b7a] transition hover:border-[#4a70a9] shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Chat Tanya-Tanya di WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, MessageCircle } from "lucide-react";

export default function Landing2Cta() {
  return (
    <section className="py-20 bg-[#f4f7f6] border-t border-[#d3dddf] text-center">
      <div className="max-w-[720px] mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#243c4c]">
          Mulai dari yang paling pas untukmu atau anakmu.
        </h2>
        <p className="text-sm sm:text-base text-[#5c7787] mt-3 mb-8 leading-relaxed">
          Mau mulai baca materi gratis sekarang, atau konsultasikan kebutuhan les privat anak secara santai lewat WhatsApp?
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#kelas"
            className="px-7 py-3.5 rounded-full bg-[#3f7499] hover:bg-[#243c4c] text-white text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Jelajahi Kelas Mandiri <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="https://wa.me/6281234567890?text=Halo%20Nurman%20Course,%20saya%20ingin%20tanya%20seputar%20les%20privat"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full border border-[#d3dddf] bg-white hover:border-[#3f7499] text-[#243c4c] text-sm font-semibold shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Chat Tanya-Tanya di WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

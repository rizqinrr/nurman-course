import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Monitor, Sparkles, type LucideIcon } from "lucide-react";
import { landingCategories } from "@/data/landing";

const icons: Record<string, LucideIcon> = { monitor: Monitor, graduation: GraduationCap, book: BookOpen, sparkles: Sparkles };

export default function LandingCategories() {
  return (
    <section id="program" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#14233a] sm:text-5xl">Mulai dari kebutuhan yang paling terasa.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#627894]">Tidak perlu memilih paket yang rumit. Tentukan fokus anak, lalu lanjutkan ke konfigurasi jadwal yang sesuai.</p>
          <Link href="/course/program" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#2e4b7a] underline decoration-[#f2c14e] decoration-4 underline-offset-8">Lihat semua pilihan <ArrowRight size={17} /></Link>
        </div>
        <div className="relative">
          <div className="absolute bottom-10 left-7 top-10 w-px bg-[#afc2d8]" aria-hidden="true" />
          <div className="space-y-4">
            {landingCategories.map((category, index) => {
              const Icon = icons[category.icon] ?? Sparkles;
              return (
                <Link key={category.id} href={category.route} className="group relative grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 rounded-[1.75rem] border border-[#c4d3e3] bg-white/75 p-4 transition hover:-translate-y-1 hover:border-[#4a70a9] hover:bg-white hover:shadow-[0_18px_45px_rgba(46,75,122,0.12)] sm:gap-6 sm:p-6">
                  <span className={`relative z-10 grid h-14 w-14 place-items-center rounded-2xl ${index === landingCategories.length - 1 ? "bg-[#f2c14e] text-[#493b12]" : "bg-[#4a70a9] text-white"}`}><Icon size={23} /></span>
                  <span><span className="block text-lg font-black tracking-[-0.03em] text-[#294568] sm:text-xl">{category.label}</span><span className="mt-1 hidden text-sm leading-6 text-[#627894] sm:block">{category.description}</span><span className="mt-2 block text-xs font-bold text-[#4a70a9]">{category.countLabel}</span></span>
                  <ArrowRight size={20} className="mr-1 text-[#8da3bd] transition group-hover:translate-x-1 group-hover:text-[#4a70a9]" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

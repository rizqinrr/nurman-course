"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function VennBridgeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const val = Math.max(-15, Math.min(35, (0.5 - progress) * 60));
      setOffsetX(val);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#14233a] text-[#fffdf9] overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 font-mono text-xs font-bold text-[#f2c14e] mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Ekosistem Terpadu
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight">
              Satu Akun, Dua Cara Belajar.
            </h2>
            <p className="text-[#a4b4c7] text-base sm:text-lg mt-3 mb-8 leading-relaxed">
              Murid les privat bisa melanjutkan belajar mandiri lewat modul bacaan interaktif di rumah. Member kelas mandiri yang butuh pendampingan intensif bisa langsung request tentor privat kapan saja—semua progres tersimpan di satu akun.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/login"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4a70a9] px-6 text-sm font-bold text-white shadow-[0_4px_0_#2b4875] transition-transform hover:-translate-y-0.5 hover:bg-[#3d6094]"
              >
                Buat Akun Gratis <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </a>
              <a
                href="/course/config"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/20 bg-white/5 px-6 text-sm font-bold text-white transition hover:border-white/40"
              >
                Konsultasi Les Privat
              </a>
            </div>
          </div>

          {/* Right: Venn Diagram SVG with Parallax Shift */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[420px]">
              <svg
                viewBox="0 0 400 260"
                className="w-full h-auto select-none"
                role="img"
                aria-label="Diagram dua lingkaran beririsan: kelas mandiri dan les privat"
              >
                {/* Circle Left: Kelas Mandiri */}
                <g
                  style={{
                    transform: `translateX(${-offsetX}px)`,
                    transition: "transform 0.1s ease-out",
                  }}
                >
                  <circle
                    cx="150"
                    cy="130"
                    r="92"
                    fill="rgba(217, 210, 194, 0.08)"
                    stroke="#d9d2c2"
                    strokeWidth="1.75"
                    strokeDasharray="4 2"
                  />
                  <text
                    x="105"
                    y="124"
                    fill="#fffdf9"
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none font-display"
                  >
                    Kelas
                  </text>
                  <text
                    x="105"
                    y="144"
                    fill="#fffdf9"
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none font-display"
                  >
                    Mandiri
                  </text>
                  <text
                    x="105"
                    y="164"
                    fill="#d9d2c2"
                    fontSize="11"
                    textAnchor="middle"
                    className="select-none font-mono font-medium"
                  >
                    Baca & Praktik
                  </text>
                </g>

                {/* Circle Right: Les Privat */}
                <g
                  style={{
                    transform: `translateX(${offsetX}px)`,
                    transition: "transform 0.1s ease-out",
                  }}
                >
                  <circle
                    cx="250"
                    cy="130"
                    r="92"
                    fill="rgba(74, 112, 169, 0.18)"
                    stroke="#4a70a9"
                    strokeWidth="2"
                  />
                  <text
                    x="295"
                    y="124"
                    fill="#fffdf9"
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none font-display"
                  >
                    Les
                  </text>
                  <text
                    x="295"
                    y="144"
                    fill="#fffdf9"
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none font-display"
                  >
                    Privat
                  </text>
                  <text
                    x="295"
                    y="164"
                    fill="#78aacb"
                    fontSize="11"
                    textAnchor="middle"
                    className="select-none font-mono font-medium"
                  >
                    Tentor 1-on-1
                  </text>
                </g>

                {/* Overlap Text */}
                <g>
                  <text
                    x="200"
                    y="118"
                    fill="#f2c14e"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none font-mono"
                  >
                    Satu Akun
                  </text>
                  <text
                    x="200"
                    y="136"
                    fill="#d9d2c2"
                    fontSize="11"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Materi Sama
                  </text>
                  <text
                    x="200"
                    y="152"
                    fill="#d9d2c2"
                    fontSize="11"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Progres Sinkron
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

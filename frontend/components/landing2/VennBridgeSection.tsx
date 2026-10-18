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
    <section ref={sectionRef} className="py-20 bg-[#1e2f3b] text-[#f7f9f8] overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#78aacb] mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Ekosistem Terpadu
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Satu Akun, Dua Cara Belajar.
            </h2>
            <p className="text-[#acbcbf] text-base mt-3 mb-8 leading-relaxed">
              Murid les privat bisa melanjutkan belajar mandiri lewat modul bacaan interaktif di rumah. Member kelas mandiri yang butuh pendampingan intensif bisa langsung request tentor privat kapan saja—semua progres tersimpan di satu akun.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/login"
                className="px-6 py-3 rounded-full bg-[#5289ad] hover:bg-[#6ba3c8] text-[#0f1a22] text-sm font-bold shadow-lg transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                Buat Akun Gratis <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/course/config"
                className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
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
                    fill="rgba(172, 188, 191, 0.08)"
                    stroke="#acbcbf"
                    strokeWidth="1.75"
                    strokeDasharray="4 2"
                  />
                  <text
                    x="105"
                    y="124"
                    fill="#f7f9f8"
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Kelas
                  </text>
                  <text
                    x="105"
                    y="144"
                    fill="#f7f9f8"
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Mandiri
                  </text>
                  <text
                    x="105"
                    y="164"
                    fill="#acbcbf"
                    fontSize="11"
                    textAnchor="middle"
                    className="select-none"
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
                    fill="rgba(82, 137, 173, 0.12)"
                    stroke="#5289ad"
                    strokeWidth="2"
                  />
                  <text
                    x="295"
                    y="124"
                    fill="#f7f9f8"
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Les
                  </text>
                  <text
                    x="295"
                    y="144"
                    fill="#f7f9f8"
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Privat
                  </text>
                  <text
                    x="295"
                    y="164"
                    fill="#78aacb"
                    fontSize="11"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Tentor 1-on-1
                  </text>
                </g>

                {/* Overlap Text */}
                <g>
                  <text
                    x="200"
                    y="118"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Satu Akun
                  </text>
                  <text
                    x="200"
                    y="136"
                    fill="#acbcbf"
                    fontSize="11"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Materi Sama
                  </text>
                  <text
                    x="200"
                    y="152"
                    fill="#acbcbf"
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

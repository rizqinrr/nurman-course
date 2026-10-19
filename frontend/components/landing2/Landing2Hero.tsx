"use client";

import { useState } from "react";
import PromoStage from "./PromoStage";
import FloatingHeroStack from "./FloatingHeroStack";
import { PlayCircle, Layers, ArrowRight, ShieldCheck } from "lucide-react";

export default function Landing2Hero() {
  const [activeTab, setActiveTab] = useState<"video" | "stack">("video");

  return (
    <section className="py-6 sm:py-8 lg:py-10 lg:min-h-[calc(100dvh-64px)] flex items-center overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Pitch */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Pill Badge */}
            <div
              className="animate-hero-fade-up inline-flex items-center gap-2 rounded-full border-2 border-[#d9d2c2] bg-[#fffdf9] px-4 py-1.5 font-mono text-xs font-bold text-[#2e4b7a] mb-5 w-fit shadow-xs"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-2 w-2 rounded-full bg-[#f2c14e]" />
              <span>Bukan Sekadar Teori • Bikin Web & Aplikasi dari Nol</span>
            </div>

            <h1
              className="animate-hero-fade-up font-display text-4xl sm:text-5xl lg:text-[50px] font-extrabold tracking-tight text-[#14233a] leading-[1.08]"
              style={{ animationDelay: "100ms" }}
            >
              Bikin websitemu sendiri dari nol, atau dampingi anak belajar.
            </h1>

            <p
              className="animate-hero-fade-up text-base sm:text-lg text-[#50647a] mt-5 leading-relaxed"
              style={{ animationDelay: "200ms" }}
            >
              Belajar sambil praktik: buat website toko, portofolio, dan aplikasi nyata. Dilengkapi juga dengan les privat <b>Calistung anak</b>, <b>Belajar Ngaji</b>, serta <b>Komputer Dasar</b> dengan laporan harian untuk orang tua.
            </p>

            {/* CTAs */}
            <div
              className="animate-hero-fade-up flex flex-wrap items-center gap-3.5 mt-8"
              style={{ animationDelay: "300ms" }}
            >
              <a
                href="#kelas"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4a70a9] px-6 text-sm font-bold text-white shadow-[0_4px_0_#2b4875] transition-transform hover:-translate-y-0.5 hover:bg-[#3d6094]"
              >
                Jelajahi Kelas Mandiri <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </a>

              <a
                href="#les"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9] px-6 text-sm font-bold text-[#2e4b7a] transition hover:border-[#4a70a9] hover:text-[#14233a]"
              >
                Susun Les Privat
              </a>
            </div>

            <div
              className="animate-hero-fade-up flex items-center gap-3 mt-5 text-xs text-[#627894] font-medium"
              style={{ animationDelay: "400ms" }}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Gratis untuk mulai
              </span>
              <span>•</span>
              <span>Tatap muka di Cilacap & Online</span>
            </div>

            {/* Visual Mode Switcher (Clean Paper Pill) */}
            <div
              className="animate-hero-fade-up mt-8 p-1.5 rounded-2xl bg-[#fffdf9] border-2 border-[#d9d2c2] flex items-center justify-between gap-2 max-w-xs shadow-xs"
              style={{ animationDelay: "500ms" }}
            >
              <span className="text-xs font-mono font-bold text-[#2e4b7a] pl-2">Mode:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "video"
                      ? "bg-[#4a70a9] text-white shadow-xs"
                      : "text-[#50647a] hover:text-[#14233a]"
                  }`}
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Video 9:16</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("stack")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "stack"
                      ? "bg-[#4a70a9] text-white shadow-xs"
                      : "text-[#50647a] hover:text-[#14233a]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Kartu 2.5D</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div
            className="animate-hero-scale-in lg:col-span-6 flex justify-center items-center w-full"
            style={{ animationDelay: "150ms" }}
          >
            {activeTab === "video" ? (
              <div className="w-full flex justify-center">
                <PromoStage />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <FloatingHeroStack />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

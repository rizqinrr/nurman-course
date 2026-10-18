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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3f7499]/10 border border-[#3f7499]/20 text-xs font-semibold text-[#243c4c] mb-4 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#3f7499] animate-pulse" />
              <span>Bukan Sekadar Teori • Bikin Web & Aplikasi dari Nol</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#243c4c] leading-[1.15]">
              Bikin websitemu sendiri dari nol, atau dampingi anak belajar.
            </h1>

            <p className="text-sm sm:text-base text-[#5c7787] mt-4 leading-relaxed">
              Belajar sambil praktik: buat website toko, portofolio, dan aplikasi nyata. Dilengkapi juga dengan les privat Calistung anak, Belajar Ngaji, serta Komputer Dasar dengan laporan harian untuk orang tua.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              <a
                href="#kelas"
                className="px-6 py-3 rounded-full bg-[#3f7499] hover:bg-[#243c4c] text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
              >
                Jelajahi Kelas Mandiri <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#les"
                className="px-6 py-3 rounded-full border border-[#d3dddf] hover:border-[#3f7499] bg-white text-[#243c4c] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
              >
                Susun Les Privat
              </a>
            </div>

            <div className="flex items-center gap-3 mt-3 text-xs text-[#5c7787]">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Gratis untuk mulai
              </span>
              <span>•</span>
              <span>Tatap muka di Cilacap & Online</span>
            </div>

            {/* Visual Mode Switcher */}
            <div className="mt-6 p-2.5 rounded-2xl bg-[#f0f4f5] border border-[#d3dddf] flex items-center justify-between gap-2 max-w-sm">
              <span className="text-xs font-bold text-[#243c4c]">Mode Animasi:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "video"
                      ? "bg-white text-[#243c4c] shadow-sm border border-[#d3dddf]"
                      : "text-[#5c7787] hover:text-[#243c4c]"
                  }`}
                >
                  <PlayCircle className="w-3.5 h-3.5 text-[#3f7499]" />
                  <span>Video Promo (9:16)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("stack")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "stack"
                      ? "bg-white text-[#243c4c] shadow-sm border border-[#d3dddf]"
                      : "text-[#5c7787] hover:text-[#243c4c]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#5289ad]" />
                  <span>Kartu 2.5D</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-6 flex justify-center items-center w-full">
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

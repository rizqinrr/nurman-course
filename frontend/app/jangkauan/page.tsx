"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, MessageCircle, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from "next/font/google";
import Landing2Nav from "@/components/landing2/Landing2Nav";
import CoverageLocationChecker from "@/components/coverage/CoverageLocationChecker";
import CoverageMap from "@/components/coverage/CoverageMap";
import CoverageAreaCards from "@/components/coverage/CoverageAreaCards";
import CoverageTutorList from "@/components/coverage/CoverageTutorList";
import CoverageFaq from "@/components/coverage/CoverageFaq";
import LandingFooter from "@/components/landing/LandingFooter";
import { COVERAGE_AREAS } from "@/data/coverage";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-learn-display" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-learn-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-learn-mono" });

export default function CoveragePage() {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>("cilacap-tengah");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [customAddressName, setCustomAddressName] = useState<string>("Cilacap Tengah");

  const handleSelectArea = (areaId: string | null) => {
    setSelectedAreaId(areaId);
    if (areaId) {
      const area = COVERAGE_AREAS.find((a) => a.id === areaId);
      if (area) {
        setUserCoords({ lat: area.lat, lng: area.lng });
        setCustomAddressName(area.name);
      }
    }
  };

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setUserCoords(coords);
    setSelectedAreaId(null);
    setCustomAddressName("Titik Pilihan Peta");
  };

  const handleSetUserCoords = (coords: { lat: number; lng: number } | null, name?: string) => {
    setUserCoords(coords);
    if (name) setCustomAddressName(name);
  };

  const generalWaUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Halo nCourse, saya ingin konsultasi pendaftaran les privat untuk anak saya."
  )}`;

  return (
    <main
      className={`landing-hybrid ${display.variable} ${body.variable} ${mono.variable} min-h-screen text-[#2b3a4a] antialiased`}
    >
      <Landing2Nav />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-8 sm:pt-14 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#4a70a9]/30 bg-[#eaf0f9] px-4 py-1 font-mono text-xs font-bold text-[#2e4b7a] shadow-xs">
              <Compass className="h-4 w-4 text-[#4a70a9]" />
              Peta Jangkauan Layanan Les Privat
            </div>

            {/* H1 Headline */}
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-[#14233a] sm:text-5xl lg:text-6xl">
              Cek Apakah Rumah Anda Terjangkau Tentor Kami.
            </h1>

            {/* Lead */}
            <p className="mt-4 text-base leading-relaxed text-[#50647a] sm:text-lg">
              Dari kawasan Cilacap Kota hingga kecamatan sekitar, tentor kami siap datang mendampingi anak belajar secara intensif 1-on-1 dengan laporan harian langsung ke portal wali murid.
            </p>

            {/* Value Props */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold sm:text-sm">
              <div className="flex items-center gap-2 rounded-xl bg-[#fffdf9] px-3.5 py-2 border-2 border-[#d9d2c2] text-[#203652] shadow-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Bebas Biaya Transport (Zona 1)</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#fffdf9] px-3.5 py-2 border-2 border-[#d9d2c2] text-[#203652] shadow-xs">
                <UserCheck className="h-4 w-4 text-[#4a70a9]" />
                <span>Tentor Datang ke Rumah</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#fffdf9] px-3.5 py-2 border-2 border-[#d9d2c2] text-[#203652] shadow-xs">
                <Sparkles className="h-4 w-4 text-[#f59e0b]" />
                <span>Tersedia Kelas Online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MAP STAGE */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Checker Control Panel */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <CoverageLocationChecker
                selectedAreaId={selectedAreaId}
                onSelectArea={handleSelectArea}
                userCoords={userCoords}
                onSetUserCoords={handleSetUserCoords}
                customAddressName={customAddressName}
              />
            </div>

            {/* Right Column: Leaflet Interactive Map */}
            <div className="lg:col-span-7 order-1 lg:order-2 h-[500px] sm:h-[620px]">
              <CoverageMap
                selectedAreaId={selectedAreaId}
                onSelectArea={handleSelectArea}
                userCoords={userCoords}
                onMapClick={handleMapClick}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ZONE BREAKDOWN CARDS */}
      <CoverageAreaCards
        selectedAreaId={selectedAreaId}
        onSelectArea={handleSelectArea}
      />

      {/* TUTORS SHOWCASE */}
      <CoverageTutorList />

      {/* FAQ */}
      <CoverageFaq />

      {/* BOTTOM CTA BANNER */}
      <section className="border-t-2 border-[#d9d2c2] bg-[#2e4b7a] py-14 sm:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-10">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#f2c14e]">
            Mulai Belajar Bersama Kami
          </span>
          <h2 className="mt-3 font-display text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Siap Memulai Langkah Pertama Anak Anda?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#d9e5f1] max-w-2xl mx-auto leading-relaxed">
            Konsultasikan kebutuhan belajar, tentukan jadwal les yang paling nyaman, dan dapatkan tentor yang sabar serta pas untuk karakter belajar anak Anda.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/course/program"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#f2c14e] px-7 py-3.5 text-sm font-extrabold text-[#14233a] shadow-[0_4px_0_#b88a1e] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Pilih Program & Hitung Biaya
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={generalWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-7 py-3.5 text-sm font-extrabold text-white backdrop-blur-xs transition hover:bg-white/20 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4 text-[#4ade80]" />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />
    </main>
  );
}

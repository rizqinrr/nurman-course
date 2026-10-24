import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from "next/font/google";
import Landing2Nav from "@/components/landing2/Landing2Nav";
import Landing2Hero from "@/components/landing2/Landing2Hero";
import Landing2Facts from "@/components/landing2/Landing2Facts";
import Landing2PathChoice from "@/components/landing2/Landing2PathChoice";
import CourseCatalogInteractive from "@/components/landing2/CourseCatalogInteractive";
import PrivateTutoringSection from "@/components/landing2/PrivateTutoringSection";
import VennBridgeSection from "@/components/landing2/VennBridgeSection";
import FaqInteractiveSection from "@/components/landing2/FaqInteractiveSection";
import Landing2Cta from "@/components/landing2/Landing2Cta";
import Landing2Footer from "@/components/landing2/Landing2Footer";
import "./landing-interactive.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-learn-display" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-learn-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-learn-mono" });

export const metadata: Metadata = {
  title: "nCourse — Belajar Mandiri Bikin Web & Les Privat",
  description:
    "Bikin website & aplikasi dari nol. Dilengkapi les privat Calistung, Ngaji & Komputer Dasar dengan laporan harian untuk orang tua di Cilacap.",
};

export default function RootLandingPage() {
  return (
    <main
      className={`landing-hybrid ${display.variable} ${body.variable} ${mono.variable} min-h-screen text-[#2b3a4a] antialiased selection:bg-[#4a70a9]/20 selection:text-[#14233a]`}
    >
      <Landing2Nav />
      <Landing2Hero />
      <Landing2Facts />
      <Landing2PathChoice />
      <CourseCatalogInteractive />
      <PrivateTutoringSection />
      <VennBridgeSection />
      <FaqInteractiveSection />
      <Landing2Cta />
      <Landing2Footer />
    </main>
  );
}

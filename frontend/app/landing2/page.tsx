import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
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

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-host-grotesk",
});

export const metadata: Metadata = {
  title: "Nurman Course — Belajar Mandiri Bikin Web & Les Privat",
  description:
    "Bikin website & aplikasi dari nol. Dilengkapi les privat Calistung, Ngaji & Komputer Dasar dengan laporan harian untuk orang tua di Cilacap.",
};

export default function Landing2Page() {
  return (
    <main
      className={`${hostGrotesk.className} min-h-screen bg-[#f7f9f8] text-[#243c4c] antialiased selection:bg-[#3f7499]/20 selection:text-[#243c4c]`}
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

import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from "next/font/google";
import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import LandingStats from "@/components/landing/LandingStats";
import LandingAbout from "@/components/landing/LandingAbout";
import LandingCategories from "@/components/landing/LandingCategories";
import LandingTutors from "@/components/landing/LandingTutors";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingCta from "@/components/landing/LandingCta";
import LandingFooter from "@/components/landing/LandingFooter";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-learn-display" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-learn-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-learn-mono" });

export const metadata: Metadata = {
  title: "Nurman Course | Les Privat SD–SMP",
  description: "Les privat online & offline untuk SD–SMP. Pilih program, atur jadwal, dan daftar lewat WhatsApp.",
};

export default function LandingPage() {
  return (
    <main className={`landing-hybrid ${display.variable} ${body.variable} ${mono.variable} min-h-screen text-[#2b3a4a] antialiased`}>
      <LandingNav />
      <LandingHero />
      <LandingStats />
      <LandingAbout />
      <LandingCategories />
      <LandingTutors />
      <LandingTestimonials />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}

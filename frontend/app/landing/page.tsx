import type { Metadata } from "next";
import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import LandingStats from "@/components/landing/LandingStats";
import LandingAbout from "@/components/landing/LandingAbout";
import LandingCategories from "@/components/landing/LandingCategories";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingCta from "@/components/landing/LandingCta";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Nurman Course | Les Privat SD–SMP",
  description:
    "Les privat online & offline untuk SD–SMP. Pilih program, atur jadwal, dan daftar lewat WhatsApp.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#4a70a9]/40 via-white to-white">
      <LandingNav />
      <LandingHero />
      <LandingStats />
      <LandingAbout />
      <LandingCategories />
      <LandingTestimonials />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}

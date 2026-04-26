"use client";

import { useEffect } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

export default function CoursePage() {
  const router = useRouter();
  const benefits = [
    "Guru berpengalaman",
    "Jadwal fleksibel",
    "Bisa online & offline (di rumah tentor / siswa)",
  ];

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartCourse = () => {
    router.push("/course/program");
  };

  return (
    <main>
      <div className="max-w-2xl mx-auto pt-4 sm:pt-8">
        {/* Hero Section */}
        <div className="mb-4 sm:mb-4">
          <div className="mb-2 flex justify-center sm:mb-1">
            <Image
              src="/Nlogo.png"
              alt="Logo Nurman Course"
              width={150}
              height={150}
              priority
              className="h-32 w-32 opacity-90 sm:h-28 sm:w-28"
            />
          </div>

          <GlassCard className="w-full p-8 sm:p-12  text-center max-w-lg mx-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#4a70a9] to-indigo-600 bg-clip-text text-transparent mb-4">
                  Nurman Course
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed">
                  Belajar dengan nyaman melalui les privat yang disesuaikan
                  dengan kebutuhan Anda
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartCourse}
                className="w-full pointer-events-auto inline-flex items-center justify-center gap-2"
              >
                <span>Mulai Belajar</span>
                <ArrowRight size={20} strokeWidth={2.25} aria-hidden="true" />
              </Button>
            </div>
          </GlassCard>

          <section
            className="mx-auto mt-8 max-w-lg sm:mt-12"
            aria-label="Keunggulan Nurman Course"
          >
            <div className="marquee">
              <div className="marquee-content">
                {[...benefits, ...benefits].map((benefit, index) => (
                  <div
                    key={`${benefit}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-gray-700 shadow-sm sm:gap-3 sm:text-base"
                  >
                    <CircleCheck
                      size={18}
                      strokeWidth={2.25}
                      className="shrink-0 text-[#4a70a9]"
                      aria-hidden="true"
                    />
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

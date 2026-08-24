"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  ChevronDown,
  CircleCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import SocialProof from "@/components/course/SocialProof";
import FeaturedPrograms from "@/components/course/FeaturedPrograms";
import Testimonials from "@/components/course/Testimonials";
import Reveal from "@/components/course/Reveal";
import TutorCarousel from "@/components/course/TutorCarousel";
import { tutors } from "@/data/landing";

export default function CoursePage() {
  const router = useRouter();
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showFloatingLogo, setShowFloatingLogo] = useState(false);

  const benefits = [
    "Guru berpengalaman",
    "Free konsultasi & trial session",
    "Jadwal fleksibel",
    "Bisa online & offline (di rumah tentor / siswa)",
    "Laporan progres belajar anak",
  ];

  const faqItems = [
    {
      question: "Bisa pilih jadwal belajar sendiri?",
      answer:
        "Bisa. Kamu bisa pilih hari dan jam yang paling cocok, lalu admin bantu finalisasi jadwal lewat WhatsApp.",
    },
    {
      question: "Les bisa online dan offline?",
      answer:
        "Untuk saat ini fokus utama masih les privat reguler. Opsi sesi online terpisah sedang disiapkan.",
    },
    {
      question: "Kalau berhalangan hadir, bisa reschedule?",
      answer:
        "Bisa, selama konfirmasi dilakukan lebih awal agar tim bisa menyesuaikan jadwal tutor dengan cepat.",
    },
    {
      question: "Tutor menyesuaikan level siswa?",
      answer:
        "Iya. Materi, kecepatan belajar, dan target latihan akan disesuaikan dari level dasar sampai lanjutan.",
    },
    {
      question: "Bagaimana proses pendaftarannya?",
      answer:
        "Pilih program, atur konfigurasi belajar, lalu lanjut ke WhatsApp untuk konfirmasi data dan jadwal akhir.",
    },
  ];

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingLogo(window.scrollY > 210);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartCourse = () => {
    router.push("/course/program");
  };

  const handleToggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main className="relative">
      <div
        className={`pointer-events-none fixed left-1/2 top-3 z-40 -translate-x-1/2 transition-all duration-500 ${
          showFloatingLogo
            ? "translate-y-0 opacity-100"
            : "-translate-y-6 opacity-0"
        }`}
      >
        <div className="rounded-full border border-white/60 bg-[#4a70a9]/45 p-0 shadow-[0_10px_30px_rgba(0,0,0,0.14)] backdrop-blur-xl">
          <Image
            src="/Nlogo.png"
            alt="Logo Nurman Course"
            width={42}
            height={42}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-2xl pt-4 sm:pt-8">
        {/* Hero Section */}
        <div className="mb-10 sm:mb-12">
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
            className="relative left-1/2 mt-8 w-screen -translate-x-1/2 sm:mt-12"
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

          <SocialProof />

          <section className="mx-auto mt-7 max-w-lg text-center">
            <button
              type="button"
              onClick={() => setIsOnlineModalOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/65 px-5 py-3 text-sm font-semibold text-[#3f5f93] shadow-lg backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              <CalendarClock size={18} strokeWidth={2.25} aria-hidden="true" />
              Jadwalkan Sesi Online
            </button>
            <p className="mt-2 text-xs text-gray-600 sm:text-sm">
              Fitur ini sedang disiapkan dan akan segera hadir.
            </p>
          </section>

          <FeaturedPrograms />

          <Reveal>
            <TutorCarousel tutors={tutors} />
          </Reveal>

          <Testimonials />

          <Reveal>
          <section
            className="mt-12 sm:mt-14"
            aria-label="Pertanyaan umum Nurman Course"
          >
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Pertanyaan Umum
            </h2>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Ringkasan hal yang paling sering ditanyakan sebelum mulai les.
            </p>

            <div className="mt-4 space-y-3">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <GlassCard
                    key={item.question}
                    className="overflow-hidden p-0"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(index)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-gray-900 sm:text-base">
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2.25}
                        className={`shrink-0 text-[#4a70a9] transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm text-gray-600 sm:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
          </Reveal>

          <footer className="pb-8 pt-12 text-center text-sm font-medium text-gray-500">
            @2026 Nurman Digital
          </footer>
        </div>
      </div>

      {isOnlineModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="online-session-title"
          onClick={() => setIsOnlineModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#4a70a9]/15 text-[#4a70a9]">
                <Sparkles size={20} strokeWidth={2.25} />
              </span>

              <button
                type="button"
                onClick={() => setIsOnlineModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500"
                aria-label="Tutup popup"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <h3
              id="online-session-title"
              className="text-xl font-bold text-gray-900 sm:text-2xl"
            >
              Sesi Online Belum Tersedia
            </h3>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Fitur jadwalkan kelas online masih dalam tahap pengembangan.
              Sementara ini pendaftaran tetap bisa dilanjutkan melalui alur
              program reguler.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsOnlineModalOpen(false)}
                className="flex-1"
              >
                Oke, Mengerti
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsOnlineModalOpen(false);
                  router.push("/course/program");
                }}
                className="flex-1"
              >
                Lanjut Pilih Program
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

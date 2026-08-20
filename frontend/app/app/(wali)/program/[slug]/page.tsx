"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Program,
  RoadmapStep,
  Progress,
  Enrollment,
  Session,
} from "@/data/lms";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import MarkdownContent from "@/components/ui/MarkdownContent";
import {
  ArrowLeft,
  Check,
  Play,
  Lock,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  MessageSquare,
  BookOpen,
  X,
} from "lucide-react";

interface ProgramDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface DbMurid {
  id: string;
  name: string;
  schoolLevel?: string | null;
}

interface DbProgress extends Progress {
  roadmapStep: RoadmapStep;
}

interface DbEnrollment extends Enrollment {
  program: Program;
}

const CATEGORY_LABELS: Record<string, string> = {
  materi: "Materi",
  jenjang: "Jenjang",
  calistung: "Calistung",
};

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const [loading, setLoading] = useState(true);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [activeModalStep, setActiveModalStep] = useState<RoadmapStep | null>(null);

  // States
  const [program, setProgram] = useState<Program | null>(null);
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMurid, setSelectedMurid] = useState<DbMurid | null>(null);
  const [enrollments, setEnrollments] = useState<DbEnrollment[]>([]);
  const [progresses, setProgresses] = useState<DbProgress[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMurid(meRes.user.murids[0]);
        }

        const [progsRes, enrollRes, progressRes, sessionsRes] = await Promise.all([
          apiFetch<{ programs: (Program & { roadmapSteps: RoadmapStep[] })[] }>("/api/programs"),
          apiFetch<{ enrollments: DbEnrollment[] }>("/api/me/enrollments"),
          apiFetch<{ progresses: DbProgress[] }>("/api/me/progresses"),
          apiFetch<{ sessions: Session[] }>("/api/me/sessions"),
        ]);

        const matchingProg = progsRes.programs.find((p) => p.slug === slug);
        if (matchingProg) {
          setProgram(matchingProg);
          setSteps(matchingProg.roadmapSteps || []);
        }

        setEnrollments(enrollRes.enrollments);
        setProgresses(progressRes.progresses);
        setSessions(sessionsRes.sessions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load program roadmap:", err);
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full flex-grow flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-sm font-semibold text-gray-600">Memuat detail program...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-8 text-center text-gray-500 max-w-md mx-auto">
        Program tidak ditemukan.
        <br />
        <Link href="/app/program" className="text-[#4a70a9] font-bold hover:underline mt-4 block">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isEnrolled = selectedMurid
    ? enrollments.some(
        (e) =>
          e.muridId === selectedMurid.id &&
          e.programId === program.id &&
          e.status === "active",
      )
    : false;

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  const handleRegisterWA = () => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo Admin Nurman Course, saya ingin mendaftarkan anak saya *${selectedMurid.name}* (${selectedMurid.schoolLevel || ""}) ke program *${program.name}*. Mohon informasi jadwal dan ketersediaan tutor. Terima kasih.`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  // Resolver step status
  const getStepProgressState = (stepOrder: number, stepId: string) => {
    if (!selectedMurid) return { isCompleted: false, isActive: false, isLocked: true };

    const activeEnrollment = enrollments.find(
      (e) => e.muridId === selectedMurid.id && e.programId === program.id && e.status === "active",
    );
    if (!activeEnrollment) {
      return { isCompleted: false, isActive: false, isLocked: true };
    }

    const completedProgress = progresses.some(
      (p) => p.muridId === selectedMurid.id && p.roadmapStepId === stepId && p.status === "completed",
    );

    const studentProgressesForProgram = progresses.filter(
      (p) => p.muridId === selectedMurid.id && p.roadmapStep.programId === program.id,
    );
    const completedStepIds = studentProgressesForProgram
      .filter((p) => p.status === "completed")
      .map((p) => p.roadmapStepId);

    const activeStep = sortedSteps.find((s) => !completedStepIds.includes(s.id)) || sortedSteps[sortedSteps.length - 1];

    const isCompleted = completedProgress;
    const isActive = activeStep?.id === stepId;
    const isLocked = !isCompleted && !isActive && stepOrder > (activeStep?.order || 0);

    return { isCompleted, isActive, isLocked };
  };

  const getOverallProgressStats = () => {
    if (!selectedMurid) return { currentStepOrder: 1, totalSteps: steps.length || 1, progressPercent: 0 };

    const studentProgressesForProgram = progresses.filter(
      (p) => p.muridId === selectedMurid.id && p.roadmapStep.programId === program.id,
    );
    const completedStepIds = studentProgressesForProgram
      .filter((p) => p.status === "completed")
      .map((p) => p.roadmapStepId);

    const activeStep = sortedSteps.find((s) => !completedStepIds.includes(s.id));
    const currentStepOrder = activeStep ? activeStep.order : steps.length || 1;
    const totalSteps = steps.length || 1;
    const progressPercent = Math.round(((currentStepOrder - 1) / totalSteps) * 100);

    return { currentStepOrder, totalSteps, progressPercent };
  };

  const getCompletedSessionsCount = () => {
    if (!selectedMurid) return 0;
    return sessions.filter(
      (s) => s.muridId === selectedMurid.id && s.programId === program.id && s.status === "completed",
    ).length;
  };

  const stats = getOverallProgressStats();
  const completedSessions = getCompletedSessionsCount();

  const toggleStep = (stepId: string, isLocked: boolean) => {
    if (isLocked) return;
    setExpandedStepId((prev) => (prev === stepId ? null : stepId));
  };

  const handleContactWA = (stepTitle: string, stepOrder: number) => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo Kak Kiki, saya wali murid dari *${selectedMurid.name}*. Ingin berkonsultasi mengenai materi belajar anak di langkah *${stepOrder}. ${stepTitle}* pada program *${program.name}*.`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full flex-grow flex flex-col gap-6 pb-12">
      {/* Back Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/40 border border-white/60 flex items-center justify-center text-gray-700 hover:bg-white/70 hover:text-gray-950 active:scale-90 shadow-sm transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            {isEnrolled ? "Peta Jalan Belajar Anak" : "Detail Program"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isEnrolled
              ? "Lacak posisi langkah dan capaian belajar buah hati Anda"
              : "Kenali program sebelum mendaftarkan buah hati Anda"}
          </p>
        </div>
      </header>

      {/* Child selector if multiple kids */}
      {murids.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-gray-500 shrink-0">Siswa:</span>
          <div className="flex gap-2">
            {murids.map((m) => {
              const isSelected = m.id === selectedMurid?.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMurid(m)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 active:scale-95 whitespace-nowrap border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#4a70a9] text-white border-[#4a70a9] shadow-md shadow-[#4a70a9]/30"
                      : "bg-white/50 border-white/70 text-gray-600 hover:bg-white/85"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!isEnrolled ? (
        <>
          {/* Program info card */}
          <GlassCard className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[#4a70a9] rounded-full text-[10px] font-bold uppercase">
                {CATEGORY_LABELS[program.category] || program.category}
              </span>
              {!program.active && (
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                  Coming Soon
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{program.name}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{program.description}</p>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200/50 pt-4 mt-1">
              {program.basePrice ? (
                <div className="bg-white/60 border border-gray-200/60 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Mulai dari
                  </div>
                  <div className="mt-0.5 text-base font-bold text-gray-800">
                    Rp {program.basePrice.toLocaleString("id-ID")}
                    <span className="text-xs font-semibold text-gray-400">/sesi</span>
                  </div>
                </div>
              ) : null}
              <div className="bg-white/60 border border-gray-200/60 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Jumlah Sesi
                </div>
                <div className="mt-0.5 text-base font-bold text-gray-800">
                  {program.sessionsPerBlock || 12}
                  <span className="text-xs font-semibold text-gray-400"> / blok</span>
                </div>
              </div>
              <div className="bg-white/60 border border-gray-200/60 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Peserta
                </div>
                <div className="mt-0.5 text-sm font-bold text-gray-800 truncate">
                  {selectedMurid?.name || "Belum dipilih"}
                </div>
              </div>
              <div className="bg-white/60 border border-gray-200/60 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Status
                </div>
                <div className="mt-0.5 text-sm font-bold text-emerald-700">Tersedia</div>
              </div>
            </div>
          </GlassCard>

          {/* Syllabus outline */}
          {sortedSteps.length > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-[#4a70a9]" />
                <h3 className="text-base font-bold text-gray-800">
                  Materi yang Akan Dipelajari
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {sortedSteps.map((step) => (
                  <GlassCard
                    key={step.id}
                    className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/45 hover:border-[#4a70a9]/25 active:scale-[0.99] transition-all"
                    onClick={() => setActiveModalStep(step)}
                  >
                    <span className="shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center text-xs font-bold">
                      {step.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-800">{step.title}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {step.bodyText.split("\n")[1] || step.bodyText}
                      </p>
                    </div>
                    {step.level ? (
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500">
                        {step.level}
                      </span>
                    ) : null}
                    <ChevronRight size={16} className="shrink-0 text-gray-400" />
                  </GlassCard>
                ))}
              </div>
            </section>
          )}

          {/* CTA for not enrolled */}
          <GlassCard className="mt-2 border-2 border-[#25D366]/25 bg-gradient-to-br from-emerald-50/60 to-white/50 shadow-lg shadow-emerald-500/10 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-base font-bold text-gray-800">
                Tertarik mendaftarkan {selectedMurid?.name || "anak Anda"}?
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {program.basePrice ? (
                  <>
                    Mulai dari{" "}
                    <strong className="text-gray-800">
                      Rp {program.basePrice.toLocaleString("id-ID")}/sesi
                    </strong>{" "}
                    — kami bantu siapkan jadwal & tutor terbaik.
                  </>
                ) : (
                  <span>Hubungi kami untuk info jadwal & biaya lengkap.</span>
                )}
              </p>
            </div>
            <Button
              onClick={handleRegisterWA}
              disabled={!selectedMurid || !program.active}
              className="w-full sm:w-auto justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm bg-[#25D366] hover:bg-[#1fb959] text-white border-none shadow-md shadow-[#25D366]/25 font-semibold"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Daftar Sekarang</span>
            </Button>
          </GlassCard>
        </>
      ) : (
        <>
          {/* Program Summary Card + Timeline (hanya untuk program ber-roadmap) */}
          {program.hasRoadmap ? (
            <>
              <GlassCard className="p-6 sm:p-8 flex flex-col gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[#4a70a9] rounded-full text-[10px] font-bold uppercase mb-2">
                    {program.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">{program.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Peserta: {selectedMurid?.name || "Belum dipilih"} ({selectedMurid?.schoolLevel || "Belum ditentukan"})
                  </p>
                </div>

                <div className="border-t border-gray-200/50 pt-4 mt-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-600 mb-1.5">
                    <span>
                      Langkah {stats.currentStepOrder} dari {stats.totalSteps} —{" "}
                      {sortedSteps[stats.currentStepOrder - 1]?.level || "Level Dasar"} (Sedang Ditempuh)
                    </span>
                    <span className="text-[#4a70a9] font-bold">{stats.progressPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-[#4a70a9] rounded-full transition-all duration-500"
                      style={{ width: `${stats.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </GlassCard>

              {/* Timeline Steps */}
              {sortedSteps.length > 0 ? (
                <section className="relative mt-2">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 -z-10"></div>
                  <div
                    className="absolute left-6 top-8 w-0.5 bg-[#4a70a9] -z-10 transition-all duration-500"
                    style={{ bottom: `${100 - stats.progressPercent}%` }}
                  ></div>

                  <div className="flex flex-col gap-6">
                    {sortedSteps.map((step) => {
                      const { isCompleted, isActive, isLocked } = getStepProgressState(step.order, step.id);
                      const isOpen = expandedStepId === step.id;

                      return (
                        <div key={step.id} className="flex gap-4 relative">
                          <div className="flex-shrink-0 w-12 flex justify-center pt-2">
                            {isCompleted && (
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                <Check size={16} strokeWidth={3} />
                              </div>
                            )}
                            {isActive && (
                              <div className="w-8 h-8 rounded-full bg-[#4a70a9] text-white flex items-center justify-center shadow-lg relative z-10 animate-pulse">
                                <Play size={14} fill="currentColor" className="ml-0.5" />
                              </div>
                            )}
                            {isLocked && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 border border-gray-300 flex items-center justify-center shadow-sm">
                                <Lock size={14} />
                              </div>
                            )}
                          </div>

                          <GlassCard
                            className={`flex-1 p-5 transition-all duration-300 ${
                              isActive ? "border-2 border-[#4a70a9] shadow-xl" : "opacity-80"
                            } ${!isLocked ? "cursor-pointer hover:bg-white/40" : ""}`}
                            onClick={() => toggleStep(step.id, isLocked)}
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h3 className="font-bold text-gray-800 text-sm sm:text-base text-left">
                                {step.order}. {step.title}
                              </h3>
                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isActive
                                      ? "bg-[#4a70a9]/10 text-[#4a70a9] border border-[#4a70a9]/20"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {step.level || "Dasar"}
                                </span>
                                {!isLocked && (
                                  <ChevronDown
                                    size={16}
                                    className={`text-gray-500 transition-transform duration-300 ${
                                      isOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                )}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 leading-relaxed text-left">
                              {step.bodyText.split("\n")[1] || step.bodyText}
                            </p>

                            {isOpen && (
                              <div
                                className="mt-4 pt-4 border-t border-gray-200/50 flex flex-col gap-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MarkdownContent text={step.bodyText} />
                                <div className="mt-2 flex justify-start">
                                  <Button
                                    variant="ghost"
                                    onClick={() => handleContactWA(step.title, step.order)}
                                    className="text-xs py-2 px-3 border border-[#4a70a9]/40 text-[#4a70a9] hover:bg-[#4a70a9]/5 flex items-center gap-1.5"
                                  >
                                    <MessageSquare size={14} />
                                    <span>Tanya Guru (WhatsApp)</span>
                                  </Button>
                                </div>
                              </div>
                            )}

                            {isLocked && (
                              <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-semibold cursor-not-allowed mt-2">
                                <Lock size={12} />
                                <span>Langkah Terkunci</span>
                              </div>
                            )}
                          </GlassCard>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : (
                <div className="text-center py-12 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
                  Belum ada modul peta jalan belajar ter-upload untuk program ini.
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
              Program ini tidak memiliki peta jalan belajar bertingkat.
            </div>
          )}

          {/* Bottom Actions (enrolled) */}
          <GlassCard className="mt-2 p-5 border border-gray-200/50 bg-white/40 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <CalendarDays size={16} className="text-[#4a70a9]" />
              <span>
                Sesi Selesai:{" "}
                <strong className="text-gray-800">
                  {completedSessions} dari {program.sessionsPerBlock || 12}
                </strong>{" "}
                Sesi
              </span>
            </div>
            <Link href="/app/jadwal" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="w-full text-xs justify-center py-2 border-[#4a70a9]/30 text-[#4a70a9] hover:bg-[#4a70a9]/5"
              >
                Lihat Laporan Riwayat Sesi
              </Button>
            </Link>
          </GlassCard>
        </>
      )}

      {/* Modal detail materi (belum terdaftar) */}
      {activeModalStep && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModalStep(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-gray-900">
                {activeModalStep.title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModalStep(null)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-gray-500 shadow-sm hover:bg-white active:scale-90 transition-all"
                aria-label="Tutup popup"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              <MarkdownContent text={activeModalStep.bodyText} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
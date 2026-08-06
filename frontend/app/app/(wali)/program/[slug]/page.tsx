"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Program,
  RoadmapStep,
  Progress,
  Enrollment,
  Session
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
  CalendarDays,
  MessageSquare
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

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const [loading, setLoading] = useState(true);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

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
        // Live mode
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMurid(meRes.user.murids[0]);
        }

        const [progsRes, enrollRes, progressRes, sessionsRes] = await Promise.all([
          apiFetch<{ programs: (Program & { roadmapSteps: RoadmapStep[] })[] }>("/api/programs"),
          apiFetch<{ enrollments: DbEnrollment[] }>("/api/me/enrollments"),
          apiFetch<{ progresses: DbProgress[] }>("/api/me/progresses"),
          apiFetch<{ sessions: Session[] }>("/api/me/sessions")
        ]);

        const matchingProg = progsRes.programs.find(p => p.slug === slug);
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
        <p className="text-sm font-semibold text-gray-600">Memuat peta jalan belajar...</p>
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

  // Resolver step status
  const getStepProgressState = (stepOrder: number, stepId: string) => {
    // Live mode resolver
    if (!selectedMurid) return { isCompleted: false, isActive: false, isLocked: true };

    const activeEnrollment = enrollments.find(e => e.muridId === selectedMurid.id && e.programId === program.id && e.status === "active");
    if (!activeEnrollment) {
      return { isCompleted: false, isActive: false, isLocked: true }; // locked if not enrolled
    }

    // Get all progresses for this student and step
    const completedProgress = progresses.some(p => p.muridId === selectedMurid.id && p.roadmapStepId === stepId && p.status === "completed");
    
    // Find current active step: first step that is not completed
    const studentProgressesForProgram = progresses.filter(p => p.muridId === selectedMurid.id && p.roadmapStep.programId === program.id);
    const completedStepIds = studentProgressesForProgram.filter(p => p.status === "completed").map(p => p.roadmapStepId);
    
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
    const activeStep = sortedSteps.find(s => !completedStepIds.includes(s.id)) || sortedSteps[sortedSteps.length - 1];

    const isCompleted = completedProgress;
    const isActive = activeStep?.id === stepId;
    const isLocked = !isCompleted && !isActive && stepOrder > (activeStep?.order || 0);

    return { isCompleted, isActive, isLocked };
  };

  const getOverallProgressStats = () => {
    // Live mode
    if (!selectedMurid) return { currentStepOrder: 1, totalSteps: steps.length || 1, progressPercent: 0 };
    
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
    const studentProgressesForProgram = progresses.filter(p => p.muridId === selectedMurid.id && p.roadmapStep.programId === program.id);
    const completedStepIds = studentProgressesForProgram.filter(p => p.status === "completed").map(p => p.roadmapStepId);
    
    const activeStep = sortedSteps.find(s => !completedStepIds.includes(s.id));
    const currentStepOrder = activeStep ? activeStep.order : (steps.length || 1);
    const totalSteps = steps.length || 1;
    const progressPercent = Math.round(((currentStepOrder - 1) / totalSteps) * 100);

    return { currentStepOrder, totalSteps, progressPercent };
  };

  const getCompletedSessionsCount = () => {
    if (!selectedMurid) return 0;
    return sessions.filter(s => s.muridId === selectedMurid.id && s.programId === program.id && s.status === "completed").length;
  };

  const stats = getOverallProgressStats();
  const completedSessions = getCompletedSessionsCount();

  const toggleStep = (stepId: string, isLocked: boolean) => {
    if (isLocked) return;
    setExpandedStepId(prev => prev === stepId ? null : stepId);
  };

  const handleContactWA = (stepTitle: string, stepOrder: number) => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo Kak Kiki, saya wali murid dari *${selectedMurid.name}*. Ingin berkonsultasi mengenai materi belajar anak di langkah *${stepOrder}. ${stepTitle}* pada program *${program.name}*.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full flex-grow flex flex-col gap-6 pb-44 md:pb-28">
      
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
            Peta Jalan Belajar Anak
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Lacak posisi langkah dan capaian belajar buah hati Anda
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
              Langkah {stats.currentStepOrder} dari {stats.totalSteps} — {steps[stats.currentStepOrder - 1]?.level || "Level Dasar"} (Sedang Ditempuh)
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
      {steps.length > 0 ? (
        <section className="relative mt-2">
          {/* Central Vertical Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 -z-10"></div>
          {/* Colored part for completed portion */}
          <div 
            className="absolute left-6 top-8 w-0.5 bg-[#4a70a9] -z-10 transition-all duration-500"
            style={{ bottom: `${100 - stats.progressPercent}%` }}
          ></div>

          <div className="flex flex-col gap-6">
            {steps.map((step) => {
              const { isCompleted, isActive, isLocked } = getStepProgressState(step.order, step.id);
              const isOpen = expandedStepId === step.id;

              return (
                <div key={step.id} className="flex gap-4 relative">
                  {/* Node Icon */}
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

                  {/* Content Box */}
                  <GlassCard 
                    className={`flex-1 p-5 transition-all duration-300 ${
                      isActive 
                        ? "border-2 border-[#4a70a9] shadow-xl" 
                        : "opacity-80"
                    } ${!isLocked ? "cursor-pointer hover:bg-white/40" : ""}`}
                    onClick={() => toggleStep(step.id, isLocked)}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base text-left">
                        {step.order}. {step.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isActive 
                            ? "bg-[#4a70a9]/10 text-[#4a70a9] border border-[#4a70a9]/20" 
                            : "bg-gray-100 text-gray-500"
                        }`}>
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

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-24 md:bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 py-4 px-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs sm:text-sm font-semibold text-gray-600 flex items-center gap-1.5">
            <CalendarDays size={16} className="text-[#4a70a9]" />
            <span>
              Sesi Selesai: <strong className="text-gray-800">{completedSessions} dari {program.sessionsPerBlock || 12}</strong> Sesi
            </span>
          </div>
          <Link href="/app/jadwal" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full text-xs justify-center py-2 border-[#4a70a9]/30 text-[#4a70a9] hover:bg-[#4a70a9]/5">
              Lihat Laporan Riwayat Sesi
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}

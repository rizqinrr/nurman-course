import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, ListChecks } from "lucide-react";
import ContentShell from "@/components/content/ContentShell";
import { getCourseDetail } from "@/lib/content-api";

export const revalidate = 60;

export default async function CourseDetail({ slug }: { slug: string }) {
  let course: Awaited<ReturnType<typeof getCourseDetail>>["data"] | null = null;
  try {
    const response = await getCourseDetail(slug);
    course = response.data;
  } catch {
    course = null;
  }

  if (!course) {
    return <ContentShell><main className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28"><h1 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-[#102d2b]">Kelas tidak ditemukan</h1><p className="mt-3 text-sm leading-6 text-[#42615b]">Kelas ini belum tersedia atau alamatnya sudah berubah.</p><Link href="/materi" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[#0e4d45] underline decoration-[#f0752d] underline-offset-4"><ArrowLeft size={16} /> Kembali ke materi</Link></main></ContentShell>;
  }

  const lessons = course.sections.flatMap((section) => section.lessons);
  const totalMinutes = lessons.reduce((total, lesson) => total + (lesson.estimatedMinutes ?? 10), 0);
  const firstLesson = lessons[0];
  const goals = lessons.slice(0, 3).map((lesson) => lesson.title) ?? [];

  return <ContentShell><main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14 lg:px-10"><Link href="/materi" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#0e4d45] underline decoration-[#f0752d] underline-offset-4"><ArrowLeft size={16} /> Semua materi</Link><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"><header className="paper-card sheet-rise border-2 border-[#d7d3c5] p-6 sm:p-9"><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center rounded-full border border-[#f6bd87] bg-[#fff0df] px-3 py-1 text-xs font-extrabold text-[#9a461f]">Kelas {course.level ?? "Pemula"} · Materi</span><span className="font-mono text-xs font-bold text-[#55716c]">{course.accessTier === "free" ? "GRATIS" : "BERBAYAR"}</span></div><h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.055em] text-[#102d2b] sm:text-6xl">{course.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[#42615b]">{course.description}</p><div className="mt-7 flex flex-wrap gap-4 border-t border-[#d7d3c5] pt-5 text-sm font-bold text-[#55716c]"><span className="inline-flex items-center gap-2"><BookOpen size={16} />{lessons.length} lesson</span><span className="inline-flex items-center gap-2"><Clock3 size={16} />{totalMinutes} menit</span></div></header>{goals.length > 0 && <aside className="rounded-2xl border-2 border-[#b7d2c4] bg-[#e0f0e7] p-5 sm:p-6"><div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#0e4d45]"><ListChecks size={16} />Yang akan dipelajari</div><ul className="mt-5 space-y-4">{goals.map((goal) => <li key={goal} className="flex gap-3 text-sm leading-6 text-[#294d48]"><Check className="mt-1 shrink-0 text-[#f0752d]" size={16} strokeWidth={3} />{goal}</li>)}</ul>{firstLesson && <Link href={`/materi/${firstLesson.slug}`} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f0752d] px-4 text-sm font-extrabold text-white shadow-[0_3px_0_#833c21] transition-transform hover:-translate-y-0.5">Mulai dari awal <ArrowRight size={16} /></Link>}</aside>}</div><div className="mt-12"><h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#102d2b]">Daftar materi</h2><ol className="mt-6 space-y-4">{course.sections.map((section) => <li key={section.order}><div className="mb-3 flex items-center gap-2"><span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#f0752d]">Bagian {section.order}</span><span className="font-display text-xl font-extrabold text-[#102d2b]">{section.title}</span></div><ol className="space-y-3">{section.lessons.map((lesson, index) => <LessonRow key={lesson.slug} lesson={lesson} index={index + 1} accent="teal" />)}</ol></li>)}</ol></div></main></ContentShell>;
}

function lessonAccent(accent: "teal" | "orange" | "yellow") {
  return accent === "orange" ? "border-[#f6bd87] bg-[#fff0df] text-[#9a461f]" : accent === "yellow" ? "border-[#dfc96a] bg-[#fff6c9] text-[#665311]" : "border-[#acd0be] bg-[#e0f0e7] text-[#0e4d45]";
}

function LessonRow({ lesson, index, accent }: { lesson: { slug: string; title: string; summary: string | null; estimatedMinutes: number | null }; index: number; accent: "teal" | "orange" | "yellow" }) {
  return <li><Link href={`/materi/${lesson.slug}`} className="group flex min-h-24 items-start gap-4 rounded-2xl border-2 border-[#d7d3c5] bg-[#fffdf8] p-4 transition-transform hover:-translate-y-0.5 hover:border-[#b7d2c4] sm:items-center sm:p-5"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 font-mono text-sm font-bold ${lessonAccent(accent)}`}>{String(index).padStart(2, "0")}</span><span className="min-w-0 flex-1"><strong className="font-display text-lg font-extrabold leading-tight text-[#102d2b] sm:text-xl">{lesson.title}</strong><span className="mt-1 block text-sm leading-6 text-[#55716c]">{lesson.summary}</span></span><span className="hidden shrink-0 items-center gap-2 font-mono text-xs font-bold text-[#55716c] sm:flex"><Clock3 size={14} />{lesson.estimatedMinutes ?? 10} min<ArrowRight className="ml-2 text-[#f0752d] transition-transform group-hover:translate-x-1" size={17} /></span></Link></li>;
}
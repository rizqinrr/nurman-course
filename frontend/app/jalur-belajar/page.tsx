"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, CircleAlert, Clock3, Route } from "lucide-react";
import type { CatalogCourseDetailDto, CatalogLessonOutlineDto } from "@nurman-course/shared";
import ContentShell from "@/components/content/ContentShell";
import { getCoursePaths, getMyLessonProgress } from "@/lib/content-api";

export default function LearningPathPage() {
  const [courses, setCourses] = useState<CatalogCourseDetailDto[]>([]);
  const [serverProgress, setServerProgress] = useState<string[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const completedSlugs = serverProgress;

  useEffect(() => {
    let active = true;
    getCoursePaths().then((response) => {
      if (!active) return;
      setCourses(response.data);
      setState("ready");
    }).catch(() => {
      if (active) setState("error");
    });
    getMyLessonProgress().then((response) => {
      if (active) setServerProgress(response.data.completedLessonSlugs);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  if (state === "loading") return <ContentShell><PathState title="Menyiapkan jalur belajar" message="Sebentar, kami menyusun materi yang sudah dipublikasikan." /></ContentShell>;
  if (state === "error") return <ContentShell><PathState title="Jalur belajar belum dapat dimuat" message="Pastikan backend aktif, lalu coba muat ulang halaman." /></ContentShell>;

  const allLessons = courses.flatMap((course) => course.sections.flatMap((section) => section.lessons));
  const totalMinutes = allLessons.reduce((total, lesson) => total + (lesson.estimatedMinutes ?? 10), 0);
  const firstLesson = allLessons[0];

  return <ContentShell><main>
    <section className="pegboard-hero overflow-hidden"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_23rem] lg:px-10 lg:py-24">
      <div className="max-w-3xl"><p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#f9b36c]">Jalur belajar terpandu</p><h1 className="mt-5 max-w-3xl font-display text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] text-[#f5f0e7] sm:text-7xl">Mulai coding tanpa bingung.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[#d4e5d7] sm:text-lg">Ikuti course dan lesson yang sudah dipublikasikan dari backend. Progress akunmu akan tersimpan saat login.</p><div className="mt-8 flex flex-wrap gap-3">{firstLesson && <Link href={`/materi/${firstLesson.slug}`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#f0752d] px-5 text-sm font-extrabold text-white shadow-[0_4px_0_#833c21] transition-transform hover:-translate-y-0.5">Mulai dari langkah 1 <ArrowRight size={17} /></Link>}<Link href="/materi" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#7fb59b] px-5 text-sm font-extrabold text-[#e5f2e7] hover:bg-[#24655a]">Jelajahi katalog bebas</Link></div></div>
      <div className="self-end rounded-2xl border border-[#78a990] bg-[#173f39]/80 p-5 text-[#e8f3e8] shadow-[0_14px_40px_rgba(0,0,0,.12)]"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#f9b36c]">Jalur tersedia</span><span className="font-mono text-xs text-[#b6d4bd]">{String(courses.length).padStart(2, "0")} course</span></div><div className="mt-6 space-y-4">{courses.slice(0, 4).map((course, index) => <div key={course.slug} className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-[#f9b36c] font-mono text-xs font-bold text-[#f9b36c]">{index + 1}</span><Route size={16} className="text-[#a8d0b3]" aria-hidden="true" /><span className="text-sm font-bold">{course.title}</span></div>)}</div><p className="mt-6 border-t border-[#78a990]/50 pt-4 text-xs leading-5 text-[#b6d4bd]">Urutan berasal dari Course dan Section yang aktif di backend.</p></div>
    </div></section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10"><div className="flex flex-col gap-6 border-b-2 border-[#cdd9cd] pb-7 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-4xl font-extrabold tracking-[-0.05em] text-[#102d2b] sm:text-5xl">Ambil satu jalur. Mulai praktik.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#42615b]">Course draft atau nonaktif tidak ditampilkan. Lesson berbayar tetap mengikuti access guard backend.</p></div><div className="flex items-center gap-2 font-mono text-xs font-bold text-[#55716c]"><Clock3 size={15} />{allLessons.length} lesson · {totalMinutes} menit</div></div>{courses.map((course, index) => <CourseSection key={course.slug} course={course} index={index} completedSlugs={completedSlugs} />)}{courses.length === 0 && <PathState title="Belum ada jalur yang dipublikasikan" message="Admin atau tentor dapat menyiapkan Course melalui authoring API." />}</section>
  </main></ContentShell>;
}

function CourseSection({ course, index, completedSlugs }: { course: CatalogCourseDetailDto; index: number; completedSlugs: string[] }) {
  const lessons = course.sections.flatMap((section) => section.lessons);
  const completedCount = lessons.filter((lesson) => completedSlugs.includes(lesson.slug)).length;
  const firstUnfinished = lessons.find((lesson) => !completedSlugs.includes(lesson.slug)) ?? lessons[0];

  return <div className="mt-10"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#f0752d] font-mono text-sm font-bold text-[#f0752d]">{String(index + 1).padStart(2, "0")}</span><div><h3 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-[#102d2b]">{course.title}</h3><p className="text-xs font-semibold text-[#55716c]">{lessons.length} lesson · {completedCount}/{lessons.length} selesai</p></div></div><Link href={`/kelas/${course.slug}`} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-extrabold text-[#0e4d45] underline decoration-[#f0752d] underline-offset-4">Lihat detail <ArrowRight size={15} /></Link></div><ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{lessons.map((lesson) => <LessonPathCard key={lesson.slug} lesson={lesson} done={completedSlugs.includes(lesson.slug)} isNext={lesson.slug === firstUnfinished?.slug} />)}</ol></div>;
}

function LessonPathCard({ lesson, done, isNext }: { lesson: CatalogLessonOutlineDto; done: boolean; isNext: boolean }) {
  return <li><Link href={`/materi/${lesson.slug}`} className={`group flex h-full min-h-24 flex-col justify-between rounded-2xl border-2 p-4 transition-transform hover:-translate-y-0.5 ${isNext ? "border-[#f0752d] bg-[#fffdf8] shadow-[0_3px_0_#b9481b]" : "border-[#d7d3c5] bg-[#fffdf8] hover:border-[#b7d2c4]"}`}><div><div className="flex items-center justify-between gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.06em] ${done ? "bg-[#0e4d45] text-white" : "bg-[#e0f0e7] text-[#0e4d45]"}`}>{done ? <Check size={12} strokeWidth={3} /> : <BookOpen size={12} />}{done ? "Selesai" : lesson.accessRequirement === "public" ? "Publik" : lesson.accessRequirement === "login" ? "Login" : "Berbayar"}</span><span className="font-mono text-[0.65rem] font-bold text-[#55716c]">{lesson.estimatedMinutes ?? 10} min</span></div><strong className="mt-3 block font-display text-lg font-extrabold leading-tight text-[#102d2b]">{lesson.title}</strong><p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[#55716c]">{lesson.summary}</p></div>{isNext && !done && <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#f0752d]">Lanjutkan di sini <ArrowRight size={14} /></span>}</Link></li>;
}

function PathState({ title, message }: { title: string; message: string }) {
  return <main className="mx-auto max-w-2xl px-4 py-24 text-center"><CircleAlert className="mx-auto text-[#55716c]" size={32} /><h1 className="mt-5 font-display text-4xl font-extrabold text-[#102d2b]">{title}</h1><p className="mt-3 text-sm leading-6 text-[#42615b]">{message}</p></main>;
}

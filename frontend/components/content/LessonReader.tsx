"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, List, LockKeyhole, RotateCcw } from "lucide-react";
import type { ReaderLessonDto } from "@nurman-course/shared";
import { ApiFetchError } from "@/lib/api";
import { getReaderLesson, updateLessonProgress } from "@/lib/content-api";
import SafeMarkdown, { headingId } from "@/components/content/SafeMarkdown";

type ReaderState = "loading" | "ready" | "login" | "purchase" | "not-found" | "error";

export default function LessonReaderPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<ReaderLessonDto | null>(null);
  const [state, setState] = useState<ReaderState>("loading");
  const [saving, setSaving] = useState(false);
  const completed = lesson?.completed ?? false;

  useEffect(() => {
    let active = true;
    getReaderLesson(slug).then((result) => {
      if (!active) return;
      setLesson(result.data);
      setState("ready");
    }).catch((error: unknown) => {
      if (!active) return;
      const apiError = error instanceof ApiFetchError ? error : null;
      if (apiError?.status === 401 || apiError?.code === "LOGIN_REQUIRED") setState("login");
      else if (apiError?.status === 403 || apiError?.code === "PURCHASE_REQUIRED") setState("purchase");
      else if (apiError?.status === 404) setState("not-found");
      else setState("error");
    });
    return () => { active = false; };
  }, [slug]);

  const toggleCompleted = async () => {
    if (saving) return;
    setSaving(true);
    const next = !completed;
    try {
      await updateLessonProgress(slug, next);
      setLesson((current) => current ? { ...current, completed: next } : current);
    } catch (error) {
      if (error instanceof ApiFetchError && error.status === 401) {
        router.push(`/login?next=${encodeURIComponent(`/materi/${slug}`)}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (state === "loading") return <ReaderState title="Menyiapkan lesson" message="Sebentar, kami memuat materi dengan aman." />;
  if (state === "not-found") return <ReaderState title="Lesson tidak ditemukan" message="Lesson ini belum tersedia atau alamatnya sudah berubah." />;
  if (state === "error") return <ReaderState title="Lesson belum dapat dimuat" message="Coba muat ulang halaman ini." />;
  if (state === "login" || state === "purchase") return <PaywallState kind={state} slug={slug} />;
  if (!lesson) return null;

  const headings = lesson.bodyText.split("\n").map((line) => line.match(/^#{2,3}\s+(.+)$/)?.[1]).filter((value): value is string => Boolean(value));

  return <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-12 lg:px-10"><nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#55716c]"><Link href="/materi" className="underline decoration-[#f0752d] underline-offset-4 hover:text-[#0e4d45]">Materi</Link><span aria-hidden="true">/</span><Link href={`/kelas/${lesson.breadcrumb.courseSlug}`} className="underline decoration-[#f0752d] underline-offset-4 hover:text-[#0e4d45]">{lesson.breadcrumb.courseTitle}</Link></nav><div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,46rem)_15rem] lg:items-start"><article className="min-w-0 rounded-2xl border-2 border-[#d7d3c5] bg-[#fffdf8] px-5 py-7 shadow-[0_18px_34px_-24px_rgba(16,45,43,.45)] sm:px-9 sm:py-10"><header className="border-b-2 border-[#e2ddcf] pb-7"><div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold text-[#55716c]"><span className="rounded-full border border-[#acd0be] bg-[#e0f0e7] px-3 py-1 text-[#0e4d45]">{lesson.breadcrumb.sectionTitle}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={14} />{lesson.estimatedMinutes ?? 10} menit</span></div><h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1] tracking-[-0.05em] text-[#102d2b] sm:text-5xl">{lesson.title}</h1>{lesson.summary && <p className="mt-4 max-w-2xl text-base leading-7 text-[#42615b]">{lesson.summary}</p>}</header><div className="mt-8"><SafeMarkdown>{lesson.bodyText}</SafeMarkdown></div><div className="mt-12 border-t-2 border-[#e2ddcf] pt-6"><button type="button" onClick={toggleCompleted} disabled={saving} aria-pressed={completed} className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-extrabold transition-colors disabled:opacity-60 sm:w-auto ${completed ? "border-[#0e4d45] bg-[#0e4d45] text-white" : "border-[#b7d2c4] bg-[#e0f0e7] text-[#0e4d45] hover:border-[#0e4d45]"}`}>{completed ? <Check size={18} strokeWidth={3} /> : <span className="h-4 w-4 rounded-full border-2 border-current" />}{saving ? "Menyimpan..." : completed ? "Lesson selesai" : "Tandai sudah selesai"}</button>{completed && <p role="status" className="mt-3 flex items-center gap-2 text-xs font-bold text-[#55716c]"><RotateCcw size={14} />Klik lagi jika ingin membatalkan.</p>}</div><nav aria-label="Navigasi lesson" className="mt-8 grid gap-3 border-t-2 border-[#e2ddcf] pt-6 sm:grid-cols-2">{lesson.previousSlug ? <Link href={`/materi/${lesson.previousSlug}`} className="group flex min-h-16 items-center gap-3 rounded-xl border-2 border-[#d7d3c5] px-4 py-3 text-left hover:border-[#b7d2c4]"><ArrowLeft className="shrink-0 text-[#f0752d] transition-transform group-hover:-translate-x-1" size={18} /><span><span className="block font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#55716c]">Sebelumnya</span></span></Link> : <Link href={`/kelas/${lesson.breadcrumb.courseSlug}`} className="group flex min-h-16 items-center gap-3 rounded-xl border-2 border-[#d7d3c5] px-4 py-3 text-left hover:border-[#b7d2c4]"><ArrowLeft className="shrink-0 text-[#f0752d] transition-transform group-hover:-translate-x-1" size={18} /><span><span className="block font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#55716c]">Kembali</span></span></Link>}{lesson.nextSlug ? <Link href={`/materi/${lesson.nextSlug}`} className="group flex min-h-16 items-center justify-between gap-3 rounded-xl bg-[#f0752d] px-4 py-3 text-white shadow-[0_3px_0_#b9481b]"><span><span className="block font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#ffe0c7]">Selanjutnya</span></span><ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" size={18} /></Link> : <Link href="/materi" className="group flex min-h-16 items-center justify-between gap-3 rounded-xl bg-[#0e4d45] px-4 py-3 text-white shadow-[0_3px_0_#082e2a]"><span><span className="block font-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#b6d4bd]">Jalur selesai</span></span><ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" size={18} /></Link>}</nav></article><aside className="hidden lg:sticky lg:top-28 lg:block"><div className="rounded-2xl border-2 border-[#b7d2c4] bg-[#e0f0e7] p-5"><div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#0e4d45]"><List size={15} />Di lesson ini</div>{headings.length > 0 ? <ol className="mt-4 space-y-3">{headings.map((heading) => <li key={heading}><a href={`#${headingId(heading)}`} className="block text-sm font-semibold leading-5 text-[#42615b] hover:text-[#0e4d45] hover:underline hover:decoration-[#f0752d] hover:underline-offset-4">{heading}</a></li>)}</ol> : <p className="mt-4 text-sm leading-6 text-[#42615b]">Lesson singkat ini dapat dibaca langsung sampai selesai.</p>}<div className="mt-6 border-t border-[#acd0be] pt-4"><p className="font-mono text-xs font-bold text-[#55716c]">{lesson.readCount} kali dibaca</p></div></div></aside></div></main>;
}

function ReaderState({ title, message }: { title: string; message: string }) {
  return <main className="mx-auto max-w-2xl px-4 py-24 text-center"><CircleAlert className="mx-auto text-[#55716c]" size={32} /><h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.04em] text-[#102d2b]">{title}</h1><p className="mt-3 text-sm leading-6 text-[#42615b]">{message}</p><Link href="/materi" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[#0e4d45] underline decoration-[#f0752d] underline-offset-4">Kembali ke materi <ArrowRight size={16} /></Link></main>;
}

function PaywallState({ kind, slug }: { kind: "login" | "purchase"; slug: string }) {
  return <main className="mx-auto max-w-xl px-4 py-24 text-center"><LockKeyhole className="mx-auto text-[#0e4d45]" size={34} /><h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.04em] text-[#102d2b]">{kind === "login" ? "Masuk untuk membaca" : "Akses kelas ini dengan pembelian"}</h1><p className="mt-3 text-sm leading-6 text-[#42615b]">{kind === "login" ? "Lesson ini tersedia untuk pengguna yang sudah login." : "Lesson ini termasuk kelas berbayar. Hubungi kami untuk aktivasi akses."}</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">{kind === "login" && <Link href={`/login?next=${encodeURIComponent(`/materi/${slug}`)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0e4d45] px-5 text-sm font-bold text-white hover:bg-[#0a382f]">Masuk sekarang</Link>}<Link href="/materi" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#b7c7d8] px-5 text-sm font-bold text-[#0e4d45]">Jelajahi materi lain</Link></div></main>;
}

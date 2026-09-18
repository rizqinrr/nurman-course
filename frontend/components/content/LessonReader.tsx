"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, LockKeyhole } from "lucide-react";
import type { ReaderLessonDto } from "@nurman-course/shared";
import { ApiFetchError } from "@/lib/api";
import { getReaderLesson, updateLessonProgress } from "@/lib/content-api";
import { safeReturnPath } from "@/lib/navigation";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import SafeMarkdown, { headingId } from "@/components/content/SafeMarkdown";

export default function LessonReaderPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<ReaderLessonDto | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "login" | "purchase" | "not-found" | "error">("loading");
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const headings = lesson?.bodyText.split("\n").map((line) => line.match(/^#{2,3}\s+(.+)$/)?.[1]).filter((value): value is string => Boolean(value)) ?? [];

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
      else { setState("error"); setMessage(error instanceof Error ? error.message : "Lesson belum dapat dimuat."); }
    });
    return () => { active = false; };
  }, [slug]);

  const markCompleted = async () => {
    if (!lesson || saving) return;
    setSaving(true);
    try {
      await updateLessonProgress(lesson.slug, !completed);
      setCompleted((value) => !value);
    } catch (error) {
      if (error instanceof ApiFetchError && error.status === 401) {
        router.push(`/login?next=${encodeURIComponent(`/materi/${lesson.slug}`)}`);
        return;
      }
      setMessage("Progress belum tersimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (state === "loading") return <ReaderState title="Menyiapkan lesson" message="Sebentar, kami memuat materi dengan aman." />;
  if (state === "not-found") return <ReaderState title="Lesson tidak ditemukan" message="Lesson ini belum dipublikasikan atau sudah tidak tersedia." />;
  if (state === "error") return <ReaderState title="Lesson belum dapat dimuat" message={message} />;
  if (state === "login" || state === "purchase") return <PaywallState kind={state} slug={slug} />;
  if (!lesson) return null;

  return <main className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,46rem)_15rem] lg:px-8"><article className="min-w-0"><Link href={`/kelas/${encodeURIComponent(lesson.breadcrumb.courseSlug)}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#294d7e]"><ArrowLeft size={16} /> {lesson.breadcrumb.courseTitle}</Link><header className="mt-10 border-b border-[#d8d0c3] pb-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c746b]">{lesson.breadcrumb.sectionTitle}</p><h1 className="mt-3 font-playfair text-4xl leading-tight tracking-[-0.03em] text-[#17283e] sm:text-5xl">{lesson.title}</h1>{lesson.summary && <p className="mt-4 text-base leading-7 text-[#66716b]">{lesson.summary}</p>}</header><div className="mt-10"><SafeMarkdown>{lesson.bodyText}</SafeMarkdown></div><div className="mt-12 flex flex-col gap-4 border-t border-[#d8d0c3] pt-6 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={markCompleted} disabled={saving} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold transition disabled:opacity-50 ${completed ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-[#b7c7d8] bg-[#eef2f6] text-[#294d7e] hover:bg-[#e1e9f2]"}`}>{completed ? <Check size={17} /> : <span className="h-4 w-4 rounded-full border-2 border-current" />} {saving ? "Menyimpan..." : completed ? "Sudah selesai" : "Tandai selesai"}</button><div className="flex items-center justify-between gap-3 sm:justify-end">{lesson.previousSlug ? <Link href={`/materi/${encodeURIComponent(lesson.previousSlug)}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#294d7e] hover:bg-[#eef2f6]"><ArrowLeft size={16} /> Sebelumnya</Link> : <span />}{lesson.nextSlug && <Link href={`/materi/${encodeURIComponent(lesson.nextSlug)}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#294d7e] px-4 text-sm font-bold text-white hover:bg-[#1f3c64]">Berikutnya <ArrowRight size={16} /></Link>}</div></div></article><aside className="hidden lg:block"><nav aria-label="Daftar isi lesson" className="sticky top-24 border-l border-[#d8d0c3] pl-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6c746b]">Di lesson ini</p>{headings.length > 0 ? <ol className="mt-4 space-y-3">{headings.map((heading) => <li key={heading}><a href={`#${headingId(heading)}`} className="text-sm leading-5 text-[#526478] hover:text-[#294d7e] hover:underline hover:underline-offset-4">{heading}</a></li>)}</ol> : <p className="mt-3 text-sm font-semibold leading-6 text-[#294d7e]">{lesson.breadcrumb.sectionTitle}</p>}<p className="mt-6 text-xs leading-5 text-[#79827c]">Gunakan tombol sebelumnya dan berikutnya untuk menjaga alur belajar.</p></nav></aside></main>;
}

function ReaderState({ title, message }: { title: string; message: string }) { return <main className="mx-auto max-w-2xl px-4 py-24 text-center"><CircleAlert className="mx-auto text-[#8090a2]" size={32} /><h1 className="mt-5 font-playfair text-4xl text-[#17283e]">{title}</h1><p className="mt-3 text-sm leading-6 text-[#66716b]">{message}</p><Link href="/materi" className="mt-6 inline-flex items-center gap-2 font-bold text-[#294d7e]">Kembali ke materi <ArrowRight size={16} /></Link></main>; }

function PaywallState({ kind, slug }: { kind: "login" | "purchase"; slug: string }) { const returnPath = safeReturnPath(`/materi/${slug}`) ?? "/materi"; return <main className="mx-auto max-w-xl px-4 py-24 text-center"><LockKeyhole className="mx-auto text-[#294d7e]" size={34} /><h1 className="mt-5 font-playfair text-4xl text-[#17283e]">{kind === "login" ? "Masuk untuk membaca" : "Akses kelas ini dengan pembelian"}</h1><p className="mt-3 text-sm leading-6 text-[#66716b]">{kind === "login" ? "Lesson ini tersedia untuk pengguna yang sudah login. Silakan masuk, lalu kami kembalikan ke lesson ini." : "Lesson ini termasuk kelas berbayar. Hubungi kami untuk proses pembelian dan aktivasi akses."}</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">{kind === "login" ? <Link href={`/login?next=${encodeURIComponent(returnPath)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#294d7e] px-5 text-sm font-bold text-white hover:bg-[#1f3c64]">Masuk sekarang</Link> : <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Halo Nurman Course, saya ingin membeli akses materi ${slug}.`)}`} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#294d7e] px-5 text-sm font-bold text-white hover:bg-[#1f3c64]">Tanya cara membeli</a>}<Link href="/materi" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#b7c7d8] px-5 text-sm font-bold text-[#294d7e]">Jelajahi materi lain</Link></div></main>; }

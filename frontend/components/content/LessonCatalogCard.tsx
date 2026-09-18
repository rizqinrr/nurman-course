"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Eye, FileCode2, MonitorCog, Wrench } from "lucide-react";
import type { CatalogLessonDto } from "@nurman-course/shared";

const topicStyles = {
  "lingkungan-coding": "border-[#acd0be] bg-[#e0f0e7] text-[#0e4d45]",
  tools: "border-[#f6bd87] bg-[#fff0df] text-[#9a461f]",
  html: "border-[#dfc96a] bg-[#fff6c9] text-[#665311]",
  css: "border-[#dfc96a] bg-[#fff6c9] text-[#665311]",
  javascript: "border-[#dfc96a] bg-[#fff6c9] text-[#665311]",
  web: "border-[#acd0be] bg-[#e0f0e7] text-[#0e4d45]",
  project: "border-[#f6bd87] bg-[#fff0df] text-[#9a461f]",
} as const;

const topicIcons = {
  "lingkungan-coding": MonitorCog,
  tools: Wrench,
  html: FileCode2,
  css: FileCode2,
  javascript: FileCode2,
  web: MonitorCog,
  project: FileCode2,
} as const;

function topicKey(value: string | null) {
  return value?.toLowerCase() ?? "web";
}

function formatReadCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(".0", "")} rb`;
  return String(count);
}

export default function LessonCatalogCard({ lesson }: { lesson: CatalogLessonDto }) {
  const key = topicKey(lesson.courseCategory);
  const Icon = topicIcons[key as keyof typeof topicIcons] ?? FileCode2;
  const style = topicStyles[key as keyof typeof topicStyles] ?? topicStyles.web;

  return <article className="paper-card group relative flex min-h-[20rem] flex-col overflow-hidden border-2 border-[#d7d3c5] p-5 sm:p-6"><div className={`absolute inset-x-0 top-0 h-2 ${key === "tools" || key === "project" ? "bg-[#f0752d]" : key === "html" || key === "css" || key === "javascript" ? "bg-[#d2ae2e]" : "bg-[#0e4d45]"}`} /><div className="flex items-start justify-between gap-3 pt-2"><span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold ${style}`}><Icon size={14} aria-hidden="true" />{lesson.courseCategory ?? "Materi"}</span><span className="font-mono text-[0.68rem] font-bold text-[#55716c]">{lesson.accessRequirement === "public" ? "PUBLIK" : lesson.accessRequirement === "login" ? "LOGIN" : "BERBAYAR"}</span></div><div className="mt-6 flex-1"><p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#55716c]">{lesson.courseTitle} · {lesson.courseLevel ?? "Pemula"}</p><h2 className="mt-2 font-display text-2xl font-extrabold leading-[1.04] tracking-[-0.04em] text-[#102d2b]"><Link href={`/materi/${lesson.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">{lesson.title}</Link></h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#42615b]">{lesson.summary}</p></div><div className="mt-6 border-t border-[#d7d3c5] pt-4"><div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.7rem] font-bold text-[#55716c]"><span className="inline-flex items-center gap-1.5"><Clock3 size={14} />{lesson.estimatedMinutes ?? 10} menit</span><span className="inline-flex items-center gap-1.5"><Eye size={14} />{formatReadCount(lesson.readCount)} dibaca</span></div><span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#0e4d45]">Mulai belajar <ArrowRight size={16} className="text-[#f0752d] transition-transform group-hover:translate-x-1" /></span></div></article>;
}

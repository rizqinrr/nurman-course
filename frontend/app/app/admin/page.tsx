"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CatalogLessonDto } from "@nurman-course/shared";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  GraduationCap,
  ListTodo,
  LogIn,
  Users,
} from "lucide-react";
import { getLessonCatalog } from "@/lib/content-api";
import { apiFetch } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";

interface AdminDashboardData {
  programsActive: number;
  muridsActive: number;
  tentorsActive: number;
  invoicesPending: number;
  sessionsToday: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    program?: { id: string; name: string } | null;
    murid?: { id: string; name: string } | null;
  }>;
}

interface TrackingEvent {
  id: string;
  eventType: "login" | "lesson_read";
  createdAt: string;
  user?: { id: string; name: string; role: string } | null;
  lesson?: { slug: string; title: string } | null;
}

interface TrackingResponse {
  data: {
    events: TrackingEvent[];
    pagination: { total: number };
  };
}

function RealtimeClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initTimer = setTimeout(() => setNow(new Date()), 0);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, []);

  if (!now) {
    return <div className="h-12 w-40 animate-pulse rounded-lg bg-[#dbe7f3]" aria-label="Memuat waktu" />;
  }

  const date = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  return (
    <div className="text-left sm:text-right">
      <p className="text-[11px] font-semibold capitalize text-[#657991]">{date}</p>
      <p className="mt-1 font-mono text-sm font-bold tabular-nums text-[#284970]">{time} WIB</p>
    </div>
  );
}

const quickLinks = [
  { label: "Tambah program", description: "Atur layanan dan harga", href: "/app/admin/program", icon: GraduationCap },
  { label: "Kelola murid", description: "Profil dan status belajar", href: "/app/admin/murid", icon: Users },
  { label: "Susun jadwal", description: "Pantau agenda les", href: "/app/admin/jadwal", icon: CalendarDays },
];

function eventTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Baru saja";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [popularLessons, setPopularLessons] = useState<CatalogLessonDto[]>([]);
  const [recentEvents, setRecentEvents] = useState<TrackingEvent[]>([]);
  const [trackingTotal, setTrackingTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [meRes, dashRes] = await Promise.all([
          apiFetch<{ user: { name: string } }>("/api/users/me"),
          apiFetch<{ data: AdminDashboardData }>("/api/admin/dashboard"),
        ]);
        if (!active) return;

        setAdminName(meRes.user.name || "Admin");
        const data = dashRes.data;
        setDashboard(data ? {
          ...data,
          sessionsToday: (data.sessionsToday || []).map((session) => ({
            ...session,
            startsAt: formatSessionDateTime(session.startsAt),
            endsAt: formatSessionDateTime(session.endsAt),
          })),
        } : null);

        const [trackingResult, lessonsResult] = await Promise.allSettled([
          apiFetch<TrackingResponse>("/api/admin/tracking?limit=5"),
          getLessonCatalog({ limit: 5 }),
        ]);
        if (!active) return;
        if (trackingResult.status === "fulfilled") {
          setRecentEvents(trackingResult.value.data.events || []);
          setTrackingTotal(trackingResult.value.data.pagination.total || 0);
        }
        if (lessonsResult.status === "fulfilled") {
          setPopularLessons(lessonsResult.value.data || []);
        }
      } catch (error) {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Data dashboard belum dapat dimuat.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[90rem] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
        <div className="h-32 animate-pulse rounded-xl bg-white" />
        <div className="grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-white" />)}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-white" />
      </div>
    );
  }

  const sessions = dashboard?.sessionsToday ?? [];
  const pending = dashboard?.invoicesPending ?? 0;
  const measures = [
    { label: "Program aktif", value: dashboard?.programsActive ?? 0, note: "di katalog", icon: GraduationCap, href: "/app/admin/program" },
    { label: "Murid aktif", value: dashboard?.muridsActive ?? 0, note: "sedang belajar", icon: Users, href: "/app/admin/murid" },
    { label: "Tentor aktif", value: dashboard?.tentorsActive ?? 0, note: "terdaftar", icon: Users, href: "/app/admin/tentor" },
    { label: "Perlu ditinjau", value: pending, note: "tagihan pending", icon: CreditCard, href: "/app/admin/tagihan", urgent: pending > 0 },
  ];

  return (
    <main className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <header className="flex flex-col justify-between gap-5 border-b border-[#d4dfeb] pb-7 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-[-0.04em] text-[#14233a] sm:text-3xl">Halo, {adminName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#657991]">Pantau aktivitas les, prioritaskan pekerjaan hari ini, dan jaga setiap layanan tetap siap berjalan.</p>
        </div>
        <RealtimeClock />
      </header>

      {errorMessage && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-lg border border-[#e6b5b5] bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#8d3d3d]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      )}

      <section aria-label="Ringkasan operasional" className="mt-6 grid overflow-hidden rounded-xl border border-[#cbd8e5] bg-white sm:grid-cols-2 lg:grid-cols-4">
        {measures.map((measure, index) => {
          const Icon = measure.icon;
          return (
            <Link key={measure.label} href={measure.href} className={`group flex min-h-28 items-start gap-3 p-4 transition-colors hover:bg-[#f4f8fc] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4a70a9] ${index > 0 ? "border-t border-[#dce5ee] sm:border-t-0 sm:border-l" : ""}`}>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${measure.urgent ? "bg-[#fff0cf] text-[#9a6817]" : "bg-[#e7eff7] text-[#4a70a9]"}`}><Icon size={18} aria-hidden="true" /></span>
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#71849a]">{measure.label}</span>
                <strong className={`mt-1 block text-2xl font-black tracking-[-0.04em] ${measure.urgent ? "text-[#9a6817]" : "text-[#14233a]"}`}>{measure.value}</strong>
                <span className="mt-1 block text-xs text-[#71849a]">{measure.note}</span>
              </span>
              <ArrowUpRight size={15} className="ml-auto text-[#9cb0c4] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          );
        })}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.8fr)]">
        <section aria-labelledby="agenda-title" className="overflow-hidden rounded-xl border border-[#cbd8e5] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#dce5ee] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="agenda-title" className="flex items-center gap-2 text-base font-black text-[#14233a]"><CalendarDays size={18} className="text-[#4a70a9]" aria-hidden="true" />Agenda hari ini</h2>
              <p className="mt-1 text-xs text-[#71849a]">Sesi yang perlu dipantau hari ini</p>
            </div>
            <Link href="/app/admin/jadwal" className="inline-flex min-h-9 items-center gap-1.5 self-start rounded-lg border border-[#cbd8e5] px-3 text-xs font-bold text-[#284970] hover:border-[#4a70a9] hover:bg-[#f4f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]">Buka jadwal <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
          {sessions.length > 0 ? (
            <div className="divide-y divide-[#e4ebf2]">
              {sessions.map((session) => {
                const time = session.startsAt.split(" • ")[1]?.replace(" WIB", "") || "Terjadwal";
                return (
                  <div key={session.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-28 items-center gap-2 text-xs font-bold tabular-nums text-[#4a70a9]"><Clock3 size={15} aria-hidden="true" />{time}</div>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#14233a]">{session.murid?.name || "Murid belum ditentukan"}</p><p className="mt-1 truncate text-xs text-[#71849a]">{session.program?.name || "Program belum ditentukan"}</p></div>
                    <span className={`inline-flex items-center gap-1.5 self-start rounded-md px-2.5 py-1 text-[11px] font-bold sm:self-auto ${session.status === "completed" ? "bg-[#e6f5eb] text-[#2c8150]" : "bg-[#e7eff7] text-[#38628f]"}`}>{session.status === "completed" ? <CheckCircle2 size={13} aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}{session.status === "completed" ? "Selesai" : "Terjadwal"}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#edf3f8] text-[#6a7f98]"><CalendarDays size={20} aria-hidden="true" /></span><h3 className="mt-4 text-sm font-bold text-[#14233a]">Belum ada sesi hari ini</h3><p className="mt-1 max-w-sm text-xs leading-5 text-[#71849a]">Agenda akan muncul di sini saat ada sesi belajar yang terjadwal.</p></div>
          )}
        </section>

        <aside aria-labelledby="attention-title" className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-[#cbd8e5] bg-[#14233a] text-white">
            <div className="border-b border-white/10 px-5 py-4"><h2 id="attention-title" className="flex items-center gap-2 text-base font-black"><ListTodo size={18} className="text-[#f2c14e]" aria-hidden="true" />Prioritas kerja</h2><p className="mt-1 text-xs text-[#aebdd1]">Titik yang paling cepat berdampak</p></div>
            <div className="divide-y divide-white/10">
              {pending > 0 ? <Link href="/app/admin/tagihan" className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f2c14e]"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f2c14e] text-[#14233a]"><CreditCard size={17} aria-hidden="true" /></span><span className="min-w-0 flex-1"><strong className="block text-sm">Tinjau tagihan</strong><span className="mt-1 block text-xs text-[#aebdd1]">{pending} invoice menunggu tindakan</span></span><ArrowUpRight size={16} className="text-[#aebdd1]" aria-hidden="true" /></Link> : <div className="flex items-center gap-3 px-5 py-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2e6b4b] text-[#baf0cc]"><CheckCircle2 size={17} aria-hidden="true" /></span><span><strong className="block text-sm">Tidak ada antrean kritis</strong><span className="mt-1 block text-xs text-[#aebdd1]">Semua tagihan sudah tertangani</span></span></div>}
              <Link href="/app/admin/enrollment" className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-[#dbe7f3] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f2c14e]"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-[#b8cbe0]"><ListTodo size={17} aria-hidden="true" /></span><span className="flex-1">Cek enrollment aktif</span><ArrowUpRight size={16} className="text-[#aebdd1]" aria-hidden="true" /></Link>
            </div>
          </section>

          <section aria-labelledby="quick-title" className="rounded-xl border border-[#cbd8e5] bg-white">
            <div className="border-b border-[#dce5ee] px-5 py-4"><h2 id="quick-title" className="text-base font-black text-[#14233a]">Akses cepat</h2><p className="mt-1 text-xs text-[#71849a]">Jalur kerja yang sering dipakai</p></div>
            <div className="divide-y divide-[#e4ebf2]">{quickLinks.map((item) => { const Icon = item.icon; return <Link key={item.label} href={item.href} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#f4f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4a70a9]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf3f8] text-[#4a70a9]"><Icon size={16} aria-hidden="true" /></span><span className="min-w-0 flex-1"><strong className="block text-xs font-bold text-[#284970]">{item.label}</strong><span className="mt-0.5 block text-[11px] text-[#71849a]">{item.description}</span></span><ArrowUpRight size={14} className="text-[#9cb0c4]" aria-hidden="true" /></Link>; })}</div>
          </section>
        </aside>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="popular-title" className="overflow-hidden rounded-xl border border-[#cbd8e5] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-[#dce5ee] px-5 py-4"><div><h2 id="popular-title" className="flex items-center gap-2 text-base font-black text-[#14233a]"><BookOpen size={18} className="text-[#4a70a9]" aria-hidden="true" />Materi paling dibaca</h2><p className="mt-1 text-xs text-[#71849a]">Urutan berdasarkan total pembacaan reader</p></div><Link href="/materi" className="text-xs font-bold text-[#284970] hover:text-[#4a70a9]">Buka katalog</Link></div>
          {popularLessons.length > 0 ? <ol className="divide-y divide-[#e4ebf2]">{popularLessons.map((lesson, index) => <li key={lesson.slug}><Link href={`/materi/${lesson.slug}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#f4f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4a70a9]"><span className="font-mono text-sm font-black text-[#9cb0c4]">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#14233a]">{lesson.title}</strong><span className="mt-1 block truncate text-xs text-[#71849a]">{lesson.courseTitle}</span></span><span className="inline-flex items-center gap-1.5 text-xs font-bold tabular-nums text-[#4a70a9]"><Eye size={14} aria-hidden="true" />{lesson.readCount}</span></Link></li>)}</ol> : <div className="px-5 py-10 text-center text-sm text-[#71849a]">Belum ada data pembacaan materi.</div>}
        </section>

        <section aria-labelledby="activity-title" className="overflow-hidden rounded-xl border border-[#cbd8e5] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-[#dce5ee] px-5 py-4"><div><h2 id="activity-title" className="flex items-center gap-2 text-base font-black text-[#14233a]"><Activity size={18} className="text-[#4a70a9]" aria-hidden="true" />Aktivitas terbaru</h2><p className="mt-1 text-xs text-[#71849a]">{trackingTotal} event tercatat</p></div></div>
          {recentEvents.length > 0 ? <ol className="divide-y divide-[#e4ebf2]">{recentEvents.map((event) => <li key={event.id} className="flex items-start gap-3 px-5 py-4"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${event.eventType === "login" ? "bg-[#e7eff7] text-[#4a70a9]" : "bg-[#e6f5eb] text-[#2c8150]"}`}>{event.eventType === "login" ? <LogIn size={16} aria-hidden="true" /> : <BookOpen size={16} aria-hidden="true" />}</span><div className="min-w-0 flex-1"><p className="text-sm text-[#14233a]"><strong>{event.user?.name || "Pengunjung anonim"}</strong> {event.eventType === "login" ? "masuk ke portal" : `membaca ${event.lesson?.title || "materi"}`}</p><p className="mt-1 text-xs text-[#71849a]">{eventTimestamp(event.createdAt)}</p></div></li>)}</ol> : <div className="px-5 py-10 text-center text-sm text-[#71849a]">Belum ada aktivitas terbaru.</div>}
        </section>
      </div>
    </main>
  );
}

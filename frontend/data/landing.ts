export interface SocialStat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}

export interface FeaturedProgram {
  id: string;
  label: string;
  description: string;
  route: string;
  badge?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export const socialStats: SocialStat[] = [
  {
    id: "siswa",
    value: 5,
    label: "Siswa aktif",
  },
  {
    id: "materi",
    value: 30,
    suffix: "+",
    label: "Materi & topik",
  },
  {
    id: "pertemuan",
    value: 12,
    label: "Rata-rata pertemuan / bulan",
  },
];

export interface LandingStat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}

export interface LandingCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
  route: string;
  countLabel: string;
}

export interface AboutPoint {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const heroBenefits: string[] = [
  "Laporan progres belajar anak",
  "Guru berpengalaman",
  "Free konsultasi & trial session",
  "Jadwal fleksibel",
  "Bisa online & offline (di rumah tentor / siswa)",
];

export const aboutPoints: AboutPoint[] = [
  {
    id: "progres",
    icon: "chart",
    title: "Laporan progres belajar",
    description:
      "Orang tua menerima laporan perkembangan anak secara berkala, jadi tetap bisa memantau dari rumah.",
  },
  {
    id: "tentor",
    icon: "user",
    title: "Guru berpengalaman",
    description:
      "Tentor terpilih dengan latar belakang pendidikan yang relevan dan sabar menghadapi anak.",
  },
  {
    id: "fleksibel",
    icon: "calendar",
    title: "Jadwal fleksibel",
    description:
      "Atur hari dan jam sesuai kesibukan. Belajar tidak perlu mengorbankan aktivitas lain.",
  },
  {
    id: "konsultasi",
    icon: "message",
    title: "Konsultasi gratis",
    description:
      "Free konsultasi dan trial session untuk memastikan pendekatan yang paling pas sebelum mulai.",
  },
];

export const landingStats: LandingStat[] = [
  { id: "siswa", value: 5, label: "Siswa aktif" },
  { id: "materi", value: 30, suffix: "+", label: "Materi & topik" },
  { id: "program", value: 3, label: "Program pilihan" },
  { id: "pertemuan", value: 12, label: "Rata-rata pertemuan / bulan" },
];

export const landingCategories: LandingCategory[] = [
  {
    id: "materi",
    label: "Les Per Materi",
    description:
      "Komputer Dasar, Kelas Vibe Coding, sampai topik spesifik yang dibutuhkan.",
    icon: "monitor",
    route: "/course/materi",
    countLabel: "2+ materi pilihan",
  },
  {
    id: "jenjang",
    label: "Berdasarkan Jenjang",
    description: "Belajar sesuai kurikulum SD 1–3, SD 4–6, dan SMP.",
    icon: "graduation",
    route: "/course/jenjang",
    countLabel: "3 jenjang sekolah",
  },
  {
    id: "calistung",
    label: "Calistung & Ngaji",
    description:
      "Ngaji mulai 15rb, atau paket calistung + ngaji 30rb per sesi.",
    icon: "book",
    route: "/course/calistung",
    countLabel: "Mulai 15rb / sesi",
  },
  {
    id: "konsultasi",
    label: "Konsultasi Gratis",
    description:
      "Free konsultasi dan trial session untuk sesuaikan kebutuhan belajar anak.",
    icon: "sparkles",
    route: "/course/program",
    countLabel: "Gratis & tanpa syarat",
  },
];

export const featuredPrograms: FeaturedProgram[] = [
  {
    id: "materi",
    label: "Les Per Materi",
    description:
      "Fokus satu materi: komputer, Kelas Vibe Coding, dan topik spesifik.",
    route: "/course/materi",
    badge: "Favorit",
  },
  {
    id: "jenjang",
    label: "Les Berdasarkan Jenjang",
    description: "Belajar sesuai kurikulum SD–SMP dengan tempo yang pas.",
    route: "/course/jenjang",
  },
  {
    id: "calistung",
    label: "Calistung & Ngaji",
    description:
      "Ngaji mulai 15rb, atau paket calistung + ngaji 30rb per sesi.",
    route: "/course/calistung",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Anak jadi lebih berani baca dan hitung. Laporan progres tiap minggu bikin kami tenang di rumah.",
    name: "Bu Sari",
    role: "Orang tua siswa SD",
  },
  {
    id: "t2",
    quote:
      "Jadwalnya fleksibel, cocok buat anak yang padat kegiatan. Tutor sabar dan komunikatif.",
    name: "Pak Andi",
    role: "Orang tua siswa SMP",
  },
  {
    id: "t3",
    quote:
      "Dari nol komputer sampai bisa bikin tugas sekolah sendiri. Materinya runtut, gak bikin pusing.",
    name: "Raka",
    role: "Siswa Kelas Vibe Coding",
  },
];

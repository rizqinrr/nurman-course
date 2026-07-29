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

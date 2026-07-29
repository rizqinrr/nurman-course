export type Category = "materi" | "jenjang" | "calistung";

export interface MaterialLevel {
  level: number;
  title: string;
  subtitle: string;
  features: string[];
  comingSoon?: boolean;
  basePrice?: number;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  category: Category;
  basePrice: number;
  levels: MaterialLevel[];
}

export const getLevelBasePrice = (
  material: Material,
  levelNumber: number,
): number => {
  const level = material.levels.find((item) => item.level === levelNumber);
  return level?.basePrice ?? material.basePrice;
};

export const materials: Material[] = [
  {
    id: "komputer-dasar",
    name: "Komputer Dasar",
    description:
      "Menguasai penggunaan komputer dari dasar hingga aplikasi profesional",
    category: "materi",
    basePrice: 35000,
    levels: [
      {
        level: 1,
        title: "Pemula",
        subtitle: "Dari Nol",
        basePrice: 35000,
        features: [
          "Mengenal perangkat keras dan perangkat lunak",
          "Cara menyalakan komputer, login, dan pengaturan dasar Windows",
          "Mengenal file, folder, copy-paste, dan penyimpanan",
          "Pengenalan Microsoft Word (dokumen teks)",
          "Format dokumen (font, paragraf, margin, heading)",
          "Simpan dan cetak dokumen, konversi ke PDF",
          "Pengenalan internet & email (buka, kirim lampiran, unduh file)",
          "Proyek akhir: Membuat surat pribadi + kirim via email",
        ],
      },
      {
        level: 2,
        title: "Menengah",
        subtitle: "Produktivitas Kantoran",
        basePrice: 40000,
        features: [
          "Review Word (dokumen resmi & tabel)",
          "Pengenalan Microsoft Excel",
          "Rumus dasar (SUM, AVERAGE, MIN, MAX)",
          "Format data & tabel",
          "Grafik dan analisis sederhana",
          "Pengenalan PowerPoint",
          "Desain slide, animasi, dan presentasi menarik",
          "Internet untuk kerja (Google Drive, dokumen online)",
          "Email profesional & kolaborasi online",
          "Proyek akhir: Buat laporan + presentasi",
        ],
      },
      {
        level: 3,
        title: "Terapan",
        subtitle: "Praktis & Kreatif",
        features: [
          "Jalur Canva & dokumen online",
          "Jalur bisnis & UMKM digital",
          "Jalur administrasi profesional",
        ],
        comingSoon: true,
      },
    ],
  },
  {
    id: "vibe-coding",
    name: "Kelas Vibe Coding",
    description:
      "Mulai dari nol. Ngoding dengan bantuan AI — proyek nyata di localhost dulu, lanjut web app & production di level atas. Syarat: laptop/komputer sendiri dan internet lancar.",
    category: "materi",
    basePrice: 40000,
    levels: [
      {
        level: 1,
        title: "Dasar",
        subtitle: "Localhost dulu — 12 sesi",
        basePrice: 40000,
        features: [
          "Setup VSCode + Laragon (full localhost)",
          "HTML / CSS / JS basic",
          "Pakai AI universal + prompting lanjutan",
          "Proyek: landing page + app sederhana (local)",
          "Debugging & showcase di local",
          "Intro database — jembatan ke Level 2",
        ],
      },
      {
        level: 2,
        title: "Web App",
        subtitle: "Laravel + Git + Vercel — 12 sesi",
        basePrice: 45000,
        features: [
          "Backend, framework/library & MVC",
          "Laravel + Blade/Tailwind dengan AI",
          "Database, migration & CRUD (localhost)",
          "Auth (login/register)",
          "Git + GitHub",
          "Deploy landing/portofolio ke Vercel + proyek CRUD local",
        ],
      },
      {
        level: 3,
        title: "Pro",
        subtitle: "Production · modul fleksibel",
        basePrice: 50000,
        features: [
          "Setup AI pro (Cursor/rules) + arsitektur & ERD",
          "Laravel + Filament admin panel",
          "CRUD lanjutan, upload, fitur production",
          "Security, testing, payment/email (sesuai proyek)",
          "Deploy dinamis Railway/Render + CI/CD basic",
          "Proyek akhir portofolio (modul fleksibel)",
        ],
      },
    ],
  },
  {
    id: "sd-1-3",
    name: "SD Kelas 1-3",
    description:
      "Fokus dasar membaca, menulis, dan berhitung untuk kelas awal SD",
    category: "jenjang",
    basePrice: 25000,
    levels: [
      {
        level: 1,
        title: "Reguler",
        subtitle: "Pendampingan belajar sesuai kebutuhan siswa",
        features: [
          "Menyesuaikan kurikulum sekolah",
          "Latihan soal & pembahasan",
          "Pendampingan PR",
        ],
      },
    ],
  },
  {
    id: "sd-4-6",
    name: "SD Kelas 4-6",
    description:
      "Pendalaman materi sekolah dan latihan soal untuk kelas lanjutan SD",
    category: "jenjang",
    basePrice: 30000,
    levels: [
      {
        level: 1,
        title: "Reguler",
        subtitle: "Pendampingan belajar sesuai kebutuhan siswa",
        features: [
          "Menyesuaikan kurikulum sekolah",
          "Latihan soal & pembahasan",
          "Pendampingan PR",
        ],
      },
    ],
  },
  {
    id: "smp",
    name: "SMP",
    description:
      "Pendampingan belajar sesuai kurikulum SMP dan persiapan ujian",
    category: "jenjang",
    basePrice: 35000,
    levels: [
      {
        level: 1,
        title: "Reguler",
        subtitle: "Pendampingan belajar sesuai kebutuhan siswa",
        features: [
          "Menyesuaikan kurikulum sekolah",
          "Latihan soal & pembahasan",
          "Pendampingan PR",
        ],
      },
    ],
  },
  {
    id: "ngaji",
    name: "Ngaji",
    description:
      "Belajar mengaji sesuai usia: Iqro/Al-Qur'an, tajwid dasar, dan hafalan ringan",
    category: "calistung",
    basePrice: 15000,
    levels: [
      {
        level: 1,
        title: "Dasar",
        subtitle: "Fondasi ngaji anak",
        features: [
          "Mengenal huruf hijaiyah dan makhraj dasar",
          "Iqro atau Al-Qur'an sesuai kemampuan",
          "Tajwid sederhana & kelancaran baca",
          "Hafalan doa/surah pendek (opsional)",
        ],
      },
    ],
  },
  {
    id: "calistung-ngaji",
    name: "Calistung & Ngaji",
    description:
      "Program dasar membaca, menulis, berhitung, dan ngaji dalam satu paket",
    category: "calistung",
    basePrice: 30000,
    levels: [
      {
        level: 1,
        title: "Dasar",
        subtitle: "Fondasi belajar anak",
        features: [
          "Mengenal huruf, angka, dan suku kata",
          "Latihan membaca dan menulis bertahap",
          "Berhitung dasar untuk kebutuhan harian",
          "Dasar ngaji sesuai usia anak",
        ],
      },
    ],
  },
];

/**
 * Get material by ID
 */
export const getMaterialById = (id: string): Material | undefined => {
  return materials.find((m) => m.id === id);
};

/**
 * Get materials by category
 */
export const getMaterialsByCategory = (category: Category): Material[] => {
  return materials.filter((m) => m.category === category);
};

/**
 * Get all unique categories
 */
export const getCategories = (): Category[] => {
  const categories = new Set(materials.map((m) => m.category));
  return Array.from(categories) as Category[];
};

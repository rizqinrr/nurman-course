export type Category = "materi" | "jenjang" | "calistung";

export interface MaterialLevel {
  level: number;
  title: string;
  subtitle: string;
  features: string[];
}

export interface Material {
  id: string;
  name: string;
  description: string;
  category: Category;
  basePrice: number;
  levels: MaterialLevel[];
}

export const materials: Material[] = [
  {
    id: "komputer-dasar",
    name: "Komputer Dasar",
    description:
      "Menguasai penggunaan komputer dari dasar hingga aplikasi profesional",
    category: "materi",
    basePrice: 45000,
    levels: [
      {
        level: 1,
        title: "Pemula",
        subtitle: "Dari Nol",
        features: [
          "Pengenalan hardware & software",
          "Penggunaan keyboard & mouse",
          "Operating system basics",
          "File management",
        ],
      },
      {
        level: 2,
        title: "Menengah",
        subtitle: "Produktivitas Kantoran",
        features: [
          "Microsoft Word advanced",
          "Excel formulas & charts",
          "PowerPoint presentations",
          "Email & collaboration tools",
        ],
      },
      {
        level: 3,
        title: "Terapan",
        subtitle: "Praktis & Kreatif",
        features: [
          "Photo editing basics",
          "Video editing fundamentals",
          "Design principles",
          "Project portfolio creation",
        ],
      },
    ],
  },
  {
    id: "coding-dasar",
    name: "Coding Dasar",
    description: "Pengenalan programming dan AI untuk pemula",
    category: "materi",
    basePrice: 45000,
    levels: [
      {
        level: 1,
        title: "Fundamentals",
        subtitle: "Konsep Dasar Programming",
        features: [
          "Variables & data types",
          "Control flow (if, loops)",
          "Functions & logic",
          "Basic debugging",
        ],
      },
      {
        level: 2,
        title: "Intermediate",
        subtitle: "Struktur & Libraries",
        features: [
          "Arrays & objects",
          "Built-in methods",
          "Code organization",
          "Mini projects",
        ],
      },
      {
        level: 3,
        title: "AI Introduction",
        subtitle: "Pengenalan AI & Automation",
        features: [
          "AI concepts overview",
          "API integration basics",
          "Automation scripts",
          "Real-world AI use cases",
        ],
      },
    ],
  },
  {
    id: "coding-lanjutan",
    name: "Coding Lanjutan",
    description: "Pembuatan website dan advanced AI applications",
    category: "materi",
    basePrice: 55000,
    levels: [
      {
        level: 1,
        title: "Web Basics",
        subtitle: "HTML, CSS, & JavaScript",
        features: [
          "Semantic HTML5",
          "CSS layouts & responsive design",
          "JavaScript DOM manipulation",
          "Forms & validation",
        ],
      },
      {
        level: 2,
        title: "Web Framework",
        subtitle: "React & Next.js",
        features: [
          "React components & hooks",
          "State management basics",
          "Next.js fundamentals",
          "Database integration intro",
        ],
      },
      {
        level: 3,
        title: "AI Integration",
        subtitle: "Advanced AI & Deployment",
        features: [
          "LLM API integration",
          "Advanced automation",
          "Performance optimization",
          "Production deployment",
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
    id: "calistung-ngaji",
    name: "Calistung & Ngaji",
    description: "Program dasar membaca, menulis, berhitung, dan ngaji",
    category: "calistung",
    basePrice: 35000,
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

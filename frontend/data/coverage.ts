export interface CoverageArea {
  id: string;
  name: string;
  zone: 1 | 2 | 3;
  zoneLabel: string;
  lat: number;
  lng: number;
  radiusMeters: number; // radius cakupan area dalam meter
  subdistricts: string[];
  tutors: string[];
  programs: string[];
  transportFee: number; // 0 untuk zona 1, 10000 untuk zona 2
  estimatedTravelTime: string;
  isPopular?: boolean;
}

export interface HubLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  type: "headquarters" | "learning-point";
}

export const MAIN_HUBS: HubLocation[] = [
  {
    id: "hub-pusat",
    name: "Nurman Course Hub (Pusat)",
    address: "Jl. Kolonel Sugiono No. 24, Cilacap Kota, Jawa Tengah",
    lat: -7.7285,
    lng: 109.0145,
    phone: "6285138098384",
    type: "headquarters",
  },
  {
    id: "hub-utara",
    name: "Posko Tentor Cilacap Utara",
    address: "Jl. Tentara Pelajar (Area Gumilir / Tritih Kulon)",
    lat: -7.6880,
    lng: 109.0250,
    phone: "6285138098384",
    type: "learning-point",
  },
];

export const COVERAGE_AREAS: CoverageArea[] = [
  // ZONA 1 — Cilacap Kota (Gratis Transport Ekstra / Layanan Prioritas)
  {
    id: "cilacap-tengah",
    name: "Cilacap Tengah",
    zone: 1,
    zoneLabel: "Zona Inti (Bebas Biaya Transport)",
    lat: -7.7120,
    lng: 109.0110,
    radiusMeters: 3800,
    subdistricts: ["Sidanegara", "Donan", "Lomanis", "Gunungsimping", "Sidakaya"],
    tutors: ["Kak Kiki", "Kak Aisyah", "Kak Nadine"],
    programs: ["Calistung & Ngaji", "Komputer & Coding", "Matematika SD-SMP", "Bahasa Inggris"],
    transportFee: 0,
    estimatedTravelTime: "10 - 20 menit",
    isPopular: true,
  },
  {
    id: "cilacap-selatan",
    name: "Cilacap Selatan",
    zone: 1,
    zoneLabel: "Zona Inti (Bebas Biaya Transport)",
    lat: -7.7410,
    lng: 109.0150,
    radiusMeters: 3500,
    subdistricts: ["Tambakreja", "Cilacap", "Tegalkamulyan"],
    tutors: ["Kak Aisyah", "Kak Kiki"],
    programs: ["Calistung & Ngaji", "Bimbel SD-SMP", "Komputer Dasar"],
    transportFee: 0,
    estimatedTravelTime: "10 - 25 menit",
    isPopular: true,
  },
  {
    id: "cilacap-utara",
    name: "Cilacap Utara",
    zone: 1,
    zoneLabel: "Zona Inti (Bebas Biaya Transport)",
    lat: -7.6850,
    lng: 109.0280,
    radiusMeters: 4200,
    subdistricts: ["Gumilir", "Kebonmanis", "Karangtalun", "Tritih Kulon"],
    tutors: ["Kak Kiki", "Kak Nadine", "Kak Aisyah"],
    programs: ["Komputer & Coding", "Calistung Ceria", "Matematika", "Bahasa Inggris"],
    transportFee: 0,
    estimatedTravelTime: "15 - 25 menit",
    isPopular: true,
  },

  // ZONA 2 — Wilayah Sekitar Cilacap (Jangkauan Reguler)
  {
    id: "kesugihan",
    name: "Kecamatan Kesugihan",
    zone: 2,
    zoneLabel: "Zona Reguler",
    lat: -7.6250,
    lng: 109.0900,
    radiusMeters: 5500,
    subdistricts: ["Kuripan", "Menganti", "Kesugihan Kidul", "Datar", "Slarang"],
    tutors: ["Kak Kiki", "Kak Aisyah"],
    programs: ["Calistung & Ngaji", "Matematika", "Komputer Dasar"],
    transportFee: 10000,
    estimatedTravelTime: "25 - 35 menit",
    isPopular: false,
  },
  {
    id: "jeruklegi",
    name: "Kecamatan Jeruklegi",
    zone: 2,
    zoneLabel: "Zona Reguler",
    lat: -7.6000,
    lng: 109.0180,
    radiusMeters: 5000,
    subdistricts: ["Jeruklegi Wetan", "Jeruklegi Kulon", "Tritih Wetan", "Cilibang"],
    tutors: ["Kak Kiki", "Kak Nadine"],
    programs: ["Komputer & Coding", "Bahasa Inggris", "Bimbel SD"],
    transportFee: 10000,
    estimatedTravelTime: "25 - 40 menit",
    isPopular: false,
  },
  {
    id: "maos",
    name: "Kecamatan Maos",
    zone: 2,
    zoneLabel: "Zona Reguler",
    lat: -7.6180,
    lng: 109.1450,
    radiusMeters: 4800,
    subdistricts: ["Maos Lor", "Maos Kidul", "Karangreja", "Klapagada"],
    tutors: ["Kak Aisyah"],
    programs: ["Matematika SD-SMP", "Calistung Ceria", "Ngaji"],
    transportFee: 15000,
    estimatedTravelTime: "30 - 45 menit",
    isPopular: false,
  },
  {
    id: "adipala",
    name: "Kecamatan Adipala",
    zone: 2,
    zoneLabel: "Zona Reguler",
    lat: -7.6620,
    lng: 109.1550,
    radiusMeters: 5200,
    subdistricts: ["Adipala", "Bunton", "Penggalang", "Welahan Wetan"],
    tutors: ["Kak Nadine", "Kak Aisyah"],
    programs: ["Bahasa Inggris", "Calistung & Ngaji", "Bimbel SD"],
    transportFee: 15000,
    estimatedTravelTime: "30 - 45 menit",
    isPopular: false,
  },
  {
    id: "kroya",
    name: "Kecamatan Kroya",
    zone: 2,
    zoneLabel: "Zona Reguler",
    lat: -7.6320,
    lng: 109.2450,
    radiusMeters: 6000,
    subdistricts: ["Kroya", "Bajing", "Kedawung", "Sikampuh", "Ayamalas"],
    tutors: ["Kak Aisyah", "Kak Kiki"],
    programs: ["Matematika SD-SMP", "Komputer & Coding", "Bimbel"],
    transportFee: 15000,
    estimatedTravelTime: "35 - 50 menit",
    isPopular: false,
  },
  {
    id: "sampang",
    name: "Kecamatan Sampang",
    zone: 2,
    zoneLabel: "Zona Reguler",
    lat: -7.5850,
    lng: 109.1950,
    radiusMeters: 4500,
    subdistricts: ["Sampang", "Paketingan", "Karangtengah", "Karangasem"],
    tutors: ["Kak Aisyah"],
    programs: ["Bimbel SD-SMP", "Calistung & Ngaji"],
    transportFee: 15000,
    estimatedTravelTime: "35 - 50 menit",
    isPopular: false,
  },
];

export interface TutorMarker {
  id: string;
  name: string;
  nickname: string;
  role: string;
  specialization: string;
  baseLocation: string;
  lat: number;
  lng: number;
  avatar: string;
  activeStudents: number;
  rating: number;
}

export const TUTOR_LOCATIONS: TutorMarker[] = [
  {
    id: "tutor-kiki",
    name: "Fikri (Kak Kiki)",
    nickname: "Kak Kiki",
    role: "Tentor Komputer & Coding",
    specialization: "Komputer Dasar, Coding Pemula, Kreativitas Digital",
    baseLocation: "Cilacap Tengah & Utara",
    lat: -7.7020,
    lng: 109.0180,
    avatar: "/tutors/kak-fikri.svg",
    activeStudents: 4,
    rating: 5.0,
  },
  {
    id: "tutor-aisyah",
    name: "Aisyah (Kak Aisyah)",
    nickname: "Kak Aisyah",
    role: "Tentor Matematika & Calistung",
    specialization: "Matematika SD-SMP, Calistung Halus, Logika Dasar",
    baseLocation: "Cilacap Selatan & Tengah",
    lat: -7.7320,
    lng: 109.0100,
    avatar: "/tutors/kak-aisyah.svg",
    activeStudents: 6,
    rating: 4.9,
  },
  {
    id: "tutor-nadine",
    name: "Nadine (Kak Nadine)",
    nickname: "Kak Nadine",
    role: "Tentor Bahasa Inggris & Ngaji",
    specialization: "English Speaking Confidence, Tajwid Dasar, Iqro",
    baseLocation: "Cilacap Utara & Kesugihan",
    lat: -7.6750,
    lng: 109.0350,
    avatar: "/tutors/kak-nadine.svg",
    activeStudents: 5,
    rating: 4.9,
  },
];

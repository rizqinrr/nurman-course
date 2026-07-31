# Prompt: Katalog Program - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Katalog Program" (Course Catalog) page accessed by a student (Peserta) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all`.
- **Typography**: Geist Sans equivalent. Section headings and titles: Bold, dark gray (`#111827`).
- **Filters/Chips**: 
  - Inactive: `bg-white/40 border border-white/60 text-gray-700 rounded-full`.
  - Active: `border border-[#4a70a9] bg-[#4a70a9] text-white rounded-full`.
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Status Badges**:
  - Green-100/Green-700 pill for active programs.
  - Amber-100/Amber-800 pill for "Coming Soon" programs.

## Page Layout & Elements

### 1. Navigation Shell (Consistent with Dashboard)
- Left sidebar (desktop) or Bottom nav bar (mobile).
- Menu items: Dashboard, **Program** (Active highlighted state), Materi, Jadwal, Tagihan.
- Profile section + Logout button.

### 2. Header Area
- PageHeader styling: Title "Katalog Program" (bold, text-white or text-gray-900), Subtitle "Pilih program belajar terbaik untuk meningkatkan kemampuan Anda".

### 3. Category Filter Row
- A horizontal scrollable list of filter chips/buttons:
  - **Semua** (Active chip - blue `#4a70a9` background)
  - **Agama** (Inactive chip)
  - **Dasar & PAUD** (Inactive chip)
  - **Mata Pelajaran** (Inactive chip)

### 4. Search Bar
- A rounded-xl text input below the filter row.
  - Styling: `bg-white/80 border border-white/70 rounded-xl px-4 py-2.5 w-full outline-none focus:border-[#4a70a9]`.
  - Placeholder: "Cari program belajar..." with a search icon (magnifying glass) on the right.

### 5. Program Grid (Vertical list of programs)

#### Program Card 1: Ngaji Iqra & Al-Qur'an
- Inside a GlassCard:
  - Category Badge: "Agama" (top-left, text-xs text-[#4a70a9] bg-blue-50 font-semibold rounded-full px-2 py-0.5).
  - Program Title: "Ngaji Iqra & Al-Qur'an" (font-bold, text-xl, text-gray-900).
  - Short description: "Belajar melafalkan huruf hijaiyah, harakat tajwid, hingga kelancaran membaca Al-Qur'an dari dasar." (text-gray-600, text-sm, margin-bottom 12px).
  - Price Tag: "Mulai dari Rp 15.000 / sesi" (font-bold text-[#4a70a9], text-base).
  - Button at bottom-right or full width: "Lihat Detail & Peta Jalan" (primary style, rounded-xl).

#### Program Card 2: Calistung (Membaca, Menulis, Berhitung)
- Inside a GlassCard:
  - Category Badge: "Dasar & PAUD"
  - Program Title: "Calistung Dasar"
  - Short description: "Dasar membaca huruf, menulis suku kata sederhana, dan berhitung angka 1-10 secara interaktif untuk anak PAUD/TK/SD awal."
  - Price Tag: "Mulai dari Rp 15.000 / sesi"
  - Button: "Lihat Detail & Peta Jalan".

#### Program Card 3: Matematika & IPA SD
- Inside a GlassCard:
  - Category Badge: "Mata Pelajaran"
  - Program Title: "Les Mapel SD (Mtk & IPA)"
  - Short description: "Pendampingan belajar untuk memahami tugas sekolah, persiapan ujian, dan penguatan konsep matematika & sains dasar."
  - Price Tag: "Mulai dari Rp 20.000 / sesi"
  - Button: "Lihat Detail & Peta Jalan".

#### Program Card 4: Kelas Vibe Coding (Coming Soon)
- Inside a GlassCard (semi-opaque, 80% opacity):
  - Category Badge: "Teknologi"
  - Program Title: "Kelas Vibe Coding"
  - Short description: "Belajar logika pemrograman, HTML/CSS dasar, dan berkreasi membuat website sederhana. Wajib memiliki laptop."
  - Badges: "Mulai dari Rp 40.000 / sesi" + "Coming Soon" (amber badge).
  - Button: "Lihat Detail" (disabled/opacity-50).

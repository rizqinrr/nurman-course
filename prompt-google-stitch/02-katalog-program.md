# Prompt: Katalog Program Anak - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Katalog Program Anak" (Course Catalog) page accessed by a parent (Wali Murid) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all`.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary/Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Status Badges**:
  - Enrolled/Terdaftar status: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Available/Tersedia status: Background `#dbeafe` (light blue), text `#1e40af` (dark blue), rounded-full, font-bold, text-xs.
  - Coming Soon status: Background `#fef3c7` (light amber), text `#92400e` (dark amber), rounded-full, font-bold, text-xs.

## Page Layout & Elements

### 1. Navigation Shell
- Desktop Left Sidebar or Mobile Bottom Nav.
- Active menu: **Program Anak** (highlighted `#4a70a9` icon/text).

### 2. Header Area
- PageHeader: Title "Program Belajar Anak" (bold, text-white), Subtitle "Pilih dan daftar program bimbingan belajar terbaik untuk buah hati Anda".

### 3. Child Selector (Wali dengan >1 Anak)
- Below the header, show a horizontal row of chips representing the children.
  - Label: "Pilih Profil Anak:" (text-xs text-gray-500 font-semibold block mb-2).
  - Active child: "Budi Santoso" (active tone blue `#4a70a9` background).
  - Inactive child: "Ani Lestari" (inactive chip, bg-white/40 border-white/60).

### 4. Search Bar
- A search input box to search programs.
  - Styling: `bg-white/80 border border-white/70 rounded-xl px-4 py-2.5 w-full outline-none focus:border-[#4a70a9]`.
  - Placeholder: "Cari program belajar anak..."

### 5. Program Grid (Vertical list of programs)

#### Program Card 1 (Ngaji Iqra & Al-Qur'an):
- Inside a GlassCard:
  - Category Badge: "Agama" (top-left, text-xs text-[#4a70a9] bg-blue-50 font-semibold rounded-full px-2 py-0.5).
  - Status Badge: "Terdaftar - Aktif" (green pill, top-right).
  - Program Title: "Ngaji Iqra & Al-Qur'an" (font-bold, text-xl, text-gray-900).
  - Description: "Belajar melafalkan huruf hijaiyah, harakat tajwid, hingga kelancaran membaca Al-Qur'an dari dasar." (text-gray-600, text-sm).
  - Detail: "Sessions: 12x sesi / blok" (text-xs text-gray-500).
  - Actions (Footer):
    - A button: "Buka Peta Jalan Belajar" (primary blue `#4a70a9` button, rounded-xl, full width or right-aligned).

#### Program Card 2 (Calistung Dasar):
- Inside a GlassCard:
  - Category Badge: "Dasar & PAUD"
  - Status Badge: "Tersedia" (blue pill, top-right).
  - Program Title: "Calistung Dasar"
  - Description: "Dasar membaca huruf, menulis suku kata sederhana, dan berhitung angka 1-10 secara interaktif untuk anak PAUD/TK/SD awal."
  - Detail: "Sessions: 10x sesi / blok"
  - Price Tag: "Mulai dari Rp 15.000 / sesi"
  - Actions (Footer):
    - A button: "Daftar Program (WhatsApp)" (ghost button with WhatsApp icon, rounded-xl, full width).
    - A link: "Lihat Detail Program" (underlined link).

#### Program Card 3 (Kelas Vibe Coding):
- Inside a GlassCard (80% opacity):
  - Category Badge: "Teknologi"
  - Status Badge: "Coming Soon" (amber pill, top-right).
  - Program Title: "Kelas Vibe Coding"
  - Description: "Belajar logika pemrograman, HTML/CSS dasar, dan berkreasi membuat website sederhana. Wajib memiliki laptop."
  - Detail: "Sessions: 12x sesi / blok"
  - Actions (Footer):
    - A button: "Hubungi Admin" (disabled, opacity-50).

# Prompt: Detail Program & Roadmap Anak - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Detail Program & Peta Jalan Belajar Anak" (Child Course Details & Learning Roadmap) page accessed by a parent (Wali Murid) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl`.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary/Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Status Badges**:
  - Completed: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Current Active: Background `#dbeafe` (light blue), text `#1e40af` (dark blue), rounded-full, font-bold, text-xs.
  - Locked: Background `#f3f4f6` (light gray), text `#4b5563` (gray), rounded-full, font-bold, text-xs.
- **Header Back Button**: Floating back arrow labeled "Kembali" (bg-white/25 border-white/40).

## Page Layout & Elements

### 1. Navigation Shell
- Left sidebar or Bottom nav.
- Active menu: **Program Anak** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Back button "Kembali" (takes parent back to Catalog page). Title: "Peta Jalan Belajar Budi" (bold, text-white), Subtitle: "Lacak posisi dan capaian langkah belajar anak Anda".

### 3. Program Summary Card (GlassCard)
- Category Badge: "Agama" (top-left, text-xs text-[#4a70a9] bg-blue-50 font-semibold px-2 py-0.5 rounded-full).
- Title: "Ngaji Iqra & Al-Qur'an" (font-bold text-2xl text-gray-900).
- Student Info: "Peserta: Budi Santoso (7 Tahun - SD Kelas 2)" (text-gray-600, text-sm, mt-1).
- Total Progress: "Langkah 2 dari 12 selesai - Iqra 2 (Sedang Ditempuh)" (text-gray-600, text-xs).
- Progress Bar: loaded to ~17% (blue color `#4a70a9`).

### 4. Interactive Roadmap Timeline (Vertical Timeline)
- Render a vertical timeline representing the roadmap steps, connected by a vertical line.

#### Step Node 1 (Selesai):
- Left node: A solid green circle with a white checkmark icon.
- Right content card (sub-card inside timeline, bg-white/40 border-white/60):
  - Badge: "Selesai" (green pill).
  - Header: "1. Pengenalan Huruf Hijaiyah" (font-bold, text-gray-900).
  - Meta: "Tingkatan: Iqra 1".
  - Text: "Materi melafalkan huruf hijaiyah tunggal secara makhraj yang benar."
  - Action link: "Buka Penjelasan Materi" (underlined link, text-gray-600, text-xs).

#### Step Node 2 (Sedang Ditempuh):
- Left node: A blue circle with a pulsing ring effect.
- Right content card (GlassCard, border-[#4a70a9] highlight):
  - Badge: "Langkah Aktif" (blue pill).
  - Header: "2. Harakat Sederhana & Huruf Sambung" (font-bold, text-gray-900, text-lg).
  - Meta: "Tingkatan: Iqra 2".
  - Text: "Materi membaca harakat fathah, kasrah, dhommah, dan cara merangkai huruf sambung di awal, tengah, dan akhir kata."
  - Action button: "Baca Materi Penjelasan" (primary blue `#4a70a9` button, rounded-xl).

#### Step Node 3 (Terkunci):
- Left node: A gray circle with a small pad-lock icon.
- Right content card (semi-transparent gray, opacity-70):
  - Badge: "Terkunci" (gray pill).
  - Header: "3. Tanwin, Mad & Sukun" (font-bold, text-gray-400).
  - Meta: "Tingkatan: Iqra 3".
  - Text: "Materi harakat ganda (tanwin), bacaan panjang (mad asli), dan huruf mati (sukun)."
  - Action button: "Terkunci" (disabled, light gray bg, text-gray-400).

### 5. Sticky Bottom Action
- Fixed bottom button bar:
  - Left side: "Sesi Selesai: 4 dari 12 (Blok 1)"
  - Right side: "Lihat Semua Laporan Sesi" (primary `#4a70a9` button, rounded-xl).

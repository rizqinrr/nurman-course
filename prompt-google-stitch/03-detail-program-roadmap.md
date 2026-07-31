# Prompt: Detail Program & Roadmap - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Detail Program & Peta Jalan Belajar" (Course Details & Learning Roadmap) page accessed by a student (Peserta) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Pills & Badges**:
  - Completed step badge: Background `#dcfce7` (light green), text `#15803d` (dark green).
  - Current/Active step badge: Background `#dbeafe` (light blue), text `#1e40af` (dark blue).
  - Locked step badge: Background `#f3f4f6` (light gray), text `#4b5563` (gray).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Header Back Button**: Floating back arrow button labeled "Kembali" (bg-white/25 border-white/40).

## Page Layout & Elements

### 1. Navigation Shell
- Desktop Left Sidebar or Mobile Bottom Nav.
- Active menu: **Program** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Back button "Kembali" (brings user to Catalog page). Title: "Peta Jalan Belajar" (bold, text-white), Subtitle: "Lacak perkembangan belajar Anda langkah demi langkah".

### 3. Program Info Card
- Render a GlassCard.
- Inside content:
  - Category Badge: "Agama" (top-left, text-xs text-[#4a70a9] bg-blue-50 font-semibold rounded-full px-2 py-0.5).
  - Title: "Ngaji Iqra & Al-Qur'an" (font-bold text-2xl text-gray-900).
  - Full description: "Program bimbingan terstruktur mulai dari mengenal huruf hijaiyah tunggal (Iqra 1), merangkai huruf sambung, mempelajari hukum tajwid, hingga membaca Al-Qur'an secara fasih dan tartil." (text-gray-600, text-sm, mt-2).
  - Status Badge: "Terdaftar - Aktif" (green pill, top-right).

### 4. Interactive Roadmap Timeline (Vertical Timeline)
- Render a vertical timeline representing the roadmap steps. There should be a thin vertical gray/blue line connecting the nodes.

#### Node 1: Langkah 1 (Selesai / Completed)
- Left element: A solid green circle with a white checkmark icon inside, anchored to the vertical timeline connector.
- Right content card (sub-card inside timeline, bg-white/40 border-white/60):
  - Badge: "Selesai" (green pill).
  - Header: "1. Pengenalan Huruf Hijaiyah" (font-bold, text-gray-900).
  - Meta: "Level: Iqra 1".
  - Text: "Belajar melafalkan huruf hijaiyah tunggal secara makhraj dan benar."
  - Action link: "Buka Materi" (underlined link, text-gray-600).

#### Node 2: Langkah 2 (Sedang Ditempuh / Current Active Step)
- Left element: A blue circle with a pulsing ring effect, anchored to the timeline.
- Right content card (GlassCard, border-[#4a70a9] highlight):
  - Badge: "Sedang Dipelajari" (blue pill).
  - Header: "2. Harakat Sederhana & Huruf Sambung" (font-bold, text-gray-900, text-lg).
  - Meta: "Level: Iqra 2".
  - Text: "Mulai memahami harakat fathah, kasrah, dhommah, serta teknik menyambung huruf di awal, tengah, dan akhir kata."
  - Action button: "Mulai Belajar" (primary blue `#4a70a9` button, rounded-xl).

#### Node 3: Langkah 3 (Terkunci / Locked)
- Left element: A gray circle with a small pad-lock icon inside.
- Right content card (semi-transparent gray border-white/30, opacity-70):
  - Badge: "Terkunci" (gray pill).
  - Header: "3. Tanwin, Mad & Sukun" (font-bold, text-gray-400).
  - Meta: "Level: Iqra 3".
  - Text: "Pengenalan harakat ganda (tanwin), bacaan panjang (mad asli), dan huruf sukun (mati)."
  - Action button: "Terkunci" (disabled, light gray bg, text-gray-400).

### 5. Floating Bottom Bar (If active step needs action)
- Fixed at the bottom of the viewport:
  - Displays "Langkah Aktif: Harakat Sederhana & Huruf Sambung" on the left.
  - A primary button "Buka Sesi Belajar" on the right.

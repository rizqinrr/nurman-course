# Prompt: Dashboard Pengajar - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Dashboard Utama Pengajar" (Tutor Dashboard) portal of "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Status Badges**:
  - Waiting report / Pending: Background `#fef3c7` (light amber), text `#92400e` (dark amber), rounded-full, font-bold, text-xs.
  - Completed: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Scheduled: Background `#dbeafe` (light blue), text `#1e40af` (dark blue), rounded-full, font-bold, text-xs.

## Page Layout & Navigation Shell

### 1. Navigation Shell (Pengajar Menu)
- Desktop Left Sidebar or Mobile Bottom Nav.
- Menu links with icons:
  - **Sesi Mengajar** (Active highlighted state, text/icon in `#4a70a9`).
  - **Laporan Harian**
  - **Laporan Perkembangan**
- Include a profile name "Kak Kiki (Tentor)" and a prominent "Keluar" (Logout) button.

### 2. Header Area
- Left side: Greeting "Halo, Kak Kiki!" (text-gray-900, font-bold, text-2xl), subtitle "Agenda mengajar privat dan pengisian laporan belajar hari ini." (text-gray-600, text-sm).
- Right side: Logout button.

### 3. Statistics Widgets (Dashboard widgets)
- A horizontal scroll or a 3x1 row of small GlassCards displaying:
  - **Widget 1: Sesi Mengajar** -> "12 Sesi" (Minggu ini)
  - **Widget 2: Total Murid** -> "3 Siswa Aktif"
  - **Widget 3: Laporan Pending** -> "2 Laporan" (font-bold text-amber-700).

### 4. Sesi Mengajar Hari Ini (Today's Scheduled Sessions List)
- Title: "Jadwal Mengajar Hari Ini" (font-bold text-gray-900 text-lg mb-3).
- Display sessions in vertical stack of GlassCards:

#### Sesi Card 1 (Belum Diisi Laporan):
- Inside a GlassCard:
  - Header Row:
    - Time: "14:00 - 15:30 WIB" (font-bold text-gray-900).
    - Status Badge: "Butuh Laporan" (amber pill).
  - Details:
    - **Siswa**: Budi Santoso (7 Tahun - SD Kelas 2).
    - **Program**: Ngaji Iqra & Al-Qur'an (Level 2).
    - **Alamat**: Jl. Merdeka No. 12 (Rumah Siswa).
  - Action Footer (aligned right):
    - A button: "Tulis Laporan Harian" (primary `#4a70a9` button, rounded-xl, full width).

#### Sesi Card 2 (Sudah Diisi Laporan):
- Inside a GlassCard (85% opacity):
  - Header Row:
    - Time: "16:00 - 17:30 WIB"
    - Status Badge: "Selesai" (green pill).
  - Details:
    - **Siswa**: Ani Lestari (6 Tahun - TK B).
    - **Program**: Calistung Dasar.
  - Action Footer:
    - A button: "Edit Laporan Sesi" (ghost button, rounded-xl, sm).

### 5. Evaluasi Blok / Laporan Perkembangan Pending (Periodic Reports Alert)
- Title: "Evaluasi Perkembangan Belajar" (font-bold text-gray-900 text-lg mt-6 mb-3).
- Inside a GlassCard:
  - Alert Box: Background `#fef3c7` (amber border border-amber-200/50).
  - Text: "**Budi Santoso** telah menyelesaikan 12 sesi (Blok 1) pada Program **Ngaji Iqra & Al-Qur'an**. Harap buat Rapor Perkembangan belajar untuk wali murid." (text-sm text-gray-700).
  - Button at the bottom: "Buat Laporan Perkembangan" (primary `#4a70a9` button, rounded-xl).

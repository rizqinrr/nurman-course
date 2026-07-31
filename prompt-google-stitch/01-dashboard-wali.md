# Prompt: Dashboard Wali Murid - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Dashboard Wali Murid" (Parent Portal) of "LMS Sederhana Nurman Course". The parents (Wali) use this page to monitor the learning progress of their children (Murid).

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient background from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside cards, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Geist Sans equivalent. Section headings: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Status Badges**:
  - Active: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Alert/Unpaid: Background `#fee2e2` (light red), text `#b91c1c` (dark red), rounded-full, font-bold, text-xs.
  - Informational/Blue: Background `#dbeafe` (light blue), text `#1e40af` (dark blue), rounded-full, font-bold, text-xs.

## Page Layout & Navigation Shell

### 1. Navigation Shell (Wali Murid Menu)
- Desktop Left Sidebar or Mobile Bottom Nav.
- Menu items with icons:
  - **Dashboard** (Active highlighted state, `#4a70a9` background or text).
  - **Program Anak**
  - **Jadwal**
  - **Tagihan**
- Include a Logout (Keluar) button at the bottom of the navigation.

### 2. Header Area
- Left side: Display greeting "Halo, Bapak Budi Santoso!" (text-gray-900, text-2xl font-bold) and subtitle "Pantau aktivitas belajar buah hati Anda di Nurman Course." (text-gray-600, text-sm).
- Right side: Display the user profile icon and the "Keluar" (Logout) button.

### 3. Child Selector (Untuk Wali dengan >1 Anak)
- Below the header, show a horizontal row of chips representing the children.
  - Label: "Pilih Anak:" (text-xs text-gray-500 font-semibold uppercase block mb-2).
  - Active child chip: "Budi Santoso" (active tone blue `#4a70a9` background).
  - Inactive child chip: "Ani Lestari" (inactive chip, bg-white/40 border-white/60).

### 4. Dashboard Content Area (Stacked vertically for the active child)

#### Block A: Informasi Murid & Program Aktif (Child Summary Card)
- Render a GlassCard.
- Title: "Informasi Murid & Program" (text-gray-900, font-bold, text-lg).
- Inside content:
  - Child Info Sub-card:
    - "Budi Santoso - 7 Tahun (SD Kelas 2)"
  - Program Info Sub-card:
    - Program Name: "Ngaji Iqra & Al-Qur'an (3x/minggu)" (font-bold text-gray-900)
    - Status Badge: "Aktif" (green pill).
    - Progress summary: "Langkah 2 dari 12 (Iqra 2 - Harakat Sederhana)" (text-gray-600, text-sm).
    - Progress Bar: Thin blue `#4a70a9` progress bar loaded to ~17%.

#### Block B: Laporan Kegiatan Harian Terakhir (Latest Daily Report)
- Render a GlassCard.
- Title: "Laporan Pertemuan Terakhir" (text-gray-900, font-bold, text-lg).
- Inside content:
  - Inside a white/60 sub-card:
    - **Tanggal & Jam**: "Senin, 3 Agustus 2026 (14:00 - 15:30 WIB)"
    - **Materi yang Dibahas**: "Membaca harakat kasrah sambung pada halaman 5." (text-gray-700, text-sm).
    - **Catatan Tentor (Kak Kiki)**: "Budi fokus mendengarkan penjelasan. Bacaan fathah sudah lancar, namun lafalan kasrah sambung perlu sedikit pengulangan di rumah." (text-gray-600, italic, text-sm).
  - Button at bottom: "Lihat Riwayat Laporan Harian" (ghost button, full width, rounded-xl).

#### Block C: Laporan Perkembangan Terakhir (Latest Progress Report per Block)
- Render a GlassCard.
- Title: "Rapor Perkembangan Belajar" (text-gray-900, font-bold, text-lg).
- Inside content:
  - Inside a white/60 sub-card:
    - **Periode**: "Blok 1 (Sesi 1 - 12)" (font-semibold text-[#4a70a9]).
    - **Capaian Utama**: "Anak menunjukkan minat belajar yang tinggi dan telah menyelesaikan materi Iqra 1 secara keseluruhan."
    - **Saran Pengajar**: "Disarankan untuk sering mengulang makhraj huruf di waktu senggang."
  - Button: "Buka Rapor Evaluasi Lengkap" (ghost button, full width, rounded-xl).

#### Block D: Jadwal Terdekat & Tagihan Ringkas
- A 2-column layout or stacked cards:
  - **Sesi Terdekat Card**: "Selasa, 4 Agustus 2026 pukul 14:00 di Rumah Siswa bersama Kak Kiki."
  - **Tagihan Card**: "Invoice #INV-202608-001 (Belum Dibayar: Rp 120.000)". Button: "Rincian Tagihan" (blue button, rounded-xl).

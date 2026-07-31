# Prompt: Jadwal Sesi - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Jadwal Sesi Belajar" (Study Sessions Schedule) page accessed by a student (Peserta) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside cards, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Geist Sans equivalent. Headings and labels: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Status Badges**:
  - Scheduled status: Background `#dbeafe` (light blue), text `#1e40af` (dark blue), rounded-full, font-bold, text-xs.
  - Completed session: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Cancelled session: Background `#fee2e2` (light red), text `#b91c1c` (dark red), rounded-full, font-bold, text-xs.

## Page Layout & Elements

### 1. Navigation Shell
- Left sidebar or Bottom nav.
- Active menu: **Jadwal** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Title "Jadwal Belajar" (bold, text-white), Subtitle "Pantau waktu belajar dan kehadiran les Anda".

### 3. Sesi Mendatang (Upcoming Sessions Section)
- Title: "Sesi Belajar Aktif" (font-bold text-gray-900 text-lg mb-3).
- Vertical stack of GlassCards representing upcoming classes.

#### Session Card 1:
- Inside a GlassCard:
  - Top Row: 
    - Date badge: "Selasa, 4 Agustus 2026" (font-bold text-gray-900).
    - Status badge: "Terjadwal" (blue pill).
  - Main Details:
    - **Program**: "Ngaji Iqra & Al-Qur'an" (font-semibold, text-gray-800).
    - **Time**: "14:00 - 15:30 WIB" (text-sm, text-gray-600).
    - **Location**: "Rumah Siswa" (text-xs, text-gray-500).
    - **Tentor/Teacher**: "Kak Kiki" (text-xs, text-gray-500).
  - Footer Action:
    - A button: "Hubungi Tentor (WhatsApp)" (ghost button style with WhatsApp icon, rounded-xl).

#### Session Card 2:
- Inside a GlassCard:
  - Top Row:
    - Date badge: "Kamis, 6 Agustus 2026"
    - Status badge: "Terjadwal" (blue pill).
  - Main Details:
    - **Program**: "Ngaji Iqra & Al-Qur'an"
    - **Time**: "14:00 - 15:30 WIB"
    - **Location**: "Rumah Siswa"
    - **Tentor/Teacher**: "Kak Kiki"
  - Footer Action:
    - A button: "Hubungi Tentor (WhatsApp)".

### 4. Riwayat Sesi (Past Sessions Section)
- Title: "Sesi Terlewati" (font-bold text-gray-900 text-lg mt-6 mb-3).
- A container with 75% opacity to indicate history.

#### Past Session Card 1:
- GlassCard with lower opacity:
  - Date: "Sabtu, 1 Agustus 2026"
  - Status badge: "Hadir / Selesai" (green pill).
  - Program: "Ngaji Iqra & Al-Qur'an"
  - Time: "14:00 - 15:30 WIB"
  - Summary: "Langkah 1 (Pengenalan Huruf Hijaiyah) selesai diajarkan." (text-gray-500, italic, text-xs).

### 5. Sticky Bottom Action
- Fixed bottom button: "Ajukan Perubahan Jadwal" (primary `#4a70a9` button, full width, rounded-xl). Clicking this shows a popup or leads to WhatsApp support.

# Prompt: Jadwal Sesi Anak - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Jadwal Belajar Anak" (Child Study Sessions Schedule) page accessed by a parent (Wali Murid) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside cards, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl`.
- **Typography**: Geist Sans. Headings and labels: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary/Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Status Badges**:
  - Scheduled: Background `#dbeafe` (light blue), text `#1e40af` (dark blue), rounded-full, font-bold, text-xs.
  - Completed/Hadir: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Cancelled: Background `#fee2e2` (light red), text `#b91c1c` (dark red), rounded-full, font-bold, text-xs.

## Page Layout & Elements

### 1. Navigation Shell
- Left sidebar or Bottom nav.
- Active menu: **Jadwal** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Title "Jadwal Belajar" (bold, text-white), Subtitle "Pantau waktu les dan kehadiran buah hati Anda".

### 3. Child Selector (Wali dengan >1 Anak)
- Below the header, show a horizontal row of chips representing the children.
  - Label: "Pilih Profil Anak:" (text-xs text-gray-500 font-semibold block mb-2).
  - Active child: "Budi Santoso" (active tone blue `#4a70a9` background).
  - Inactive child: "Ani Lestari" (inactive chip, bg-white/40 border-white/60).

### 4. Sesi Terjadwal (Upcoming Sessions Section)
- Title: "Sesi Mendatang" (font-bold text-gray-900 text-lg mb-3).
- Vertical stack of GlassCards representing upcoming classes.

#### Session Card 1:
- Inside a GlassCard:
  - Top Row: 
    - Date badge: "Selasa, 4 Agustus 2026" (font-bold text-gray-900).
    - Status badge: "Terjadwal" (blue pill).
  - Main Details:
    - **Program**: "Ngaji Iqra & Al-Qur'an" (font-semibold, text-gray-800).
    - **Waktu**: "14:00 - 15:30 WIB" (text-sm, text-gray-600).
    - **Tentor**: "Kak Kiki" (text-xs, text-gray-500).
    - **Tempat**: "Rumah Siswa (Jasa tentor ke rumah)" (text-xs, text-gray-500).
  - Footer Action:
    - A button: "Hubungi Tentor (WhatsApp)" (ghost button style with WhatsApp icon, rounded-xl, full width).

#### Session Card 2:
- Inside a GlassCard:
  - Top Row:
    - Date: "Kamis, 6 Agustus 2026"
    - Status: "Terjadwal" (blue pill).
  - Details:
    - **Program**: "Ngaji Iqra & Al-Qur'an"
    - **Waktu**: "14:00 - 15:30 WIB"
    - **Tentor**: "Kak Kiki"

### 5. Riwayat Kehadiran (Past Sessions Section)
- Title: "Riwayat Pertemuan" (font-bold text-gray-900 text-lg mt-6 mb-3).
- Stack of historical GlassCard elements with 75% opacity:

#### Past Session Card 1:
- GlassCard with lower opacity:
  - Date: "Sabtu, 1 Agustus 2026"
  - Status badge: "Hadir / Selesai" (green pill).
  - Program: "Ngaji Iqra & Al-Qur'an"
  - Waktu: "14:00 - 15:30 WIB"
  - Summary: "Langkah 1 (Pengenalan Huruf Hijaiyah) selesai diajarkan."
  - Action link: "[Lihat Laporan Harian Detail]" (underlined link, text-gray-600, text-xs).

### 6. Sticky Bottom Action
- Fixed bottom button: "Ajukan Perubahan Jadwal Sesi (WhatsApp)" (primary `#4a70a9` button, full width, rounded-xl).

# Prompt: Input Laporan Harian - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Input Laporan Kegiatan Harian" (Daily Session Report Form) page accessed by the Pengajar (Tentor) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Geist Sans. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Inputs & Textareas**: `rounded-xl border border-white/70 bg-white/80 px-4 py-3 w-full outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/25 text-sm`.
- **Header Back Button**: Back arrow labeled "Kembali" (bg-white/25 border-white/40).

## Page Layout & Elements

### 1. Navigation Shell
- Left sidebar or Bottom nav.
- Active menu: **Sesi Mengajar** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Back button "Kembali" (returns user to Dashboard Pengajar). Title: "Laporan Kegiatan Harian" (bold, text-white), Subtitle: "Catat rincian materi yang dibahas dan evaluasi singkat per sesi".

### 3. Session Context Info (Summary Card)
- Inside a GlassCard:
  - Display current session metadata:
    - **Siswa**: Budi Santoso (7 Tahun - SD Kelas 2)
    - **Program**: Ngaji Iqra & Al-Qur'an (Level 2)
    - **Status Sesi**: "Selesai Mengajar - Menunggu Laporan" (text-xs text-amber-700 font-semibold).

### 4. Daily Report Form
- Inside a GlassCard:
  - **Grid 2-Kolom (Waktu & Tanggal)**:
    - **Tanggal**: Input date, value "2026-08-03" (label: "Tanggal Sesi").
    - **Waktu Belajar**: 2 input times: Jam Mulai "14:00" and Jam Selesai "15:30" (label: "Jam Belajar").
  
  - **Materi yang Dibahas / Aktivitas**:
    - Label: "Materi / Aktivitas Hari Ini" (font-semibold text-gray-700 block mb-1).
    - Textarea field: Placeholder "Tulis apa saja yang dibahas hari ini. Contoh: Membaca Iqra 2 Halaman 5 (Harakat Kasrah Sambung) dan mengulang hafalan surah Al-Fatihah." (height: ~100px).
  
  - **Catatan Pengajar (Evaluasi Murid)**:
    - Label: "Catatan & Evaluasi Pengajar" (font-semibold text-gray-700 block mb-1).
    - Textarea field: Placeholder "Tulis perkembangan fokus, kendala makhraj huruf, atau arahan latihan mandiri yang perlu diulang oleh orang tua di rumah..." (height: ~100px).

### 5. Form Actions Footer
- Inside the card:
  - A primary button: "Simpan & Kirim Laporan" (blue `#4a70a9` button, full width, rounded-xl, with a check/save icon).
  - A secondary button: "Batal / Kembali" (medium gray button, full width, rounded-xl).

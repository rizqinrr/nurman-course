# Prompt: Laporan Perkembangan - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Input Rapor Laporan Perkembangan Belajar" (Periodic Progress Evaluation Form) page accessed by the Pengajar (Tentor) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for layout groups.
- **Typography**: Geist Sans. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Inputs & Textareas**: `rounded-xl border border-white/70 bg-white/80 px-4 py-3 w-full outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/25 text-sm`.
- **Header Back Button**: Back arrow labeled "Kembali" (bg-white/25 border-white/40).

## Page Layout & Elements

### 1. Navigation Shell
- Left sidebar or Bottom nav.
- Active menu: **Laporan Perkembangan** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Back button "Kembali" (returns user to Dashboard Pengajar). Title: "Buat Rapor Perkembangan" (bold, text-white), Subtitle: "Tulis evaluasi berkala capaian belajar anak untuk dibaca orang tua".

### 3. Report Context Info (Summary Card)
- Inside a GlassCard:
  - Display student and evaluation block details:
    - **Siswa / Murid**: Budi Santoso (7 Tahun - SD Kelas 2)
    - **Program**: Ngaji Iqra & Al-Qur'an (Sessions: 12x per blok)
    - **Evaluasi**: **Blok 1 (Sesi 1 - 12)** (font-bold text-[#4a70a9]).

### 4. Progress Evaluation Form
- Inside a GlassCard:
  
  - **Capaian Perkembangan Anak**:
    - Label: "Capaian & Perkembangan Anak" (font-semibold text-gray-700 block mb-1).
    - Textarea field: Placeholder "Tulis ringkasan perkembangan sikap belajar dan minat anak. Contoh: Budi menunjukkan peningkatan fokus belajar yang sangat baik, berani mencoba mengeja sendiri, dan selalu antusias saat sesi dimulai." (height: ~100px).
  
  - **Materi yang Sudah Dipelajari & Dikuasai**:
    - Label: "Materi yang Sudah Dikuasai" (font-semibold text-gray-700 block mb-1).
    - Textarea field: Placeholder "Tulis materi/halaman/level yang sudah dikuasai dengan baik. Contoh: Pengenalan seluruh huruf hijaiyah tunggal (Iqra 1) dan penyebutan harakat fathah sambung." (height: ~100px).
  
  - **Materi yang Masih Belum Dikuasai (Perlu Pengulangan)**:
    - Label: "Materi yang Masih Perlu Pengulangan" (font-semibold text-gray-700 block mb-1).
    - Textarea field: Placeholder "Tulis materi yang masih sulit atau sering tertukar bagi anak. Contoh: Pelafalan huruf halqiyah (ha, 'ain, kho) dan pembedaan bunyi kasrah dengan harakat panjang." (height: ~100px).
  
  - **Catatan & Saran Pengajar**:
    - Label: "Catatan / Saran Pengajar untuk Wali Murid" (font-semibold text-gray-700 block mb-1).
    - Textarea field: Placeholder "Tulis saran latihan mandiri untuk dibantu orang tua di rumah. Contoh: Disarankan orang tua menemani Budi mengulang hafalan huruf 5-10 menit per hari sebelum tidur agar makhrajnya semakin matang." (height: ~100px).

### 5. Form Actions Footer
- Inside the card:
  - A primary button: "Terbitkan Rapor Perkembangan" (blue `#4a70a9` button, full width, rounded-xl, with an upload/publish icon).
  - A secondary button: "Batal / Kembali" (medium gray button, full width, rounded-xl).

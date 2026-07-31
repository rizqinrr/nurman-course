# Prompt: Kelola Materi - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Kelola Materi (MaterialItem Content Editor)" page accessed by the Admin in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Inputs & Selects**: `rounded-xl border-white/70 bg-white/80 px-4 py-2.5 w-full outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/25`.

## Page Layout & Elements

### 1. Navigation Shell
- Admin sidebar or Bottom nav.
- Active menu: **Kelola Materi** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Back button "Kembali" (takes user back to Dashboard). Title: "Editor Materi" (bold, text-white), Subtitle: "Tulis dan perbarui modul penjelasan materi teks untuk siswa".

### 3. Editor Configuration Card
- Inside a GlassCard:
  - Layout: 2-column dropdown selects.
  - Dropdown 1: **Pilih Program** (options: "Ngaji Iqra & Al-Qur'an", "Calistung Dasar").
  - Dropdown 2: **Pilih Langkah Belajar / Step** (options: "1. Pengenalan Huruf Hijaiyah", "2. Harakat Sederhana & Huruf Sambung").

### 4. Rich Text / Markdown Editor Interface
- Inside a GlassCard:
  - **Judul Materi** (input text, placeholder "Masukkan judul modul materi...")
  - **Editor Toolbar (Mock buttons Row)**:
    - Small icon buttons for formatting: Bold (B), Italic (I), Header (H1), Bullets, Numbered List, Insert Table, Insert Callout Box.
  - **Textarea Editor Canvas**:
    - A large text input area (comfortable height ~300px):
    - Background: `bg-white/80 border border-white/50 rounded-xl p-4 shadow-inner w-full min-h-[300px] outline-none text-sm leading-relaxed text-gray-800`.
    - Placeholder: "Tulis konten penjelasan lengkap materi di sini. Anda bisa memasukkan contoh-contoh lafadz membaca, tabel perubahan huruf sambung, dan panduan latihan mandiri..."
  
### 5. Editor Action Footer
- Inside the card or fixed at the bottom:
  - Button 1: "Simpan & Publikasikan" (primary `#4a70a9` button, rounded-xl).
  - Button 2: "Pratinjau Tampilan Siswa" (ghost button, rounded-xl). Allows checking how it looks in read-only format.
  - Button 3: "Batal" (secondary button, rounded-xl).

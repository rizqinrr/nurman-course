# Prompt: Materi Belajar Anak - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Materi Belajar Anak" (Child Learning Material Content Reader) page accessed by a parent (Wali Murid) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Geist Sans equivalent. Use clear typography hierarchies. H1: ~24px, H2: ~18px, Body: ~14px/16px.
- **Callout Card / Info Box**: Background `#eff6ff` (very light blue), border `border-blue-200/60`, text `#1e40af`, rounded-2xl, padding 16px.
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary/Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Header Back Button**: Back arrow labeled "Kembali" (bg-white/25 border-white/40).

## Page Layout & Elements

### 1. Navigation Shell
- Left sidebar or Bottom nav.
- Active menu: **Program Anak** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Back button "Kembali" (returns user to Program Roadmap screen). Title: "Materi Belajar Budi" (bold, text-white), Subtitle: "Modul pendukung penjelasan belajar anak".

### 3. Material Card (GlassCard)
- Render a main GlassCard as the reader pane.
- Inside content:
  - **Meta Information Row**: 
    - Category: "Ngaji - Level 2 (Iqra 2)" (text-xs text-[#4a70a9] font-bold uppercase).
    - Status Badge: "Langkah Aktif" (blue-100/blue-700 pill).
  - **Title**: "Harakat Sederhana & Huruf Sambung" (font-bold text-2xl text-gray-900 mt-2 mb-4).
  - **Parent Notice (Callout Box)**:
    - Display inside the callout styling (`bg-blue-50/50 border border-blue-200/50`):
      - Text: "Orang Tua/Wali Murid dapat menggunakan materi ini sebagai referensi untuk membantu anak mengulang pelajaran di rumah." (font-medium text-xs text-blue-900).
  - **Text Section 1: Penjelasan Harakat**:
    - Paragraph text: "Harakat adalah tanda baca untuk melafalkan huruf hijaiyah. Ada 3 harakat dasar:"
    - Bullets:
      - **Fathah ( َ )**: Garis di atas huruf, berbunyi 'A'. Contoh: بَ (Ba).
      - **Kasrah ( ِ )**: Garis di bawah huruf, berbunyi 'I'. Contoh: بِ (Bi).
      - **Dhommah ( ُ )**: Simbol lengkung di atas huruf, berbunyi 'U'. Contoh: بُ (Bu).
  - **Text Section 2: Contoh Menyambung Huruf**:
    - Table showing writing examples:
      - Column 1: Huruf Tunggal (ك - ت - b)
      - Column 2: Huruf Sambung (كَتَبَ)
      - Column 3: Lafalan (Kataba)
  
### 4. Bottom Action & Navigation Footer
- Inside the card or fixed at the bottom:
  - A primary button: "Kirim Pesan ke Tentor (WhatsApp)" (ghost button with WhatsApp icon, full width, rounded-xl, to discuss progress or ask questions).
  - A navigation grid for page flipping:
    - Left side: "← Langkah Sebelumnya" (ghost button, active/clickable).
    - Right side: "Langkah Selanjutnya →" (ghost button, disabled with low opacity because current step is not completed yet).

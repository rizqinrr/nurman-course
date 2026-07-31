# Prompt: Materi Belajar - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Materi Belajar" (Learning Material Content Reader) page accessed by a student (Peserta) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`.
- **Typography**: Geist Sans equivalent. Use clear typography hierarchies.
  - Headings (H1/H2): Bold, dark gray (`#111827`). H1: ~24px, H2: ~18px.
  - Body Text: Leading comfortable (1.6 line height), text-gray-700, font size ~14px/16px.
- **Callout Card / Info Box**: Background `#eff6ff` (very light blue), border `border-blue-200/60`, text `#1e40af`, rounded-2xl (16px radius), padding 16px.
- **Buttons**:
  - Primary button: Background color `#4a70a9`, text white, rounded-xl.
  - Secondary/Ghost button: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Header Back Button**: Back arrow labeled "Kembali" (bg-white/25 border-white/40).

## Page Layout & Elements

### 1. Navigation Shell
- Left sidebar or Bottom nav.
- Active menu: **Materi** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Back button "Kembali" (returns user to Program Roadmap screen). Title: "Materi Belajar" (bold, text-white), Subtitle: "Baca dan pahami materi penjelasan di bawah ini".

### 3. Material Card (GlassCard)
- Render a main GlassCard as the reader pane.
- Inside content:
  - **Meta Information Row**: 
    - Category: "Ngaji - Level 2 (Iqra 2)" (text-xs text-[#4a70a9] font-bold uppercase letter-spacing).
    - Status Badge: "Sedang Dipelajari" (blue-100/blue-700 pill).
  - **Title**: "Harakat Sederhana & Huruf Sambung" (font-bold text-2xl text-gray-900 mt-2 mb-4).
  - **Text Section 1: Pengenalan Harakat**:
    - Paragraph text: "Harakat adalah tanda baca yang diletakkan di atas atau di bawah huruf hijaiyah untuk menentukan bunyi vokal. Ada 3 harakat dasar yang wajib dipahami:"
    - Bullet points:
      - **Fathah ( َ )**: Garis di atas huruf, bersuara 'A'. Contoh: بَ (Ba).
      - **Kasrah ( ِ )**: Garis di bawah huruf, bersuara 'I'. Contoh: بِ (Bi).
      - **Dhommah ( ُ )**: Simbol mirip angka sembilan kecil di atas huruf, bersuara 'U'. Contoh: بُ (Bu).
  - **Text Section 2: Contoh Huruf Sambung**:
    - Paragraph text: "Huruf sambung adalah bentuk huruf hijaiyah ketika dirangkai dalam kata. Posisi huruf (awal, tengah, akhir) mengubah bentuk penulisannya."
    - A stylized table or grid showing writing examples:
      - Column 1: Huruf Tunggal (e.g. ك - ت - ب)
      - Column 2: Huruf Sambung (e.g. كَتَبَ)
      - Column 3: Lafadz / Cara Baca (e.g. Kataba)
  - **Callout Practice Box**:
    - Display inside the callout styling (`bg-blue-50/50 border border-blue-200/50`):
      - Title: "Latihan Membaca Mandiri:" (font-bold, text-blue-900, text-sm).
      - Instructions: "Latihlah mengeja sambungan harakat berikut bersama tentor pada sesi selanjutnya: \n• جَلَسَ (Ja - La - Sa) \n• كَرُمَ (Ka - Ru - Ma)"
  
### 4. Bottom Action & Navigation Footer
- Inside the card or fixed at the bottom:
  - A primary button: "Selesai & Tandai Selesai" (blue `#4a70a9` background, full width, rounded-xl, with a check icon).
  - A navigation grid for page flipping:
    - Left side: "← Langkah Sebelumnya" (ghost button, active/clickable).
    - Right side: "Langkah Selanjutnya →" (ghost button, disabled state with low opacity because current step is not marked completed yet).

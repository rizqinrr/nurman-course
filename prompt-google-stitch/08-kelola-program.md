# Prompt: Kelola Program - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Kelola Program" (Program CRUD Management Panel) page accessed by the Admin in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside cards, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped content.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Inputs**: `rounded-xl border-white/70 bg-white/80 px-4 py-2.5 w-full outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/25`.
- **Status Badges**:
  - Active: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Inactive: Background `#f3f4f6` (light gray), text `#4b5563` (gray), rounded-full, font-bold, text-xs.

## Page Layout & Elements

### 1. Navigation Shell
- Admin sidebar (desktop) or Bottom nav (mobile).
- Active menu: **Kelola Program** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Title "Kelola Program" (bold, text-white), Subtitle "Kelola data produk les, kategori, dan harga dasar kelas".
- Quick action next to header: **"+ Program Baru"** (primary `#4a70a9` button, rounded-xl).

### 3. Program List Grid
- Display existing programs in stacked GlassCards.

#### Program Item Card 1:
- Inside a GlassCard:
  - Header Row:
    - Title: "Ngaji Iqra & Al-Qur'an" (font-bold text-gray-900 text-lg).
    - Status Badge: "Aktif" (green pill).
  - Details:
    - **Kategori**: Agama (text-xs text-[#4a70a9] bg-blue-50 font-semibold px-2 py-0.5 rounded-full).
    - **Harga Dasar**: Rp 15.000 / sesi (font-bold text-gray-700).
    - **Jumlah Sesi Terkait**: 2 modul roadmap.
  - Action Footer (aligned right):
    - A button: "Edit Program" (ghost button, rounded-xl, sm).
    - A button: "Hapus" (underlined red text link or border-red-200 button, rounded-xl, sm).

#### Program Item Card 2:
- Inside a GlassCard:
  - Header Row:
    - Title: "Calistung Dasar"
    - Status Badge: "Aktif" (green pill).
  - Details:
    - **Kategori**: Dasar & PAUD
    - **Harga Dasar**: Rp 15.000 / sesi
    - **Jumlah Sesi Terkait**: 2 modul.
  - Action Footer:
    - A button: "Edit Program"
    - A button: "Hapus".

### 4. Create / Edit Program Form (Toggled Card view)
*When "+ Program Baru" is clicked, show this Form Card:*
- GlassCard with Title: "Tambah Program Belajar"
- Form fields:
  - **Nama Program** (input text, placeholder "Contoh: Komputer Dasar")
  - **Kategori** (select dropdown, options: Agama, Dasar & PAUD, Mata Pelajaran, Teknologi)
  - **Harga Dasar per Sesi** (input number, placeholder "Contoh: 30000")
  - **Status Program** (toggle switch or select: "Aktif" or "Nonaktif")
  - **Deskripsi Program** (textarea, placeholder "Tulis ringkasan tentang apa yang dipelajari...")
- Form action buttons:
  - Primary button: "Simpan" (blue `#4a70a9` button, rounded-xl).
  - Secondary button: "Batal" (ghost button, rounded-xl).

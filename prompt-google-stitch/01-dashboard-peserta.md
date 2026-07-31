# Prompt: Dashboard Peserta - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the Main Dashboard page accessed by a logged-in student (Peserta) of "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (optimal viewport width: 400px - 600px).
- **Background**: Vertical gradient background from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside cards, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Sans-serif (Geist Sans equivalent). 
  - Section Headings: Bold, color dark gray (`#111827`), size ~18px.
  - Page Titles: Bold, color white (`#ffffff`) or dark gray depending on background, size ~28px.
- **Buttons**:
  - Primary button: Background color `#4a70a9`, text white, rounded-xl.
  - Secondary button: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
  - Ghost button: Background `bg-white/40 border border-white/60 text-gray-700 hover:bg-white/60`, rounded-xl.
- **Status Badges (Pills)**:
  - Active status: Background `#dcfce7` (light green), text `#15803d` (dark green), font-bold, text-xs, rounded-full.
  - Unpaid/Alert status: Background `#fee2e2` (light red), text `#b91c1c` (dark red), font-bold, text-xs, rounded-full.
  - Waiting status: Background `#fef3c7` (light amber), text `#92400e` (dark amber), font-bold, text-xs, rounded-full.
- **Logo**: `/Nlogo.png` (white bg badge with blue 'N' logo) floating in the corner.

## Page Layout & Navigation Shell

### 1. Navigation Bar / Shell (Responsive)
- **Desktop (Left Sidebar)** or **Mobile (Bottom Nav Bar)**:
  - Provide a fixed navigation menu. It should contain icons and text links:
    - **Dashboard** (Active state - highlighted with `#4a70a9` background and white text, or solid `#4a70a9` icon/text).
    - **Program**
    - **Materi**
    - **Jadwal**
    - **Tagihan**
  - Highlighting: Active tab uses primary blue color `#4a70a9` for background or text. Inactive tabs use semi-transparent white/gray text `#4b5563`.
  - Include a prominent **Logout (Keluar)** button or link (ghost or secondary style, using a logout icon).

### 2. Header Area (Top)
- Left side: Display greeting "Halo, Budi Santoso!" (text-gray-900 or text-white depending on gradient contrast, text-2xl font-bold) and a subtitle "Selamat datang kembali di area belajar Anda." (text-gray-600, text-sm).
- Right side: Display the user profile icon and the "Keluar" (Logout) button.

### 3. Dashboard Content Area (Stacked vertically inside `max-w-2xl` layout)

#### Block A: Status Belajar (Active Program Summary Card)
- Render a GlassCard.
- Title: "Program Aktif Anda" (text-gray-900, font-bold, text-lg).
- Inside content:
  - A sub-card containing:
    - Left side: Program name: "Ngaji Iqra & Al-Qur'an" (font-bold text-gray-900) and Level description: "Level 2 - Harakat Sederhana dan Huruf Sambung" (text-gray-600, text-xs).
    - Right side: A status badge: "Aktif" (green-100/green-700 pill).
  - A progress bar indicator showing "Langkah 2 dari 6 selesai" with a thin blue progress bar loaded to ~33%.
  - A primary button at the bottom of the card: "Lanjut Belajar" (blue background, full width, rounded-xl).

#### Block B: Sesi Belajar Terdekat (Upcoming Schedule Card)
- Render a GlassCard.
- Title: "Jadwal Sesi Terdekat" (text-gray-900, font-bold, text-lg).
- Inside content:
  - Display next session details inside a minimal card:
    - Day/Date: "Besok - Selasa, 4 Agustus 2026"
    - Time: "14:00 - 15:30 WIB"
    - Place: "Rumah Siswa (Jasa tentor ke rumah)"
    - Capacity status: "Sesi Privat (1 Siswa)"
  - Link/Button: "Lihat Seluruh Jadwal" (ghost button variant, border-white/60).

#### Block C: Ringkasan Keuangan (Payment Alert Card)
- Render a GlassCard.
- Title: "Tagihan & Pembayaran" (text-gray-900, font-bold, text-lg).
- Inside content:
  - If there is a pending bill:
    - Show an alert card (white background, red border border-red-200/50).
    - Label: "Tagihan Minggu Ini: Rp 120.000 / minggu"
    - Status Badge: "Belum Dibayar" (red-100/red-700 pill).
    - Due date text: "Jatuh tempo: 7 Agustus 2026".
    - Button: "Bayar Sekarang" (blue `#4a70a9` button) or "Konfirmasi Bayar".
  - If paid:
    - Show a green card with status "Lunas" (green-100/green-700 pill) and text "Semua tagihan terbayar. Terima kasih!".

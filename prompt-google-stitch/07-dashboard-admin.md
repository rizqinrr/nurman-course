# Prompt: Dashboard Admin - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Dashboard Utama Admin" (Admin Main Dashboard) portal of "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for layout groups.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Status Badges**:
  - Waiting action/Pending: Background `#fef3c7` (light amber), text `#92400e` (dark amber), rounded-full, font-bold, text-xs.
  - Success/Normal: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Informational/Blue: Background `#dbeafe` (light blue), text `#1e40af` (dark blue), rounded-full, font-bold, text-xs.

## Page Layout & Navigation Shell

### 1. Admin Navigation Sidebar (Desktop) or Bottom Nav (Mobile)
- Menu links with icons:
  - **Dashboard** (Active highlighted state, text/icon in `#4a70a9`).
  - **Kelola Program**
  - **Kelola Jadwal**
  - **Kelola Tagihan**
  - **Kelola Materi**
- Include profile name: "Admin Nurman" and a visible "Keluar" (Logout) button.

### 2. Header Area
- Left: Greeting "Halo, Admin!" (text-gray-900, font-bold, text-2xl), subtitle "Portal manajemen & pemantauan data LMS Nurman Course" (text-gray-600, text-sm).
- Right: System status badge "Berjalan Lancar" (green pill).

### 3. Statistics Grid (Dashboard widgets)
- A 2x2 grid of small GlassCards displaying core metrics:
  - **Card 1: Total Peserta**
    - Value: "12 Siswa" (font-bold text-gray-900 text-xl).
    - Label: "2 pendaftaran baru minggu ini" (text-gray-500 text-xs).
  - **Card 2: Sesi Minggu Ini**
    - Value: "36 Sesi"
    - Label: "Terjadwal oleh 3 tentor".
  - **Card 3: Tagihan Tertunda**
    - Value: "Rp 360.000" (text-red-700 font-bold).
    - Label: "3 invoice belum terbayar".
  - **Card 4: Konfirmasi Pembayaran**
    - Value: "2 Bukti" (text-amber-700 font-bold).
    - Label: "Menunggu persetujuan manual".

### 4. Sesi Belajar Hari Ini (Today's Scheduled Sessions List)
- Title: "Sesi Belajar Hari Ini" (font-bold text-gray-900 text-lg mb-3).
- Inside a GlassCard:
  - Vertical list of today's classes:
    - **Sesi 1 (14:00 - 15:30)**: Budi Santoso - Ngaji Iqra 2 (Tentor: Kak Kiki) - Badge: "Terjadwal" (blue pill).
    - **Sesi 2 (16:00 - 17:30)**: Ani Lestari - Calistung L1 (Tentor: Kak Fikri) - Badge: "Selesai" (green pill).

### 5. Quick Approvals (Konfirmasi Pembayaran Terbaru)
- Title: "Persetujuan Pembayaran" (font-bold text-gray-900 text-lg mt-6 mb-3).
- Render a list of GlassCards for pending manual proof approvals:
  - **Item Card**:
    - Header: "Invoice #INV-202608-001 - Budi Santoso"
    - Amount: "Rp 120.000"
    - Proof Attached: "bukti-transfer-budi.png" (clickable link/preview thumbnail).
    - Action Group:
      - Tombol 1: "Setujui & Tandai Lunas" (primary `#4a70a9` button, rounded-xl).
      - Tombol 2: "Tolak Pembayaran" (secondary `#cbcbcb` button, rounded-xl).

# Prompt: Kelola Jadwal - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Kelola Jadwal Sesi (Session CRUD Management)" page accessed by the Admin in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Inputs & Selects**: `rounded-xl border-white/70 bg-white/80 px-4 py-2.5 w-full outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/25`.
- **Status Badges**:
  - Scheduled: Background `#dbeafe` (light blue), text `#1e40af` (dark blue), rounded-full, font-bold, text-xs.
  - Completed: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.
  - Cancelled: Background `#fee2e2` (light red), text `#b91c1c` (dark red), rounded-full, font-bold, text-xs.

## Page Layout & Elements

### 1. Navigation Shell
- Admin sidebar or Bottom nav.
- Active menu: **Kelola Jadwal** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Title "Jadwal Belajar" (bold, text-white), Subtitle "Kelola agenda pertemuan kelas, tentor, dan presensi kehadiran".
- Quick action next to header: **"+ Sesi Baru"** (primary `#4a70a9` button, rounded-xl).

### 3. Date & Program Filters
- Filter row containing:
  - Input date picker: "Tanggal" (default: Today)
  - Select dropdown: "Pilih Program" (options: "Semua Program", "Ngaji", "Calistung")

### 4. Active Sessions List (Vertical Stack of GlassCards)

#### Session Item Card 1:
- Inside a GlassCard:
  - Header Row:
    - Time details: "Selasa, 4 Agustus 2026 (14:00 - 15:30)" (font-bold text-gray-900).
    - Status Badge: "Terjadwal" (blue pill).
  - Main Details:
    - **Siswa**: Budi Santoso (font-semibold, text-gray-800).
    - **Program**: Ngaji Iqra & Al-Qur'an (Level 2).
    - **Tentor**: Kak Kiki.
    - **Tempat**: Rumah Siswa (+10rb).
  - Action Footer (aligned right):
    - Button 1: "Tandai Selesai / Hadir" (success style or primary `#4a70a9` button, rounded-xl, sm).
    - Button 2: "Edit Sesi" (ghost button, rounded-xl, sm).
    - Button 3: "Batalkan" (underlined red text link).

#### Session Item Card 2 (Selesai):
- Inside a GlassCard with 70% opacity:
  - Header Row:
    - Time: "Senin, 3 Agustus 2026 (16:00 - 17:30)"
    - Status Badge: "Selesai" (green pill).
  - Details:
    - **Siswa**: Ani Lestari
    - **Program**: Calistung L1 (Tentor: Kak Fikri)
  - Action Footer:
    - Text indicator: "Presensi: Hadir (Langkah 1 Selesai)".

### 5. Create / Edit Session Form (Toggled Card view)
*When "+ Sesi Baru" is clicked, show this Form Card:*
- GlassCard with Title: "Jadwalkan Sesi Baru"
- Form fields:
  - **Program Belajar** (select dropdown, options: Ngaji, Calistung, Mapel SD)
  - **Nama Siswa / Peserta** (select dropdown or text search)
  - **Nama Tentor / Pengajar** (select dropdown, options: Kak Kiki, Kak Fikri)
  - **Tanggal Sesi** (input date)
  - **Jam Mulai** (input time, e.g. "14:00")
  - **Jam Selesai** (input time, e.g. "15:30")
  - **Tempat Belajar** (select: "Rumah Siswa" or "Rumah Tentor")
  - **Kapasitas** (input number, default "1")
- Form action buttons:
  - Primary button: "Buat Jadwal Sesi" (blue `#4a70a9` button, rounded-xl).
  - Secondary button: "Batal" (ghost button, rounded-xl).

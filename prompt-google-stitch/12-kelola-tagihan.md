# Prompt: Kelola Tagihan - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Kelola Tagihan & Pembayaran (Invoice CRUD & Approval)" page accessed by the Admin in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside cards, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for grouped contents.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb` (medium gray), text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Inputs & Selects**: `rounded-xl border-white/70 bg-white/80 px-4 py-2.5 w-full outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/25`.
- **Status Badges**:
  - Waiting Action/Pending: Background `#fef3c7` (light amber), text `#92400e` (dark amber), rounded-full, font-bold, text-xs.
  - Unpaid: Background `#fee2e2` (light red), text `#b91c1c` (dark red), rounded-full, font-bold, text-xs.
  - Paid/Lunas: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.

## Page Layout & Elements

### 1. Navigation Shell
- Admin sidebar or Bottom nav.
- Active menu: **Kelola Tagihan** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Title "Kelola Keuangan" (bold, text-white), Subtitle "Pantau status tagihan, verifikasi bukti transfer siswa, dan terbitkan invoice baru".
- Quick action next to header: **"+ Buat Tagihan"** (primary `#4a70a9` button, rounded-xl).

### 3. Filter Tabs (Horizontal list)
- Render tabs with indicators/counts:
  - **Menunggu Persetujuan (2)** (Active tab, highlighted text, bottom line indicators)
  - **Belum Dibayar (3)** (Inactive tab)
  - **Lunas (15)** (Inactive tab)

### 4. Invoice List (Vertical Stack of GlassCards)

#### Invoice Item Card 1 (Menunggu Persetujuan):
- Inside a GlassCard:
  - Header Row:
    - Invoice ID: "Invoice #INV-202608-001" (font-bold text-gray-900).
    - Status Badge: "Menunggu Persetujuan" (amber pill).
  - Main Details:
    - **Siswa / Pendaftar**: Budi Santoso (font-semibold, text-gray-800).
    - **Program**: Ngaji Iqra & Al-Qur'an (3x/minggu).
    - **Periode Tagihan**: 1 Agustus - 7 Agustus 2026.
    - **Jumlah**: Rp 120.000 (font-bold text-[#4a70a9]).
    - **Lampiran Bukti**: [bukti-transfer-budi.png] (clickable attachment preview link).
  - Action Footer (aligned right):
    - Button 1: "Setujui & Tandai Lunas" (success style or primary `#4a70a9` button, rounded-xl, sm).
    - Button 2: "Tolak & Minta Upload Ulang" (secondary button, rounded-xl, sm).

#### Invoice Item Card 2 (Belum Dibayar):
*Show if user switches tabs:*
- Inside a GlassCard:
  - Header Row:
    - Invoice ID: "Invoice #INV-202608-002"
    - Status Badge: "Belum Dibayar" (red pill).
  - Details:
    - Siswa: Ani Lestari
    - Jumlah: Rp 120.000
    - Jatuh Tempo: 7 Agustus 2026 (text-red-600 font-medium text-xs).
  - Action Footer:
    - A button: "Kirim Pengingat WA" (ghost button with WhatsApp icon, rounded-xl, sm).

### 5. Create Invoice Form (Toggled Card view)
*When "+ Buat Tagihan" is clicked, show this Form Card:*
- GlassCard with Title: "Terbitkan Tagihan Baru"
- Form fields:
  - **Pilih Siswa** (select dropdown, showing enrolled active students)
  - **Jumlah Tagihan (Rupiah)** (input number, placeholder "Contoh: 120000")
  - **Periode Belajar** (2 input dates: Tanggal Mulai & Tanggal Selesai)
  - **Batas Jatuh Tempo** (input date)
  - **Catatan Tambahan** (textarea, placeholder "Contoh: Tagihan termasuk biaya transport tentor ke rumah")
- Form action buttons:
  - Primary button: "Terbitkan Invoice" (blue `#4a70a9` button, rounded-xl).
  - Secondary button: "Batal" (ghost button, rounded-xl).

# Prompt: Tagihan Peserta - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Tagihan & Pembayaran" (Invoices & Payments) page accessed by a student (Peserta) in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Sub-cards inside should use `bg-white/60 border border-white/80 rounded-2xl` for layout groupings.
- **Typography**: Geist Sans equivalent. Headings and labels: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary Buttons**: Background `#cbcbcb`, text gray-900, rounded-xl.
- **Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Status Badges**:
  - Unpaid: Background `#fee2e2` (light red), text `#b91c1c` (dark red), rounded-full, font-bold, text-xs.
  - Waiting Confirmation: Background `#fef3c7` (light amber), text `#92400e` (dark amber), rounded-full, font-bold, text-xs.
  - Paid/Lunas: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded-full, font-bold, text-xs.

## Page Layout & Elements

### 1. Navigation Shell
- Left sidebar or Bottom nav.
- Active menu: **Tagihan** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Title "Tagihan Saya" (bold, text-white), Subtitle "Lacak tagihan mingguan les Anda dan lakukan konfirmasi pembayaran".

### 3. Tagihan Aktif (Current Active Invoice Section)
- Title: "Tagihan Belum Dibayar" (font-bold text-gray-900 text-lg mb-3).
- Render a GlassCard container:
  - **Header Row**:
    - Title: "Invoice #INV-202608-001" (font-bold text-gray-900).
    - Status Badge: "Belum Dibayar" (red pill).
  - **Details Area**:
    - Program Name: "Ngaji Iqra & Al-Qur'an (3x/minggu)"
    - Billing Period: "Periode: 1 Agustus - 7 Agustus 2026"
    - Due Date: "Jatuh Tempo: 7 Agustus 2026"
    - Total Amount: "Rp 120.000" (large font-bold text-[#4a70a9] text-2xl mt-1).
  - **Price Breakdown (inside sub-card)**:
    - Biaya Sesi Belajar: Rp 110.000
    - Jasa Transport Tentor ke Rumah: Rp 10.000
    - **Total Pembayaran**: **Rp 120.000**
  - **Payment Instructions Box (bg-white/70, border-white/80, p-4, rounded-2xl)**:
    - Instruction Text: "Silakan transfer pembayaran ke rekening berikut:"
    - Bank Details: **Bank Mandiri - 139002234xxx** a/n **Nurman Course**
    - Note: "Mohon transfer nominal pas sesuai tagihan dan simpan bukti transfer."
  - **Upload Area & Action Button**:
    - A mock file uploader field with a dashed border: "Klik untuk unggah bukti transfer (JPEG/PNG)".
    - A primary CTA button at the bottom: "Konfirmasi Pembayaran via WhatsApp" (blue `#4a70a9` button, with a WhatsApp icon, full width).

### 4. Riwayat Tagihan (Payment History Section)
- Title: "Riwayat Pembayaran" (font-bold text-gray-900 text-lg mt-6 mb-3).
- Stack of historical GlassCard elements with lower opacity:

#### Past Invoice Card 1:
- GlassCard with 75% opacity:
  - Header Row:
    - Invoice ID: "Invoice #INV-202607-004"
    - Status Badge: "Lunas" (green pill).
  - Details:
    - Amount: "Rp 120.000"
    - Date Paid: "Dibayar pada: 29 Juli 2026 pukul 15:30"
    - Program: "Ngaji Iqra & Al-Qur'an"

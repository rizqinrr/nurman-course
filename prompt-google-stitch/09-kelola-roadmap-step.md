# Prompt: Kelola Roadmap Step - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI for the "Kelola Langkah Belajar (RoadmapStep CRUD)" page accessed by the Admin in "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (viewport: 400px - 600px).
- **Background**: Vertical gradient from soft blue to plain white: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card containers (GlassCard)**: `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside, use sub-cards with `bg-white/60 border border-white/80 rounded-2xl` for layout groups.
- **Typography**: Geist Sans equivalent. Titles: Bold, dark gray (`#111827`).
- **Primary Buttons**: Background `#4a70a9`, text white, rounded-xl.
- **Secondary/Ghost Buttons**: Background `bg-white/40 border border-white/60 text-gray-700`, rounded-xl.
- **Inputs**: `rounded-xl border-white/70 bg-white/80 px-4 py-2.5 w-full outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/25`.

## Page Layout & Elements

### 1. Navigation Shell
- Admin sidebar or Bottom nav.
- Active menu: **Kelola Program** (highlighted `#4a70a9` icon/text).

### 2. Header
- PageHeader: Back button "Kembali ke Program" (takes user to the Program List screen). Title: "Peta Jalan Belajar" (bold, text-white), Subtitle: "Susun langkah, tingkatan level, dan peta jalan program Ngaji Iqra & Al-Qur'an".
- Quick action next to header: **"+ Langkah Baru"** (primary `#4a70a9` button, rounded-xl).

### 3. Roadmap Steps Ordered List (Vertical Timeline Style)
- Display a vertical list of current roadmap steps. Show handles or arrow indicators representing that these steps can be reordered.

#### Step Item 1:
- Inside a GlassCard:
  - Header Row:
    - Order Badge: "1" (circular gray bg badge, text-sm font-bold).
    - Step Title: "Pengenalan Huruf Hijaiyah" (font-bold text-gray-900).
  - Details:
    - **Tingkat/Level**: "Iqra 1" (text-xs text-[#4a70a9] font-bold bg-blue-50 px-2 py-0.5 rounded-full).
    - **Deskripsi**: "Belajar melafalkan huruf hijaiyah tunggal dengan makhraj yang benar." (text-gray-500, text-xs).
  - Action Footer (aligned right):
    - A button: "Edit" (ghost button, rounded-xl, sm).
    - A button: "Hapus" (underlined red text link).

#### Step Item 2:
- Inside a GlassCard:
  - Header Row:
    - Order Badge: "2"
    - Step Title: "Harakat Sederhana & Huruf Sambung"
  - Details:
    - **Tingkat/Level**: "Iqra 2"
    - **Deskripsi**: "Belajar membaca harakat fathah, kasrah, dhommah, dan teknik menyambung huruf."
  - Action Footer:
    - A button: "Edit"
    - A button: "Hapus".

### 4. Create / Edit Step Form (Toggled Card view)
*When "+ Langkah Baru" is clicked, show this Form Card:*
- GlassCard with Title: "Tambah Langkah Belajar"
- Form fields:
  - **Judul Langkah** (input text, placeholder "Contoh: Membaca Tanwin & Harakat Panjang")
  - **Nomor Urut (Order)** (input number, placeholder "Contoh: 3")
  - **Tingkatan / Level** (input text, placeholder "Contoh: Iqra 3")
  - **Penjelasan Singkat (Body Text)** (textarea, placeholder "Tulis ringkasan singkat materi langkah ini...")
- Form action buttons:
  - Primary button: "Simpan Langkah" (blue `#4a70a9` button, rounded-xl).
  - Secondary button: "Batal" (ghost button, rounded-xl).

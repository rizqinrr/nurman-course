# 🧭 Project Overview

- Aplikasi frontend untuk alur pendaftaran les Nurman Course.
- Tujuan: mengarahkan user dari pilih program → konfigurasi → WhatsApp dengan cepat.
- Tech stack: Next.js (App Router), React, Tailwind CSS.
- UI style: glassmorphism ringan, modern, mobile-first.
- Tidak menggunakan backend (semua data statis, output ke WhatsApp).

---

# 🚪 Entry Points (Quick Navigation)

- /course → Landing hero (start)
- /course/program → Pilih program utama
- /course/materi → List materi
- /course/jenjang → List jenjang
- /course/calistung → Program calistung
- /course/materi/[id] → Detail materi + level
- /course/config → Konfigurasi akhir + pricing

---

# 🔀 Routing Flow

/course  
→ Hero landing  
→ CTA ke /course/program

/course/program  
→ Pilih:

- materi
- jenjang
- calistung

/course/materi  
→ List materi  
→ klik → /course/materi/[id]

/course/materi/[id]  
→ Pilih level  
→ klik → /course/config

/course/jenjang  
→ List jenjang (SD 1–3, SD 4–6, SMP)  
→ klik → /course/config

/course/calistung  
→ List program calistung  
→ klik → /course/config

/course/config  
→ Pilih:

- durasi
- frekuensi
- peserta
- hari
- jam  
  → hitung harga  
  → kirim ke WhatsApp

---

# 🧠 State Management

- Semua state menggunakan local state (useState)
- Tidak ada global state (Redux/Zustand)
- Tidak ada persistence (refresh akan reset state)
- Data antar halaman dikirim melalui URL query params:
  - materi
  - level
  - program (optional)

---

# 📁 Folder Structure (Clean)

/app → routing & halaman  
/components/ui → reusable UI (Button, Chip, GlassCard)  
/components/course → (kosong / legacy, tidak dipakai aktif)  
/data → data statis (materials)  
/utils → helper functions  
/lib → konstanta global

---

# 📦 Folder Responsibilities

app/

- Semua routing berbasis App Router
- Entry point semua flow user

components/ui/

- Komponen UI reusable
- Tidak mengandung logic bisnis

components/course/

- Legacy (tidak digunakan aktif)
- Jangan dipakai kecuali direfaktor ulang

data/

- Single source of truth untuk materi/jenjang/calistung

utils/

- Helper kecil (formatting, dll)

lib/

- Konstanta global (contoh: WHATSAPP_NUMBER)

---

# 🧩 Key Files Map

app/course/page.tsx

- Role: Hero landing
- Navigates to: /course/program

app/course/program/page.tsx

- Role: Pilih program utama
- Routes ke: materi / jenjang / calistung

app/course/materi/page.tsx

- Role: List materi
- Uses: getMaterialsByCategory("materi")
- Routes: /course/materi/[id]

app/course/materi/[id]/page.tsx

- Role: Detail materi + level
- Uses: getMaterialById
- Routes: /course/config

app/course/jenjang/page.tsx

- Role: List jenjang
- Uses: getMaterialsByCategory("jenjang")
- Routes: /course/config

app/course/calistung/page.tsx

- Role: Program calistung
- Uses: getMaterialsByCategory("calistung")
- Routes: /course/config

app/course/config/page.tsx

- Role: Konfigurasi + pricing + CTA
- Uses:
  - getMaterialById
  - UI components
  - WHATSAPP_NUMBER
- Output: WhatsApp URL

data/materials.ts

- Role: Data utama (materi, jenjang, calistung)
- Helper:
  - getMaterialById
  - getMaterialsByCategory

utils/format.ts

- Role: Format harga (rb/jt)

lib/constants.ts

- Role: Konstanta global (WA number)

---

# 🔗 Data Flow

materials.ts  
→ digunakan di halaman list/detail  
→ user memilih item + level  
→ dikirim via query params  
→ diterima di /course/config  
→ dihitung harga  
→ diringkas  
→ dikirim ke WhatsApp

---

# 💰 Pricing Responsibility

- Base price: data/materials.ts
- Calculation: HANYA di /course/config

Multipliers:

- duration (60 / 90)
- frequency (1 / 2 / 3)
- participants (1 / 2 / 3)

Formula:
finalPrice = basePrice × duration × frequency × participantsMultiplier

❌ Dilarang menghitung harga di halaman lain  
❌ Dilarang duplikasi logic pricing

---

# ⚠️ Special Cases

Calistung:

- Tidak ada pemilihan materi/level kompleks
- Langsung ke config
- Di config:
  - gunakan label "Program"
  - bukan "Materi"

Jenjang:

- Bukan mapel (bukan matematika)
- Representasi level pendidikan

---

# ⚠️ Important Rules

- Jangan hardcode data di page
- Selalu gunakan data/materials.ts
- Jangan duplikasi logic pricing
- Jangan ubah routing tanpa alasan kuat
- Gunakan komponen UI yang sudah ada

---

# ⚠️ Known Limitations

- Tidak ada backend
- Tidak ada database
- Tidak ada authentication
- Semua data statis
- State tidak persistent
- Tidak ada validasi server-side

---

# 🧠 Notes for Future Development

Tambah materi:
→ edit data/materials.ts

Ubah pricing:
→ edit app/course/config/page.tsx

Ubah UI:
→ edit components/ui/

Tambah program baru:
→ update:

- program page
- materials.ts
- routing terkait

Jika ingin scaling:

- bisa tambah backend
- bisa tambah database
- bisa tambah booking system

---

# 🎯 Goal

Menjaga flow tetap:

- cepat
- sederhana
- mudah dipahami user
- mudah dipahami AI

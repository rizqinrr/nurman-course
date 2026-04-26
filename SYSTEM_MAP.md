# 🧭 Project Overview

- Aplikasi frontend untuk alur pendaftaran les Nurman Course.
- Tech stack: Next.js App Router, React, Tailwind CSS.
- Gaya UI: glassmorphism ringan, mobile-first, flow cepat ke WhatsApp.

---

# 🔀 Routing Flow

/course  
→ Landing hero. CTA ke /course/program.

/course/program  
→ Pilih jenis program (materi, jenjang, calistung).

/course/materi  
→ List materi kategori materi dari data statis.

/course/jenjang  
→ List jenjang pendidikan (SD 1-3, SD 4-6, SMP) dari data statis.

/course/calistung  
→ List program calistung dari data statis.

/course/materi/[id]  
→ Detail materi, pilih level, lanjut ke config.

/course/config  
→ Konfigurasi durasi/frekuensi/peserta/hari/jam, hitung estimasi, kirim ke WhatsApp.

/course/config → WhatsApp  
→ Data pilihan di-encode ke URL wa.me menggunakan nomor dari constants.

---

# 📁 Folder Structure (Clean)

app/
components/
data/
utils/
lib/

---

# 📦 Folder Responsibilities

- app/ → routing dan halaman (entry point flow user).
- components/ui/ → komponen reusable UI (Button, Chip, GlassCard).
- components/course/ → saat ini kosong (komponen domain lama sudah dibersihkan).
- data/ → sumber data statis materi dan kategori (single source data konten).
- utils/ → helper utilitas (format harga).
- lib/ → konstanta global (contoh nomor WhatsApp).

---

# 🧩 Key Files Map

app/course/page.tsx

- Role: Hero landing khusus flow course.
- Navigates to: /course/program.

app/course/program/page.tsx

- Role: Pilihan program utama.
- Routes to: /course/materi, /course/jenjang, /course/calistung.

app/course/materi/page.tsx

- Role: List materi kategori materi.
- Uses: getMaterialsByCategory("materi"), formatPrice.
- Routes to: /course/materi/[id].

app/course/jenjang/page.tsx

- Role: List jenjang pendidikan.
- Uses: getMaterialsByCategory("jenjang"), formatPrice.
- Routes to: /course/config?materi={id}&level=1.

app/course/calistung/page.tsx

- Role: List program calistung.
- Uses: getMaterialsByCategory("calistung"), formatPrice.
- Routes to: /course/config?program=calistung&materi={id}&level=1.

app/course/materi/[id]/page.tsx

- Role: Detail materi + pemilihan level.
- Uses: getMaterialById(id), formatPrice.
- Routes to: /course/config?materi={id}&level={selectedLevel}.

app/course/config/page.tsx

- Role: Halaman konfigurasi akhir + pricing + CTA WhatsApp.
- Uses: getMaterialById, Chip/Button/GlassCard, WHATSAPP_NUMBER.
- Sends data to: URL WhatsApp (wa.me).

data/materials.ts

- Role: Sumber data materi/jenjang/calistung + helper getMaterialById/getMaterialsByCategory.

utils/format.ts

- Role: Format tampilan harga ringkas (rb/jt).

lib/constants.ts

- Role: Konstanta global, termasuk WHATSAPP_NUMBER.

---

# 🔗 Data Flow

materials.ts  
→ dipakai di halaman list/detail (materi, jenjang, calistung)  
→ user memilih item + level  
→ parameter dikirim via URL query ke /course/config  
→ config hitung estimasi harga dinamis  
→ ringkasan dikirim ke WhatsApp.

---

# ⚠️ Important Rules

- Jangan hardcode daftar materi di page, selalu ambil dari data/materials.ts.
- Logika pricing utama tetap terpusat di app/course/config/page.tsx.
- Routing flow harus konsisten: /course → /program → pilihan program → /config.
- Nomor WhatsApp gunakan lib/constants.ts, jangan duplikasi angka di file lain.

---

# 🧠 Notes for Future Development

- Tambah/ubah materi: edit data/materials.ts.
- Ubah perhitungan harga: edit app/course/config/page.tsx.
- Ubah tampilan tombol/chip/card global: edit components/ui/.
- Jika menambah program baru, update:
  - app/course/program/page.tsx (entry pilihan)
  - data/materials.ts (data kategori)
  - page turunan program sesuai kebutuhan.

# Cek Jarak & Biaya — Tempat Les

Aplikasi web interaktif untuk menghitung jarak rute jalan dan estimasi biaya transport/kunjungan tentor les privat ke rumah siswa menggunakan **React (Vite)**, **Leaflet (react-leaflet)**, dan **OpenRouteService API**.

---

## 🛠️ Persyaratan Sistem
- Node.js versi 18 atau lebih baru
- npm, yarn, atau pnpm
- Kunci API gratis dari OpenRouteService

---

## 🔑 Cara Daftar API Key OpenRouteService Gratis

1. Kunjungi situs resmi OpenRouteService: [https://openrouteservice.org/dev/#/signup](https://openrouteservice.org/dev/#/signup)
2. Buat akun baru (atau masuk menggunakan akun GitHub).
3. Buka halaman **Dashboard** di [https://openrouteservice.org/dev/#/home](https://openrouteservice.org/dev/#/home).
4. Klik tombol **Request a Token**.
5. Pilih tipe token: **Standard (Free)**.
6. Beri nama token (misalnya: `Cek Jarak Les`).
7. Salin (copy) token/API key yang berhasil dibuat.

---

## 🚀 Cara Install dan Menjalankan

1. Masuk ke folder proyek:
   ```bash
   cd cek-jarak-biaya
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` dari template `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Pada Windows PowerShell gunakan: `Copy-Item .env.example .env`)*

4. Buka file `.env` dan masukkan API key Anda:
   ```env
   VITE_ORS_API_KEY=masukkan_token_api_anda_disini
   ```

5. Jalankan server pengembangan (development server):
   ```bash
   npm run dev
   ```

6. Buka browser pada alamat yang muncul (biasanya `http://localhost:5173`).

---

## ⚙️ Konfigurasi Lokasi & Tarif (`src/config.js`)

Semua parameter utama disimpan di dalam satu file `src/config.js` agar mudah disesuaikan:

| Parameter | Deskripsi | Nilai Bawaan |
|---|---|---|
| `NAMA_TEMPAT` | Nama tempat les pada judul dan popup marker | `"nCourse"` |
| `TITIK_UTAMA` | Koordinat titik awal (kantor/studio les) | `{ lat: -7.7285, lng: 109.0145 }` |
| `TARIF_PER_KM` | Tarif transport per kilometer | `3000` (Rp 3.000 / km) |
| `BIAYA_MINIMUM` | Biaya minimum per kunjungan | `10000` (Rp 10.000) |
| `JARAK_MAKSIMAL_KM` | Batas maksimal jarak layanan tatap muka | `15` km |

**Rumus Biaya Transport:**
$$\text{Biaya} = \max(\text{BIAYA\_MINIMUM}, \text{jarak\_km} \times \text{TARIF\_PER\_KM})$$
Hasil akhir dibulatkan ke atas ke kelipatan Rp 1.000 terdekat.

---

## 📱 Alur Penggunaan

1. **Tahap 1 (Halaman Awal):** Peta Leaflet satu layar penuh dengan pin lokasi tempat les. Pengguna menekan tombol **"Cek Jarak & Biaya"**.
2. **Tahap 2 (Tentukan Lokasi):** Sistem meminta izin GPS. Jika diizinkan, lokasi langsung terdeteksi. Pengguna juga dapat mengetik alamat (autocomplete OpenRouteService, debounce 500ms) atau memilih langsung di peta.
3. **Tahap 3 (Hasil Rute & Biaya):** Rute jalan darat digambar di atas peta. Kartu hasil menampilkan jarak (km), durasi waktu tempuh, dan estimasi biaya transport. Pin user dapat digeser (*draggable*) untuk menghitung ulang rute secara instan.
4. **Kondisi Khusus:** Jika jarak melebihi batas maksimal (15 km), sistem menampilkan peringatan *"Lokasi di luar area layanan"* dan tidak menampilkan biaya.

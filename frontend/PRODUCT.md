# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pengguna utama adalah orang tua siswa yang sedang mencari les privat untuk anak dan ingin memilih kebutuhan belajar, mengatur jadwal, lalu mendaftar atau berkonsultasi.

## Product Purpose

Nurman Course membantu orang tua menemukan dan mendaftarkan les privat untuk anak melalui pilihan materi, jenjang sekolah, atau calistung dan ngaji. Kesuksesan utama adalah orang tua memahami pilihan yang tersedia, memilih konfigurasi yang sesuai, dan dapat menghubungi Nurman Course melalui WhatsApp untuk konsultasi atau pendaftaran.

## Positioning

Nurman Course adalah layanan les privat fleksibel yang memungkinkan keluarga memilih kebutuhan belajar berdasarkan materi atau jenjang, menyesuaikan jadwal, dan memulai melalui konsultasi gratis serta trial session.

## Operating Context

- Alur publik utama: `/course` → `/course/program` → `/course/materi`, `/course/jenjang`, atau `/course/calistung` → `/course/config` → WhatsApp.
- Data pilihan dan materi funnel bersumber dari `frontend/data/materials.ts`.
- Perhitungan harga dilakukan di `frontend/app/course/config/CourseConfigClient.tsx`.
- Nomor WhatsApp dikelola dari `frontend/lib/constants.ts`.
- Frontend juga memiliki portal operasional `/app` untuk kebutuhan wali, tentor, dan admin.

## Capabilities and Constraints

- Menawarkan les per materi, les berdasarkan jenjang SD–SMP, serta calistung dan ngaji.
- Mendukung konteks les online dan offline, jadwal fleksibel, laporan progres, konsultasi gratis, dan trial session.
- Funnel WhatsApp dan routing publik yang sudah berjalan harus tetap dipertahankan.
- `Program` adalah layanan les bertentor; `Course` adalah unit konten mandiri dan keduanya tidak boleh diperlakukan sebagai entitas yang sama.
- Backend menjadi authority untuk autentikasi, otorisasi, visibility, dan body konten.
- Frontend writer/reader dan katalog publik konten belum menjadi scope aktif.

## Brand Commitments

- Nama produk: Nurman Course.
- Bahasa utama: Bahasa Indonesia.
- Voice yang sudah digunakan: ramah, jelas, praktis, dan dekat dengan keluarga.
- Brand, logo, copy berbahasa Indonesia, serta funnel pendaftaran WhatsApp harus dipertahankan.

## Evidence on Hand

- Logo tersedia di `frontend/public/Nlogo.png` dan `frontend/public/logo.png`.
- Profil tutor tersedia di `frontend/data/landing.ts` dan aset tutor berada di `frontend/public/tutors/`.
- Angka siswa aktif, testimonial, profil tutor, dan klaim kepercayaan orang tua yang sudah ada di frontend telah dikonfirmasi pengguna sebagai terverifikasi.
- Data program dan level tersedia di `frontend/data/materials.ts`.

## Product Principles

- Buat pilihan belajar mudah dipahami oleh orang tua.
- Jadikan konsultasi dan pendaftaran sebagai langkah yang sederhana.
- Pertahankan fleksibilitas jadwal dan format belajar.
- Tampilkan informasi yang jelas tanpa mengarang klaim baru.
- Jaga kesinambungan antara funnel publik dan operasi les yang berjalan.

---
version: 1
slug: "app-landing-page-tsx"
primary_target: "app/landing/page.tsx"
related_targets: ["app/login/page.tsx","app/signup/page.tsx"]
---

# Landing dan Auth — Peta Belajar

Mode utama: Persuade untuk landing; Operate untuk auth terkait.

Audience: orang tua siswa yang perlu memahami pilihan les dan pengguna development yang perlu masuk cepat sebagai tiap role.

Job: landing membantu orang tua melihat rute dari kebutuhan anak menuju program, tentor, jadwal, dan WhatsApp; auth memungkinkan masuk atau mendaftar dalam satu layar tanpa reload.

Action: pilih program atau konsultasi dari landing; masuk, daftar member, atau isi akun dummy dari auth.

Constraints: pertahankan biru utama #4a70a9, logo Nurman Course, fakta/copy terverifikasi, funnel /course, dan auth DB-backed. Akun dummy hanya development dan hanya mengisi form.

## Direction contract

THESIS: Halaman adalah peta perjalanan belajar keluarga, bukan hero generik diikuti kumpulan kartu seragam. Garis rute menghubungkan kebutuhan, pilihan program, tutor, jadwal, dan konsultasi sebagai satu keputusan yang mudah diikuti.

OWN-WORLD: Biru Nurman memegang bidang utama dengan kertas biru pucat, garis rute tinta, titik simpul bernomor, label seperti penanda peta, sudut membulat terukur, dan aksen kuning hangat untuk tujuan serta tindakan. Logo menjadi titik keberangkatan yang konsisten.

STORY: Pengunjung mengenali kebutuhan anak, melihat pilihan dan bukti pendampingan, memahami siapa yang mengajar, lalu memilih program atau bertanya lewat WhatsApp. Auth melanjutkan metafora sebagai pintu masuk ke peta personal tanpa mengorbankan affordance form.

FIRST VIEWPORT: Navigasi tipis membingkai logo dan dua tindakan. Headline besar menempati kiri dengan CTA jelas; kanan adalah peta rute vertikal dari Pilih kebutuhan ke Cocokkan tentor, Atur jadwal, dan Mulai belajar. Garis rute mengalir di belakang node dan berhenti pada tujuan kuning.

FORM: Peta layanan keluarga, kandidat urutan ketiga pada seed 8263257d. Signature interaction adalah garis rute dan node yang aktif bergantian secara halus, sementara reduced-motion menjaga semua node statis dan terbaca.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Unresolved: akun member development memerlukan fixture DB yang benar-benar tersedia; source UI tidak boleh menganggap tombol quick-fill sebagai bukti akun remote sudah ada.

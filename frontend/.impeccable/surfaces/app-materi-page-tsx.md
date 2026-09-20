---
version: 1
slug: "app-materi-page-tsx"
primary_target: "app/materi/page.tsx"
related_targets: ["app/kelas/[slug]/page.tsx","app/materi/[slug]/page.tsx"]
---

# Surface brief — /belajar

## Pain
Pemula coding di HP merasa "dari mana harus mulai": ada katalog materi, tapi tidak ada urutan langkah yang dipandu. Visitor bingung memilih antar kursus dan tidak tahu progress-nya.

## What is built
Katalog materi gratis dan reader lesson. `/belajar` (katalog), `/belajar/[courseSlug]` (outline course), `/belajar/[courseSlug]/[lessonSlug]` (reader). Dummy local data in `frontend/data/belajar-dasar.ts`, swap-ready to API later.

## Visitor sees (first viewport, 390px)
Judul Bricolage 800 di atas paper-hijau "meja kerja" bertekstur grid lubang papan bor; rel alat 3 numbered hooks (Lingkungan Coding → Instal Tools → HTML) menunjukkan jalur terpandu; worksheet course utama (13 lesson · Gratis) dengan tombol "Mulai dari langkah 1" terlihat tanpa scroll.

## Composition grammar
Rel alat horizontal (numbered hooks + connecting line) sebagai pengulang; worksheet paper cards dengan stamped number + minutes; asymmetric layout (featured sheet large, stacked sheets aside). No uniform card grids, no border-left callouts, no eyebrow kickers above headings.

## Type & color
Display Bricolage Grotesque, body Public Sans, code JetBrains Mono. Committed palette: deep pine enamel green dominant (30-60%), warm paper ground, near-black ink with green cast, safety orange reserved for active state and primary action. Body text ≥4.5:1, muted text ≥5.5:1.

## Motion & verification
One authored moment: sheet slides 8px with slight overshoot ease on mount, reduced-motion respected. Local progress; localStorage. Verify via typecheck, build, detector, desktop + mobile screenshots (one batched round, one fix batch, one confirm).

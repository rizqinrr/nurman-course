# Design — Nurman Course Wali Portal

A locked design system for this app. Every page redesign reads this file before emitting code.

## Genre
playful-glassmorphism (Custom hybrid allowing the glassmorphism style and blue-tint color scheme requested by the user)

## Macrostructure family
- App pages: Workbench-Glass (modular layout, GlassCard base containers, no nested card-in-card panels)

## Theme
- Latar Belakang Layout: `#6d8fc4` (Solid Blue)
- `--color-paper`: `rgba(255, 255, 255, 0.3)` (dengan `backdrop-blur-xl` dan border `rgba(255, 255, 255, 0.6)`)
- `--color-accent`: `#4a70a9` (Navy Blue)
- `--color-ink`: `#1f2937` (Dark Gray)
- `--color-ink-2`: `#4b5563` (Muted Gray)

## Typography
- Display: `Geist Sans`
- Body: `Geist Sans`
- Display tracking: `-0.01em`

## Spacing
4-point named scale. Buttons use `px-4 py-2` (nama anak) and `px-6 py-2` (CTA).

## Motion
- Easings: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out)
- Hover: transisi warna spesifik (bukan transition-all), scale-95 aktif pada klik.

## Rules
- **No Card-in-Card**: Dilarang meletakkan kartu berbingkai di dalam `GlassCard`. Bagian dalam sub-section harus menggunakan border-t (divider) atau layout teks polos.
- **Icon Purity**: Hanya gunakan ikon Lucide, tidak mencampur dengan emoji kasar (mis. 🎓 di avatar).
- **Glassmorphism Intent**: `GlassCard` hanya digunakan untuk section tingkat utama, bukan untuk pembungkus kecil di dalamnya.

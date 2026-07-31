# Prompt: Login / Register Page - LMS Nurman Course

## Context
Design a responsive, mobile-first Web UI page for the Login and Registration screen of "LMS Sederhana Nurman Course".

## Visual Vibe & Design System Guidelines
- **Canvas/Screen Size**: Mobile-first Web UI (optimal viewport width: 400px - 600px).
- **Background**: Vertical gradient background from a soft blue at the top to plain white at the bottom. Use the exact gradient equivalent to CSS: `bg-gradient-to-b from-[#4a70a9]/50 to-white`.
- **Card container (GlassCard)**: A prominent container with a glassmorphism effect. Set `backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl`. Inside padding should be comfortable (24px - 32px).
- **Typography**: Sans-serif typeface (modern and clean like Geist Sans).
  - Main Title: Bold, text color dark gray/charcoal (`#111827` or Tailwind's `gray-900`), font size ~28px.
  - Subtitle/Labels: Medium weight, text color medium gray (`#4b5563` or Tailwind's `gray-600`), font size ~14px.
- **Form Inputs**: 
  - Styling: Text input fields must have a border of `border-white/70`, background `bg-white/80`, comfortable padding (12px vertical/horizontal), rounded corners `rounded-xl` (12px radius), text color dark gray, and thin subtle placeholder text.
  - Active/Focus State: Border color transitions to `#4a70a9` with a subtle focus ring.
- **Buttons**:
  - Primary button: Background color `#4a70a9`, text color pure white, hover state should darken to `#3a5a99`, rounded corners `rounded-xl`, shadow effect, font-weight medium.
  - Secondary/Text toggle button: Transparent background, text color `#4a70a9`, font-weight bold, hover state should show underline.
- **Status Messages**:
  - Error Box: Background `#fee2e2` (light red), text `#b91c1c` (dark red), rounded corners `rounded-xl` (12px), text-sm, medium weight, margin-bottom 16px.
  - Success Box: Background `#dcfce7` (light green), text `#15803d` (dark green), rounded corners `rounded-xl` (12px), text-sm, medium weight, margin-bottom 16px.

## Screen Layout & Elements

### 1. Logo Position
- In the top-right corner, show a floating semi-transparent image logo representing "Nurman Course" (soft white background icon with a prominent stylized blue letter 'N').

### 2. Header Section
- Center-aligned.
- Main Title: "Masuk Akun" (or dynamically toggles to "Daftar Akun").
- Subtitle: "Akses katalog, jadwal, dan materi belajar Anda".

### 3. Glassmorphism Form Card
Below the header, place the GlassCard container. Inside the card, display the following fields:

#### A. Mode 1: Login (Default)
- **Field 1: Email**
  - Label: "Email" (font-semibold, text-gray-700, margin-bottom 4px).
  - Input field: Placeholder "budi@gmail.com", type email.
- **Field 2: Password**
  - Label: "Password" (font-semibold, text-gray-700, margin-bottom 4px).
  - Input field: Placeholder "••••••••", type password.
- **Button: Submit CTA**
  - Label: "Masuk". Full width, blue background `#4a70a9`, rounded-xl.
- **Footer Text & Switch Mode**:
  - Center-aligned text below button: "Belum punya akun? [Daftar di sini]" (where "[Daftar di sini]" is a bold link in `#4a70a9` color).

#### B. Mode 2: Register (Switched view)
If user clicks "Daftar di sini", the card changes to show:
- **Field 1: Nama Lengkap**
  - Label: "Nama Lengkap" (font-semibold, text-gray-700).
  - Input field: Placeholder "Contoh: Budi Santoso", type text.
- **Field 2: Nomor WhatsApp**
  - Label: "Nomor WhatsApp" (font-semibold, text-gray-700).
  - Input field: Placeholder "Contoh: 081234567890", type tel.
- **Field 3: Email**
  - Label: "Email"
  - Input field: Placeholder "budi@gmail.com", type email.
- **Field 4: Password**
  - Label: "Password"
  - Input field: Placeholder "••••••••", type password.
- **Button: Submit CTA**
  - Label: "Daftar". Full width, blue background `#4a70a9`, rounded-xl.
- **Footer Text & Switch Mode**:
  - Center-aligned text: "Sudah punya akun? [Masuk di sini]" (bold link in `#4a70a9`).

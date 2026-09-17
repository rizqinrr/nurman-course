# Nurman Course

Monorepo funnel pendaftaran les, portal operasional, dan backend konten mandiri.

Fokus pengembangan saat ini adalah **backend-first**. Lihat [GOALS.md](./GOALS.md) untuk arah dan blocker aktif.

## Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Express, TypeScript, Prisma
- Database/Auth: PostgreSQL Supabase dan Supabase Auth
- Shared contracts: Zod di `packages/shared`

## Struktur

```text
frontend/          Next.js funnel dan portal
backend/           Express API, Prisma schema, migration, backfill
packages/shared/   Zod schemas dan TypeScript contracts
docs/              Progress aktif dan keputusan
tasks/             Checklist backend aktif
```

## Development

Dari root:

```powershell
npm install
npm run dev
```

Per workspace:

```powershell
npm run dev --workspace=frontend
npm run dev --workspace=backend
```

Konfigurasi environment mengikuti file `.env.example` masing-masing workspace. Jangan commit credential.

## Verifikasi backend

```powershell
npm run typecheck --workspace=backend
npm run typecheck:test --workspace=backend
npm run lint --workspace=backend
npm run test --workspace=backend
npm run test:artifact --workspace=backend
npm run build --workspace=backend
```

`npm run build --workspace=backend` menghasilkan `backend/dist` dan harus dijalankan pada OS target karena Prisma engine bersifat native.

## Dokumen utama

- [AGENTS.md](./AGENTS.md) — aturan kerja
- [GOALS.md](./GOALS.md) — fokus backend, urutan goal, dan blocker
- [SYSTEM_MAP.md](./SYSTEM_MAP.md) — peta arsitektur dan file
- [docs/PROGRESS.md](./docs/PROGRESS.md) — milestone, keputusan, dan residual
- [tasks/todo.md](./tasks/todo.md) — checklist aktif

## Safety

Migration deploy, backfill live, seed, mutasi DB remote, commit, push, dan deploy hanya dilakukan dengan izin eksplisit.

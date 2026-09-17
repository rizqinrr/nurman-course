# Tasks — Backend Focus

> Checklist aktif. Arah dan prioritas: [GOALS.md](../GOALS.md). Keputusan dan bukti: [PROGRESS.md](../docs/PROGRESS.md).

## Aturan sesi

- Satu fokus utama per sesi.
- Backend dahulu; frontend hanya setelah gate backend dan task khusus.
- Tidak ada migration deploy, backfill live, seed, mutasi DB remote, commit, push, atau deploy tanpa izin eksplisit.
- Verifikasi wajib dicatat bersama batas buktinya.

## Done lokal

- [x] Dependency runtime backend dipatch dan diverifikasi.
- [x] Auth backend memakai verified Supabase ID serta role/active dari DB.
- [x] HTTP hardening, error boundary, limiter, dan parser boundary tersedia.
- [x] Backend artifact build dan lint scoped tersedia.
- [x] Router legacy content diekstrak tanpa mengubah kontrak lama.
- [x] Schema additive `Course`, `Section`, `Lesson` dan migration SQL offline dibuat.
- [x] API authoring admin/tentor, ownership, DTO, reorder, draft/publish dibuat.
- [x] Validasi link internal `/materi/*` dibuat tanpa fetch eksternal.
- [x] Backfill content dry-run dibuat: atomic, idempotent, fail-closed.

## Fokus aktif berikutnya

### 1. Database readiness — blocked by DB approval

- [ ] Audit read-only data `MaterialItem`: roadmap-only, session-only, both, orphan.
- [ ] Jalankan dry-run pada DB terisolasi yang disetujui.
- [ ] Verifikasi jumlah, body, relasi, slug, dan idempotensi.
- [ ] Putuskan mapping ambiguous/conflict/orphan.
- [ ] Putuskan `MaterialItem.sessionId`; jangan drop schema sebelum backfill, seed, consumer, dan rollback siap.

### 2. Auth and HTTP rollout — blocked by product/deployment decisions

- [ ] Admin menentukan kegunaan dan remediation lima Auth tanpa profil.
- [ ] Putuskan kebutuhan payload di atas 100 KB.
- [ ] Verifikasi origin, proxy, dan rate limit untuk target deployment.
- [ ] Verifikasi artifact pada OS deployment.

### 3. Content security — release blocker

- [ ] Tutup kebocoran `RoadmapStep.bodyText` dari `/api/programs*`.
- [ ] Audit nested, legacy, search, related, dan prev/next access paths.
- [ ] Audit grants/RLS Data API untuk tabel content.
- [ ] Pastikan draft dan lesson entitled tidak terkirim tanpa guard.

### 4. Entitlement and progress — after content security

- [ ] Definisikan source entitlement: free, purchase, enrollment.
- [ ] Putuskan expiry, revoke, inactive, dan multiple-source behavior.
- [ ] Implement `User × Lesson` reading progress terpisah dari progress murid.
- [ ] Verifikasi negative access dan ownership.

### 5. Frontend handoff — later

- [ ] Tetapkan kontrak reader/writer setelah backend gate.
- [ ] Cutover frontend tanpa dua writer untuk record yang sama.
- [ ] QA frontend/browser hanya dengan izin dan task terpisah.

## Blocker permanen sampai ada keputusan

- Frontend masih memakai metadata role.
- Migration/backfill NC-2 belum diterapkan ke DB live.
- Endpoint legacy `/api/programs*` masih release blocker karena `bodyText`.
- Payload pembayaran UI/API mismatch: `paymentProof` vs `proofBase64`.
- Frontend authoring dan public catalog belum masuk scope.

## Verification commands

```powershell
npm run typecheck --workspace=backend
npm run typecheck:test --workspace=backend
npm run lint --workspace=backend
npm run test --workspace=backend
npm run test:artifact --workspace=backend
npm run build --workspace=backend
```

Test dijalankan sesuai izin sesi. Typecheck dan lint tetap wajib untuk perubahan backend yang relevan.

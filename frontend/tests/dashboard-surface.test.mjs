import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const adminSource = readFileSync(new URL("../app/app/admin/page.tsx", import.meta.url), "utf8");
const memberSource = readFileSync(new URL("../app/app/materi/page.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../app/app/admin/layout.tsx", import.meta.url), "utf8");
const glassCardSource = readFileSync(new URL("../components/ui/GlassCard.tsx", import.meta.url), "utf8");
const waliLayoutSource = readFileSync(new URL("../app/app/(wali)/layout.tsx", import.meta.url), "utf8");
const waliDashboardSource = readFileSync(new URL("../app/app/(wali)/dashboard/page.tsx", import.meta.url), "utf8");

test("admin command center loads operations, popular lessons, and recent activity", () => {
  assert.match(adminSource, /\/api\/admin\/dashboard/);
  assert.match(adminSource, /\/api\/admin\/tracking\?limit=5/);
  assert.match(adminSource, /getLessonCatalog\(\{ limit: 5 \}\)/);
  assert.match(adminSource, /Materi paling dibaca/);
  assert.match(adminSource, /Aktivitas terbaru/);
});

test("member dashboard combines profile overview with continue-learning", () => {
  assert.match(memberSource, /\/api\/users\/me/);
  assert.match(memberSource, /getLibrary\(\{ limit: 100 \}\)/);
  assert.match(memberSource, /Lanjut belajar/);
  assert.match(memberSource, /Profil member/);
  assert.match(memberSource, /askLogout/);
});

test("mobile admin drawer stays open until navigation or explicit close", () => {
  assert.match(layoutSource, /onClick=\{\(\) => setMobileNavOpen\(true\)\}/);
  assert.match(layoutSource, /onClick=\{\(\) => setMobileNavOpen\(false\)\}/);
  assert.doesNotMatch(layoutSource, /setMobileNavOpen\(false\);\s*\}, \[pathname\]\)/);
  assert.doesNotMatch(layoutSource, /Promise\.resolve\(\)\.then\(.*setMobileNavOpen\(false\)/s);
});

test("wali bottom navigation keeps only the four primary actions", () => {
  for (const label of ["Beranda", "Jadwal", "Laporan", "Tagihan"]) {
    assert.match(waliLayoutSource, new RegExp(`label: "${label}"`));
  }
  assert.doesNotMatch(waliLayoutSource, /label: "Program"/);
  assert.doesNotMatch(waliLayoutSource, /label: "Materi"/);
  assert.match(waliLayoutSource, /href="\/app\/profile"/);
  assert.match(waliDashboardSource, /href="\/app\/program"/);
  assert.match(waliDashboardSource, /href="\/app\/materi"/);
});

test("admin navigation is grouped and data workspaces share the command surface", () => {
  for (const label of ["Kelola layanan", "Orang & delivery", "Keuangan"]) {
    assert.match(layoutSource, new RegExp(label));
  }
  assert.match(layoutSource, /aria-current=\{active \? "page"/);
  assert.match(glassCardSource, /border-\[#cbd8e5\]/);
  assert.doesNotMatch(glassCardSource, /backdrop-blur-xl/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const loginSource = readFileSync(new URL("../app/login/page.tsx", import.meta.url), "utf8");
const signupSource = readFileSync(new URL("../app/signup/page.tsx", import.meta.url), "utf8");
const seedSource = readFileSync(new URL("../../backend/prisma/seed.ts", import.meta.url), "utf8");

test("auth surface switches login and register without linking away", () => {
  assert.match(loginSource, /selectMode\("register"\)/);
  assert.doesNotMatch(loginSource, /href="\/signup"/);
  assert.match(signupSource, /redirect\("\/login\?mode=register"\)/);
});

test("development quick-fill is hidden from production and covers unified roles", () => {
  assert.match(loginSource, /process\.env\.NODE_ENV === "development"/);
  for (const role of ["Siswa", "Tentor", "Admin"]) {
    assert.match(loginSource, new RegExp(`role: "${role}"`));
  }
});

test("register mode remains available for an already authenticated browser", () => {
  const middlewareSource = readFileSync(new URL("../middleware.ts", import.meta.url), "utf8");
  assert.match(middlewareSource, /mode.*register/);
});

test("login clears a session when the DB profile cannot be resolved", () => {
  assert.match(loginSource, /removeAccessToken\(\)/);
});

test("student quick-fill matches development seed fixtures", () => {
  assert.match(seedSource, /email: `wali\$\{index \+ 1\}@nurmancourse\.com`/);
  assert.match(seedSource, /email: 'member@nurmancourse\.com'/);
});

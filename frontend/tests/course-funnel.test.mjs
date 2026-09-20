import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

const programSource = read("../app/course/program/page.tsx");
const materiSource = read("../app/course/materi/page.tsx");
const jenjangSource = read("../app/course/jenjang/page.tsx");
const calistungSource = read("../app/course/calistung/page.tsx");
const detailSource = read("../app/course/materi/[id]/page.tsx");
const configSource = read("../app/course/config/CourseConfigClient.tsx");

test("course funnel preserves established page copy", () => {
  assert.match(programSource, /title="Pilih Program"/);
  assert.match(programSource, /subtitle="Pilih program yang sesuai kebutuhan Anda"/);
  assert.match(materiSource, /title="Pilih Materi"/);
  assert.match(materiSource, /subtitle="Pilih materi yang ingin Anda pelajari"/);
  assert.match(jenjangSource, /title="Pilih Jenjang"/);
  assert.match(jenjangSource, /subtitle="Sesuaikan dengan tingkat pendidikan siswa"/);
  assert.match(calistungSource, /title="Calistung & Ngaji"/);
  assert.match(calistungSource, /subtitle="Pilih paket: Ngaji saja \(mulai 15rb\) atau Calistung & Ngaji \(30rb\)"/);
  assert.match(detailSource, /Kuasai \{material\.name\} dengan jalur belajar yang jelas/);
  assert.match(configSource, /title="Atur Jadwal"/);
  assert.match(configSource, /subtitle="Sesuaikan waktu dan kebutuhan belajar"/);
});

test("course funnel keeps route sequence and shared data authority", () => {
  assert.match(programSource, /route: "\/course\/materi"/);
  assert.match(programSource, /route: "\/course\/jenjang"/);
  assert.match(programSource, /route: "\/course\/calistung"/);
  assert.match(materiSource, /getMaterialsByCategory\("materi"\)/);
  assert.match(jenjangSource, /getMaterialsByCategory\("jenjang"\)/);
  assert.match(calistungSource, /getMaterialsByCategory\("calistung"\)/);
  assert.match(detailSource, /\/course\/config\?materi=\$\{material\.id\}&level=\$\{selectedLevelData\.level\}/);
});

test("funnel exposes selected and form states accessibly", () => {
  const headerSource = read("../components/course/CourseRouteHeader.tsx");
  const chipSource = read("../components/ui/Chip.tsx");
  assert.match(detailSource, /aria-pressed=\{isSelected\}/);
  assert.match(configSource, /htmlFor=\{`participant-name-\$\{index \+ 1\}`\}/);
  assert.match(headerSource, /aria-current=\{active \? "step" : undefined\}/);
  assert.match(chipSource, /aria-pressed=\{isActive\}/);
});
test("course configuration keeps WhatsApp and pricing authorities", () => {
  assert.match(configSource, /getLevelBasePrice/);
  assert.match(configSource, /WHATSAPP_NUMBER/);
  assert.match(configSource, /selectedDays\.length === frequency/);
  assert.match(configSource, /isProgramCategoryValid/);
  assert.match(configSource, /selectedLevelData\.comingSoon/);
  assert.match(configSource, /https:\/\/wa\.me\/\$\{WHATSAPP_NUMBER\}\?text=\$\{encodedMessage\}/);
});

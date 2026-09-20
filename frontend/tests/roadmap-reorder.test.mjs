import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../app/app/admin/roadmap/RoadmapClient.tsx", import.meta.url), "utf8");
const imports = [];
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.React },
  transformers: {
    before: [context => root => ts.visitEachChild(root, node => {
      if (ts.isImportDeclaration(node)) {
        if (node.importClause?.name) imports.push(node.importClause.name.text);
        for (const specifier of node.importClause?.namedBindings?.elements || []) imports.push(specifier.name.text);
        return undefined;
      }
      if (ts.isFunctionDeclaration(node) && node.name?.text === "RoadmapClient") {
        return context.factory.updateFunctionDeclaration(node, undefined, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body);
      }
      return node;
    }, context)],
  },
}).outputText.replace(/export\s*\{\s*\};?/g, "");

function harness() {
  const cells = [];
  const effects = [];
  const requests = [];
  let cursor = 0;
  let dirty = false;
  let unmounted = false;
  let lateWrites = 0;
  let tree;
  const hooks = {
    useState(initial) {
      const id = cursor++;
      if (!(id in cells)) cells[id] = typeof initial === "function" ? initial() : initial;
      return [cells[id], update => {
        if (unmounted) lateWrites++;
        cells[id] = typeof update === "function" ? update(cells[id]) : update;
        dirty = true;
      }];
    },
    useRef(initial) { const id = cursor++; return cells[id] ||= { current: initial }; },
    useMemo(fn, deps) {
      const id = cursor++;
      if (!cells[id] || deps.some((value, index) => !Object.is(value, cells[id].deps[index]))) cells[id] = { value: fn(), deps };
      return cells[id].value;
    },
    useCallback(fn, deps) { return hooks.useMemo(() => fn, deps); },
    useEffect(fn, deps) {
      const id = cursor++;
      if (!cells[id] || deps.some((value, index) => !Object.is(value, cells[id].deps[index]))) {
        effects.push(() => { cells[id]?.cleanup?.(); cells[id] = { deps, cleanup: fn() }; });
      }
    },
  };
  const bindings = {
    ...Object.fromEntries(imports.map(name => [name, name])),
    ...hooks,
    React: { createElement: (type, props, ...children) => ({ type, props: { ...props, children } }) },
    useSearchParams: () => new URLSearchParams("program=a"),
    apiFetch: (path, options) => new Promise((resolve, reject) => requests.push({ path, options, resolve, reject })),
  };
  const Component = new Function(...Object.keys(bindings), `${compiled}; return RoadmapClient;`)(...Object.values(bindings));
  const render = () => {
    cursor = 0;
    dirty = false;
    tree = Component();
    effects.splice(0).forEach(fn => fn());
    if (dirty) render();
  };
  const nodes = (root = tree) => {
    if (Array.isArray(root)) return root.flatMap(node => node === undefined ? [] : nodes(node));
    if (!root || typeof root !== "object") return [];
    return [root, ...nodes(root.props.children || [])];
  };
  const byLabel = label => nodes().filter(node => node.props["aria-label"] === label);
  const take = path => {
    const index = requests.findIndex(request => request.path === path);
    assert.notEqual(index, -1, `Missing request: ${path}`);
    return requests.splice(index, 1)[0];
  };
  const flush = async () => {
    for (let i = 0; i < 16; i++) await Promise.resolve();
    if (!unmounted) render();
  };
  render();
  return {
    render, nodes, byLabel, take, flush, requests,
    select(id) { byLabel("Pilih program")[0].props.onChange({ target: { value: id } }); render(); },
    expand(index = 0) {
      const button = nodes().filter(node => node.type === "button" && JSON.stringify(node.props.children).includes("Materi ("))[index];
      button.props.onClick(); render();
    },
    unmount() { cells.forEach(cell => cell?.cleanup?.()); unmounted = true; },
    get lateWrites() { return lateWrites; },
  };
}

const steps = program => [1, 2].map(index => ({ id: `${program}${index}`, title: `${program} step ${index}`, bodyText: "body", order: index - 1 }));
const materials = step => [1, 2].map(index => ({ id: `${step}-m${index}`, title: `${step} material ${index}`, bodyText: "body", order: index - 1 }));
const stepPath = program => `/api/admin/programs/${program}/roadmap`;
const materialPath = step => `/api/admin/roadmap-steps/${step}/materials`;
const reordered = data => [...data].reverse().map((item, order) => ({ ...item, order }));
const titles = (h, type) => h.nodes().filter(node => node.type === (type === "steps" ? "h3" : "p") && String(node.props.children).includes(type === "steps" ? "step" : "material")).map(node => node.props.children.flat().join(""));

async function setup(type) {
  const h = harness();
  h.take("/api/admin/programs").resolve({ data: ["a", "b"].map(id => ({ id, name: id, hasRoadmap: true })) });
  h.take(stepPath("a")).resolve({ data: steps("a") });
  await h.flush();
  if (type === "materials") {
    h.expand();
    h.take(materialPath("a1")).resolve({ data: materials("a1") });
    await h.flush();
  }
  return h;
}

for (const type of ["steps", "materials"]) {
  const label = type === "steps" ? "Turunkan urutan" : "Turunkan materi";
  const path = type === "steps" ? stepPath("a") : materialPath("a1");
  const original = type === "steps" ? steps("a") : materials("a1");

  test(`${type}: delayed first success survives a second attempt that would fail`, async () => {
    const h = await setup(type);
    const click = h.byLabel(label)[0].props.onClick;
    click();
    click();
    const first = h.take(`${path}/reorder`);
    const second = h.requests.find(request => request.path === `${path}/reorder`);
    if (second) second.reject(Error("second write failed"));
    await h.flush();
    const disabledWhilePending = h.byLabel(label).every(node => node.props.disabled);
    first.resolve({ data: reordered(original) });
    await h.flush();
    assert.equal(second, undefined, "same-list second write must not be issued, even before render");
    assert(disabledWhilePending, "all same-list reorder buttons must be disabled while pending");
    assert(titles(h, type)[0].includes(original[1].title), "accepted first response must update order");
    assert.equal(h.byLabel(label)[0].props.disabled, false);
  });

  test(`${type}: selection A-B-A keeps pending lock and waits for the write before reading A`, async () => {
    const h = await setup(type);
    h.byLabel(label)[0].props.onClick();
    const write = h.take(`${path}/reorder`);
    h.select("b");
    h.take(stepPath("b")).resolve({ data: steps("b") });
    await h.flush();
    h.select("a");
    if (type === "materials") {
      h.take(stepPath("a")).resolve({ data: steps("a") }); await h.flush();
      h.expand();
    }
    assert(!h.requests.some(request => request.path === path), "read must wait for the existing write after selection changes");
    write.resolve({ data: reordered(original) });
    await h.flush();
    h.take(path).resolve({ data: reordered(original) });
    await h.flush();
    assert(titles(h, type)[0].includes(original[1].title));
    assert.equal(h.byLabel(label)[0].props.disabled, false, "selection cleanup must not leak busy state");
  });

  test(`${type}: failed write after A-B-A releases the lock and refreshes the selected list`, async () => {
    const h = await setup(type);
    h.byLabel(label)[0].props.onClick();
    const write = h.take(`${path}/reorder`);
    h.select("b");
    h.take(stepPath("b")).resolve({ data: steps("b") }); await h.flush();
    h.select("a");
    if (type === "materials") {
      h.take(stepPath("a")).resolve({ data: steps("a") }); await h.flush();
      h.expand();
    }
    write.reject(Error("old selection write failed")); await h.flush();
    h.take(path).resolve({ data: original }); await h.flush();
    assert.equal(h.byLabel(label)[0].props.disabled, false);
    assert(titles(h, type)[0].includes(original[0].title));
    h.byLabel(label)[0].props.onClick();
    const retry = h.take(`${path}/reorder`);
    h.unmount();
    retry.reject(Error("unmounted failure")); await h.flush();
    assert.equal(h.lateWrites, 0);
  });

  test(`${type}: failure releases lock and unmount prevents state writes`, async () => {
    const h = await setup(type);
    h.byLabel(label)[0].props.onClick();
    h.take(`${path}/reorder`).reject(Error("write failed"));
    await h.flush();
    assert.equal(h.byLabel(label)[0].props.disabled, false);
    assert(titles(h, type)[0].includes(original[0].title));
    h.byLabel(label)[0].props.onClick();
    const write = h.take(`${path}/reorder`);
    h.unmount();
    write.resolve({ data: reordered(original) });
    await h.flush();
    assert.equal(h.lateWrites, 0);
  });
}

test("material lists serialize independently and one completion cannot unlock another", async () => {
  const h = await setup("materials");
  h.byLabel("Turunkan materi")[0].props.onClick();
  const first = h.take(`${materialPath("a1")}/reorder`);
  h.expand(1);
  h.take(materialPath("a2")).resolve({ data: materials("a2") }); await h.flush();
  h.byLabel("Turunkan materi")[0].props.onClick();
  const second = h.take(`${materialPath("a2")}/reorder`);
  first.resolve({ data: reordered(materials("a1")) }); await h.flush();
  assert(h.byLabel("Turunkan materi").every(node => node.props.disabled));
  h.byLabel("Turunkan materi")[0].props.onClick();
  assert(!h.requests.some(request => request.path.endsWith("/reorder")));
  second.resolve({ data: reordered(materials("a2")) }); await h.flush();
  assert.equal(h.byLabel("Turunkan materi")[0].props.disabled, false);
});

test("program lists have independent locks across selection changes", async () => {
  const h = await setup("steps");
  h.byLabel("Turunkan urutan")[0].props.onClick();
  const first = h.take(`${stepPath("a")}/reorder`);
  h.select("b");
  h.take(stepPath("b")).resolve({ data: steps("b") }); await h.flush();
  h.byLabel("Turunkan urutan")[0].props.onClick();
  const second = h.take(`${stepPath("b")}/reorder`);
  first.resolve({ data: reordered(steps("a")) }); await h.flush();
  assert(titles(h, "steps")[0].includes("b step 1"));
  assert(h.byLabel("Turunkan urutan").every(node => node.props.disabled));
  h.byLabel("Turunkan urutan")[0].props.onClick();
  assert(!h.requests.some(request => request.path.endsWith("/reorder")));
  second.resolve({ data: reordered(steps("b")) }); await h.flush();
  assert(titles(h, "steps")[0].includes("b step 2"));
  assert.equal(h.byLabel("Turunkan urutan")[0].props.disabled, false);
});

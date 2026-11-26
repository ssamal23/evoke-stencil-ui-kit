#!/usr/bin/env node
/**
 * Writes compat.json, which is published inside the npm package. The dashboard reads it per version, so
 * nobody has to type framework versions by hand.
 *
 *   node scripts/write-compat.mjs            write compat.json from compat/compat.source.json and the last test runs
 *   node scripts/write-compat.mjs --strict   same, but fail if a test app was not run or had a failing check (used when publishing)
 *   node scripts/write-compat.mjs --check    only check that compat.json exists and belongs to this package version
 *
 * Where the facts come from:
 *   - kit version:        package.json
 *   - framework version:  the package the compatibility test actually installed (tests/compat/.work/<app>/node_modules), as major.minor
 *   - tested or not:      tests/compat/results/<app>.json, written by `npm run compat -- <app>`
 *   - browser version:    Playwright's browsers.json (the Chromium the checks ran in)
 *   - notes and styling:  compat/compat.source.json (written by hand)
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'compat.json');
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const kit = readJson(join(root, 'package.json')).version;

if (args.includes('--check')) {
  if (!existsSync(out)) { console.error('compat.json is missing. Run: node scripts/write-compat.mjs --strict'); process.exit(1); }
  const found = readJson(out).kit;
  if (found !== kit) { console.error(`compat.json is for ${found} but package.json is ${kit}. Run: node scripts/write-compat.mjs --strict`); process.exit(1); }
  console.log(`compat.json is for ${kit}.`);
  process.exit(0);
}

const majorMinor = (v) => v.split('.').slice(0, 2).join('.');
const problems = [];

function passed(app) {
  const file = join(root, 'tests', 'compat', 'results', `${app}.json`);
  if (!existsSync(file)) return { ok: false, why: `${app} was not run (no results/${app}.json)` };
  const stats = readJson(file).stats ?? {};
  if (!stats.expected || stats.unexpected) return { ok: false, why: `${app} had failing checks` };
  return { ok: true };
}

function frameworkVersion(f) {
  if (f.package) {
    const file = join(root, 'tests', 'compat', '.work', f.app, 'node_modules', ...f.package.split('/'), 'package.json');
    if (!existsSync(file)) return null;
    return majorMinor(readJson(file).version);
  }
  if (f.browser) {
    const file = join(root, 'tests', 'compat', 'node_modules', 'playwright-core', 'browsers.json');
    if (!existsSync(file)) return null;
    const b = readJson(file).browsers.find((x) => x.name === f.browser);
    return b ? `${f.browser[0].toUpperCase()}${f.browser.slice(1)} ${String(b.browserVersion).split('.')[0]}` : null;
  }
  return null;
}

const source = readJson(join(root, 'compat', 'compat.source.json'));
const frameworks = source.frameworks.map((f) => {
  const run = passed(f.app);
  const version = frameworkVersion(f);
  if (!run.ok) problems.push(run.why);
  if (!version) problems.push(`could not read the installed ${f.package ?? f.browser} version for ${f.app}`);
  const entry = { name: f.name, version: version ?? '—', status: run.ok ? 'tested' : 'expected' };
  if (f.note) entry.note = f.note;
  return entry;
});

if (strict && problems.length) {
  console.error('compat.json was not written:\n- ' + problems.join('\n- '));
  process.exit(1);
}
for (const p of problems) console.warn(`warning: ${p}`);

writeFileSync(out, JSON.stringify({ kit, generated: new Date().toISOString(), frameworks, styling: source.styling, notes: source.notes }, null, 2) + '\n');
console.log(`Wrote compat.json for ${kit}:`);
for (const f of frameworks) console.log(`  ${f.name} ${f.version} (${f.status})`);

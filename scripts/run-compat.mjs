#!/usr/bin/env node
/**
 * Runs the compatibility tests against the PACKED kit: the same files an npm user gets.
 *
 *   node scripts/run-compat.mjs html [--no-build]
 *
 *   1. builds the kit (skipped with --no-build) and packs it with `npm pack`
 *   2. installs the pack into a clean temporary folder (tests/compat/.work/<app>)
 *   3. copies the test app (tests/compat/apps/<app>) next to it and serves the folder
 *   4. runs the Playwright checks in tests/compat against that address (Chromium)
 *   5. writes tests/compat/results/<app>.json and <app>.md (a short table) and exits non-zero when a check failed
 *
 * Nothing here changes the kit's code or publishes anything.
 */
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const compat = join(root, 'tests/compat');
const APPS = ['html'];
const app = process.argv[2];
const noBuild = process.argv.includes('--no-build');
// Anything else after the app name goes to Playwright, e.g. -g "registered" to run only some checks.
const extraArgs = process.argv.slice(3).filter((a) => a !== '--no-build').map((a) => `"${a.replace(/"/g, '\\"')}"`).join(' ');

if (!APPS.includes(app)) {
  console.error(`Usage: node scripts/run-compat.mjs <${APPS.join('|')}> [--no-build]`);
  process.exit(2);
}

/** Runs a command (through the shell so npm and npx work on Windows too). Throws when it fails. */
function run(command, cwd, env = {}, capture = false) {
  const result = spawnSync(command, { cwd, shell: true, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit', env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(`Command failed (${result.status}): ${command}`);
  return result.stdout;
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.map': 'application/json', '.svg': 'image/svg+xml' };

function serve(dir) {
  const base = resolve(dir);
  const server = createServer((req, res) => {
    const path = resolve(base, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (path !== base && !path.startsWith(base + sep)) { res.writeHead(403).end(); return; }
    try {
      const body = readFileSync(path);
      res.writeHead(200, { 'Content-Type': MIME[extname(path)] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, url: `http://127.0.0.1:${server.address().port}` })));
}

/** Flattens Playwright's JSON report into [{ title, ok, error }]. */
function flatten(suite, trail = []) {
  const here = suite.title && !suite.title.endsWith('.mjs') ? [...trail, suite.title] : trail;
  const out = [];
  for (const spec of suite.specs ?? []) {
    const result = spec.tests?.[0]?.results?.at(-1);
    const message = (result?.error?.message ?? '').replace(/\x1b\[[0-9;]*m/g, ''); // drop terminal colour codes
    out.push({ title: [...here, spec.title].join(' > '), ok: spec.ok, error: message.split('\n')[0] });
  }
  for (const child of suite.suites ?? []) out.push(...flatten(child, here));
  return out;
}

function summarise(reportFile, kitVersion) {
  const report = JSON.parse(readFileSync(reportFile, 'utf8'));
  const tests = (report.suites ?? []).flatMap((s) => flatten(s));
  const failed = tests.filter((t) => !t.ok);
  const lines = [
    `## Compatibility: ${app} (kit ${kitVersion}, Chromium)`,
    '',
    `**${tests.length - failed.length} of ${tests.length} checks passed.**`,
    '',
  ];
  if (failed.length) {
    lines.push('| Failed check | Reason |', '| --- | --- |');
    for (const t of failed) lines.push(`| ${t.title} | ${t.error.replace(/\|/g, '/').slice(0, 160)} |`);
  } else {
    lines.push('All checks passed.');
  }
  return { text: lines.join('\n') + '\n', total: tests.length, failed: failed.length };
}

async function main() {
  const work = join(compat, '.work', app);
  const results = join(compat, 'results');
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });
  mkdirSync(results, { recursive: true });

  if (!noBuild) {
    console.log('> Building the kit');
    run('npm run build', root);
  }

  console.log('> Packing the kit');
  const packOut = run(`npm pack --json --pack-destination "${work}"`, root, {}, true);
  const tarball = join(work, JSON.parse(packOut.slice(packOut.indexOf('[')))[0].filename);

  console.log('> Installing the pack into a clean folder');
  writeFileSync(join(work, 'package.json'), JSON.stringify({ name: `compat-${app}`, private: true }));
  run(`npm install "${tarball}" --no-audit --no-fund`, work);
  cpSync(join(compat, 'apps', app), work, { recursive: true });
  const kitVersion = JSON.parse(readFileSync(join(work, 'node_modules/@evoke-tech/stencil-ui-kit/package.json'), 'utf8')).version;

  if (!existsSync(join(compat, 'node_modules'))) run('npm install --no-audit --no-fund', compat);
  run('npx playwright install chromium', compat);

  const { server, url } = await serve(work);
  console.log(`> Serving ${app} at ${url}`);
  let failed = true;
  try {
    const reportFile = join(results, `${app}.json`);
    // Not spawnSync: that would block this process, and this process is the web server the tests are talking to.
    const status = await new Promise((done) => {
      const child = spawn(`npx playwright test ${extraArgs}`, { cwd: compat, shell: true, stdio: 'inherit', env: { ...process.env, BASE_URL: url, RESULTS_JSON: `results/${app}.json` } });
      child.on('close', (code) => done(code ?? 1));
    });
    if (!existsSync(reportFile)) throw new Error('Playwright wrote no report; see its output above.');
    const summary = summarise(reportFile, kitVersion);
    writeFileSync(join(results, `${app}.md`), summary.text);
    console.log('\n' + summary.text);
    failed = status !== 0 || summary.failed > 0;
  } finally {
    server.close();
  }
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

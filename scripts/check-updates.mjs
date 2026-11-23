#!/usr/bin/env node
/**
 * Checks for new updates and writes a short report. It does not change any code and does not publish anything.
 *
 *   1. New Angular Material components: every component is its own entry point in the "exports" of the
 *      official @angular/material package on npm. Compared with agent/state.json.
 *   2. New framework versions: Angular, React, Vue and Stencil, from the npm registry.
 *
 * Usage:   node scripts/check-updates.mjs [--state path/to/state.json] [--report path/to/report.md]
 * Exit:    0 when the check ran (updates or not), 1 when it could not run (network or data problem).
 * In GitHub Actions it also writes has_updates / title / fingerprint to $GITHUB_OUTPUT.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? resolve(process.argv[i + 1]) : fallback;
};
const STATE_FILE = arg('--state', resolve(here, '../agent/state.json'));
const REPORT_FILE = arg('--report', resolve(here, '../agent/report.md'));
const REGISTRY = 'https://registry.npmjs.org';

async function latestManifest(pkg) {
  const res = await fetch(`${REGISTRY}/${pkg.replace('/', '%2F')}/latest`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`npm registry answered ${res.status} for ${pkg}`);
  return res.json();
}

/** Component names from the package's "exports": entries like "./badge", not "./package.json" or styles. */
function entryPoints(manifest) {
  const keys = Object.keys(manifest.exports ?? {});
  const names = keys
    .filter((k) => /^\.\/[^/*]+$/.test(k) && k !== './package.json' && !/\.(s?css|json)$/.test(k))
    .map((k) => k.slice(2));
  if (names.length === 0) throw new Error('No entry points found in @angular/material exports. Has the package layout changed?');
  return names.sort();
}

const part = (version, level) => version.split('.').slice(0, level === 'major' ? 1 : 2).join('.');

async function main() {
  const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  const found = { newComponents: [], removedComponents: [], frameworks: [] };

  // 1. Angular Material components
  const material = await latestManifest('@angular/material');
  const known = state.material.components;
  const ignore = new Set(state.material.ignore ?? []);
  const live = entryPoints(material).filter((n) => !ignore.has(n));
  found.newComponents = live.filter((n) => !(n in known));
  found.removedComponents = Object.keys(known).filter((n) => !live.includes(n));
  const materialChanged = material.version !== state.material.seenVersion;

  // 2. Framework versions
  for (const [pkg, info] of Object.entries(state.frameworks)) {
    const latest = (await latestManifest(pkg)).version;
    if (part(latest, info.track) !== part(info.seen, info.track)) {
      found.frameworks.push({ pkg, seen: info.seen, latest, track: info.track });
    }
  }

  const hasUpdates = found.newComponents.length > 0 || found.removedComponents.length > 0 || found.frameworks.length > 0;

  // Report (Markdown, used as the GitHub issue body)
  const lines = [];
  const today = new Date().toISOString().slice(0, 10);
  lines.push(`Checked on ${today}. Angular Material is at ${material.version} (last recorded: ${state.material.seenVersion}).`, '');
  if (found.newComponents.length) {
    lines.push('## New Angular Material components', '');
    for (const n of found.newComponents) lines.push(`- \`${n}\`: https://material.angular.dev/components/${n}/overview`);
    lines.push('');
  }
  if (found.removedComponents.length) {
    lines.push('## No longer in Angular Material', '', 'These are in `agent/state.json` but no longer in the package exports:', '');
    for (const n of found.removedComponents) lines.push(`- \`${n}\``);
    lines.push('');
  }
  if (found.frameworks.length) {
    lines.push('## New framework versions', '', '| Package | Last recorded | Latest |', '| --- | --- | --- |');
    for (const f of found.frameworks) lines.push(`| ${f.pkg} | ${f.seen} | ${f.latest} |`);
    lines.push('');
  }
  if (!hasUpdates) lines.push('Nothing new since the last check.', '');
  if (hasUpdates) {
    lines.push(
      '## What to do',
      '',
      '- New component: decide whether to build it, then set it to `planned` or `skipped` in `agent/state.json`.',
      '- New framework version: run the compatibility tests, then update `seen` in `agent/state.json` and the dashboard data.',
      '',
    );
  }

  const parts = [];
  if (found.newComponents.length) parts.push(`${found.newComponents.length} new Material component${found.newComponents.length > 1 ? 's' : ''}`);
  const friendly = { '@angular/core': 'Angular', react: 'React', vue: 'Vue', '@stencil/core': 'Stencil' };
  if (found.frameworks.length) parts.push(found.frameworks.map((f) => `${friendly[f.pkg] ?? f.pkg} ${f.latest}`).join(', '));
  if (found.removedComponents.length) parts.push(`${found.removedComponents.length} component${found.removedComponents.length > 1 ? 's' : ''} removed`);
  const title = hasUpdates ? `New update: ${parts.join(', ')}` : 'No new update';

  const fingerprint = createHash('sha256')
    .update(JSON.stringify([found.newComponents, found.removedComponents, found.frameworks.map((f) => [f.pkg, f.latest])]))
    .digest('hex')
    .slice(0, 12);
  lines.push(`<!-- fingerprint: ${fingerprint} -->`);

  mkdirSync(dirname(REPORT_FILE), { recursive: true });
  writeFileSync(REPORT_FILE, lines.join('\n') + '\n');

  console.log(title);
  console.log(lines.join('\n'));
  if (materialChanged && !hasUpdates) console.log(`(Angular Material moved to ${material.version} with no new components. Update seenVersion when convenient.)`);

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `has_updates=${hasUpdates}\ntitle=${title}\nfingerprint=${fingerprint}\n`);
  }
}

main().catch((err) => {
  console.error(`Update check failed: ${err.message}`);
  process.exit(1);
});

# Update check

A monthly GitHub Actions job (`.github/workflows/check-updates.yml`) that looks for:

1. **New Angular Material components.** Each component is its own entry point in the `exports` of the official
   `@angular/material` package, so a new one shows up there. They are compared with `state.json`.
2. **New framework versions** of Angular (major), React (major), Vue (minor) and Stencil (minor).

If something is new it opens a GitHub issue titled **New update: ...** with the label `new-update`. If nothing is new, the run
page shows "Nothing new since the last check". The same findings are never reported twice while the issue is open.

It only reports. It does not change code, does not publish, and none of this folder, `scripts/` or `.github/` is part of the npm
package (`files` in `package.json` lists only `dist/` and `loader/`).

## Run it

- On GitHub: **Actions → Check for updates → Run workflow**.
- On your computer (Node 18 or newer): `npm run check-updates`. It writes `agent/report.md` (not committed).

## state.json

- `material.components`: every Angular Material component and its status.
  - `built`: already in the kit (`evoke` is the tag).
  - `planned`: to be built.
  - `skipped`: decided not to build.
- `material.ignore`: entry points that are not components (`core`, `theming`, `_theming`).
- `material.seenVersion`: the Angular Material version last looked at.
- `frameworks`: the version last seen of each framework, and how closely to follow it (`major` or `minor`).

When you act on an issue, update this file: give a new component a status, and raise `seen` to the new framework version.
The check is quiet again after that.

## Later

Compatibility tests, writing new components, publishing and updating the dashboard are separate steps and are not part of this job yet.

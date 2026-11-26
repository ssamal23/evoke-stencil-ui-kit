# Update check

A monthly GitHub Actions job (`.github/workflows/check-updates.yml`) that looks for:

1. **New Angular Material components.** Each component is its own entry point in the `exports` of the official
   `@angular/material` package, so a new one shows up there. They are compared with `state.json`.
2. **New framework versions** of Angular (major), React (major), Vue (minor) and Stencil (minor).

If something is new it opens a GitHub issue titled **New update: ...** with the label `new-update`. If nothing is new, the run
page shows "Nothing new since the last check". The same findings are never reported twice while the issue is open.

Every report, with or without news, ends with a **Coverage** section: how many Angular Material components the kit covers, the list
of components **planned but not built yet** (with a link to each one's Angular Material page), and the ones left out on purpose.
It is read from `state.json`, so it is only as current as that file. It never opens an issue by itself. A status other than
`built`, `planned` or `skipped` stops the run with an error, so a typo is noticed.

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

## Publishing setup

The release also writes `compat.json` into the package (from `compat/compat.source.json` plus the versions the compatibility tests installed). The dashboard reads it per version. `prepublishOnly` refuses to publish if the file is missing or belongs to another version.

`.github/workflows/publish.yml` publishes the package, but only when a release tag like `v0.3.0` is pushed, and only after a person approves. It builds, runs the compatibility tests, and checks that the tag matches `package.json`. A pre-release version such as `0.4.0-beta.1` is published under the `next` tag, never `latest`.

It needs two one-time settings. No npm token is stored anywhere.

1. **npm (trusted publishing).** On npmjs.com open the package `@evoke-tech/stencil-ui-kit` > Settings > Trusted Publisher > GitHub Actions, and enter: owner `ssamal23`, repository `evoke-stencil-ui-kit`, workflow `publish.yml`, environment `npm-publish`.
2. **GitHub (the approval step).** In the repository open Settings > Environments > New environment, name it `npm-publish`, and tick **Required reviewers** and add yourself.

Until both are done the publish job cannot run (it stops at the approval step, or npm refuses it). The test job still works.

## Later

Compatibility tests, writing new components, publishing and updating the dashboard are separate steps and are not part of this job yet.

# Changelog

## 0.3.1

No component changes. The package now carries its own compatibility record.

- New file `compat.json` in the package (also importable as `@evoke-tech/stencil-ui-kit/compat.json`). It lists the framework versions this release was tested with (Angular, React 19, React 18, Vue, Chromium) and the styling libraries, with notes.
- The framework versions are not typed by hand: the release build reads them from the packages the compatibility tests installed, and refuses to write the file if a test app did not pass.
- The version dashboard reads this file for each release, so it no longer needs a manual update.

## 0.3.0

Fourteen new components, following Angular Material. The kit now has 34. Nothing existing changed.

- **Layout and content:** `evoke-divider`, `evoke-list`, `evoke-expansion`, `evoke-grid-list`, `evoke-icon`
- **Navigation:** `evoke-menu`, `evoke-sidenav`, `evoke-stepper`, `evoke-tree`
- **Overlays:** `evoke-bottom-sheet`
- **Inputs:** `evoke-button-toggle`, `evoke-slider`, `evoke-datepicker`, `evoke-timepicker`
- New icons: `calendar`, `clock`.
- Vue wrappers (`@evoke-tech/stencil-ui-kit/vue`) include all new components.
- `evoke-timepicker` uses the `twelve-hour` attribute for AM/PM display; its value is always 24-hour `HH:MM`.
- **Fixed: the Vue wrappers did not work in a Vite or Rollup production build.** They started the components through the lazy loader, whose files a bundler leaves out, so no component appeared. Each wrapper now registers its own element from the tree-shakeable build. `app.use(EvokeUi)` still works but does nothing and is no longer needed. The package `exports` also resolve `@evoke-tech/stencil-ui-kit/components/<name>.js`.
- Using the raw `<evoke-*>` tags in a bundled Vue app: register components with `defineCustomElement()` from `@evoke-tech/stencil-ui-kit/components/<name>.js` instead of the loader, and listen to events with `addEventListener` (see the README).
- Not included: date ranges, multi-select in the tree, and autocomplete (left out on purpose).


# Compatibility tests

Checks that the **packed** kit (the same files an npm user gets) works in a browser. This folder is not part of the published
package (`files` in the root `package.json` lists only `dist/` and `loader/`).

## Run

From the repository root:

```bash
npm run compat -- html              # build, pack, install, test the plain-HTML app (about 2 minutes)
npm run compat -- html --no-build   # reuse the existing dist/ folder
npm run compat -- html -g "switch"  # extra arguments go to Playwright: run only matching checks
```

The first run installs Playwright and downloads its Chromium browser (`tests/compat/node_modules`, about 150 MB, not committed).
Results are written to `tests/compat/results/<app>.json` and `<app>.md` (not committed). The command exits with a non-zero
code when any check fails.

## What is checked

`specs/components.spec.mjs`, against `apps/html/index.html` (one example of every component):

- every component is registered, and none exists that the test does not know about;
- every component renders its inner markup;
- the events fire with the right value (`evokeChange`, `evokeInput`, `evokeClose`, `evokeDismiss`, `evokeAction`, `evokeSort`,
  `evokeClick`, `evokeRemove`, and the button's native `click`);
- the modal and toast open and close, and the tooltip shows on hover;
- the page logs no console error, throws no error and loses no request during any check.

`specs/themes.spec.mjs`, against `apps/html/theme.html`: each theme file (`tokens`, `tailwind`, `bootstrap`, `material`) loads after
the base file and changes the primary button colour. With none of those systems loaded, the theme file's fallback colours apply.

## When a component is added to the kit

1. Add its tag to `EXPECTED_TAGS` in `specs/components.spec.mjs`.
2. Add an example (with an `id`) to `apps/html/index.html`, and a render check and an event check for it.

The test "no component is registered that this test does not know about" fails until this is done, on purpose.

## Next

The same shared checks will run in Vue, React (18 and 19) and Angular apps with the newest framework versions. Only the plain-HTML
app exists so far.

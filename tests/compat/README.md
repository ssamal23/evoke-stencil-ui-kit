# Compatibility tests

Checks that the **packed** kit (the same files an npm user gets) works in a browser. This folder is not part of the published
package (`files` in the root `package.json` lists only `dist/` and `loader/`).

## Run

From the repository root:

```bash
npm run compat -- html              # build, pack, install, test the plain-HTML app (about 2 minutes)
npm run compat -- html --no-build   # reuse the existing dist/ folder
npm run compat -- html -g "switch"  # extra arguments go to Playwright: run only matching checks
npm run compat -- vue               # a real Vue 3 app built with Vite (about 1 minute)
```

The first run installs Playwright and downloads its Chromium browser (`tests/compat/node_modules`, about 150 MB, not committed).
Results are written to `tests/compat/results/<app>.json` and `<app>.md` (not committed). The command exits with a non-zero
code when any check fails.

## What is checked

The checks for each app are in `specs/<app>/`.

`specs/html/components.spec.mjs`, against `apps/html/index.html` (one example of every component):

- every component is registered, and none exists that the test does not know about;
- every component renders its inner markup;
- the events fire with the right value (`evokeChange`, `evokeInput`, `evokeClose`, `evokeDismiss`, `evokeAction`, `evokeSort`,
  `evokeClick`, `evokeRemove`, and the button's native `click`);
- the modal and toast open and close, and the tooltip shows on hover;
- the page logs no console error, throws no error and loses no request during any check.

`specs/html/themes.spec.mjs`, against `apps/html/theme.html`: each theme file (`tokens`, `tailwind`, `bootstrap`, `material`) loads after
the base file and changes the primary button colour. With none of those systems loaded, the theme file's fallback colours apply.

`specs/vue/vue.spec.mjs`, against `apps/vue` (a Vue 3 app, built with Vite into `.work/vue/dist`). The same page is written twice: with the
Vue wrappers (`index.html`) and with the raw `<evoke-*>` tags (`raw.html`). Each check runs against both and covers: the components render
after a production build, Vue text inside a component updates without losing the component's inner markup, Vue values reach components
as props, component events reach Vue, list props that change in Vue (select options, table rows) update the component, and a modal opens
from a Vue value and closes back into it. Any console error or Vue warning fails the check.

The Vue app installs the newest `vue`, `vite` and `@vitejs/plugin-vue`, so a new Vue release that breaks the kit shows up here.

## When a component is added to the kit

1. Add its tag to `EXPECTED_TAGS` in `specs/html/components.spec.mjs`.
2. Add an example (with an `id`) to `apps/html/index.html`, and a render check and an event check for it.

The test "no component is registered that this test does not know about" fails until this is done, on purpose.

## Next

The same shared checks will run in Vue, React (18 and 19) and Angular apps with the newest framework versions. Only the plain-HTML
app exists so far.

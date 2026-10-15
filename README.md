# evoke-stencil-ui-kit

Framework-agnostic web components built with [Stencil](https://stenciljs.com). One package works in Angular, React, Vue, or plain HTML.

Components: `evoke-button`, `evoke-input`, `evoke-select`, `evoke-checkbox`, `evoke-radio-group`, `evoke-card`, `evoke-alert`, `evoke-modal`.

## Development

```bash
npm install
npm start            # dev server with live reload (opens src/index.html)
npm run build        # produces dist/ and loader/
```

See [Test locally](#test-locally-before-publishing) and [Publish to npm](#publish-to-npm) below.

## Install & register

```bash
npm install evoke-stencil-ui-kit
```

Include the design tokens once (global CSS):

```css
@import 'evoke-stencil-ui-kit/dist/evoke-ui/evoke-ui.css';
```

### Angular
```ts
// main.ts
import { defineCustomElements } from 'evoke-stencil-ui-kit/loader';
defineCustomElements();

// component / module
@Component({ schemas: [CUSTOM_ELEMENTS_SCHEMA], ... })
```
```html
<evoke-button variant="primary" (click)="save()">Save</evoke-button>
<evoke-input label="Email" (evokeInput)="email = $event.detail"></evoke-input>
```

### React
```tsx
import { defineCustomElements } from 'evoke-stencil-ui-kit/loader';
defineCustomElements();

<evoke-button variant="danger" onClick={save}>Delete</evoke-button>
<evoke-input label="Email" ref={el => el?.addEventListener('evokeInput', e => setEmail(e.detail))} />
```
(React 19 passes props/events to custom elements natively; for React 18 use `ref` + `addEventListener`.)

### Vue
```ts
// vite.config.ts: vue({ template: { compilerOptions: { isCustomElement: t => t.startsWith('evoke-') } } })
import { defineCustomElements } from 'evoke-stencil-ui-kit/loader';
defineCustomElements();
```
```html
<evoke-input label="Email" @evokeInput="email = $event.detail" />
```

### Plain HTML / CDN
```html
<script type="module" src="https://unpkg.com/evoke-stencil-ui-kit/dist/evoke-ui/evoke-ui.esm.js"></script>
```

## Default look

Out of the box the components follow the Evoke Figma design: orange primary (`#ff5316`), navy secondary (`#0b1560`), Inter font, pill-shaped 56px buttons and 56px inputs with an 8px radius and a `#dedede` border.

```html
<evoke-input label="Username" icon="mail" placeholder="name@company.com"></evoke-input>
<evoke-input label="Password" icon="lock" type="password" placeholder="Enter your password"></evoke-input>
<evoke-button block>Sign in to workspace</evoke-button>
```

- `evoke-button`: `variant` = `primary` (default) | `secondary` | `outline` | `danger`; `block` makes it full width.
- `evoke-input`: `icon` = `mail` | `lock` | `user` | `search`.
- Change the look with tokens, e.g. `--evoke-primary`, `--evoke-radius-button`, `--evoke-control-height`. The Material / Tailwind / Bootstrap themes below replace these defaults with that system's look.
## Form components

All form components show an error message when you set the `error` prop, and emit `evokeChange` (inputs also emit `evokeInput` on each keystroke).

```html
<evoke-input label="Username" icon="mail" error="Username is required"></evoke-input>

<evoke-select label="Sign in as" placeholder="Select your role"
  options='[{"label":"Developer","value":"dev"},{"label":"Designer","value":"designer"}]'></evoke-select>

<evoke-checkbox label="Remember me" checked></evoke-checkbox>
<evoke-checkbox label="I accept the terms" error="You must accept the terms"></evoke-checkbox>

<evoke-radio-group label="Plan" value="pro" inline
  options='[{"label":"Free","value":"free"},{"label":"Pro","value":"pro"}]'></evoke-radio-group>
```

| Component | Props | Event (`event.detail`) |
|---|---|---|
| `evoke-input` | `label`, `value`, `type`, `placeholder`, `icon`, `disabled`, `error`, `input-class` | `evokeInput`, `evokeChange` (string) |
| `evoke-select` | `label`, `options`, `value`, `placeholder`, `disabled`, `error`, `select-class` | `evokeChange` (string) |
| `evoke-checkbox` | `label`, `checked`, `disabled`, `error`, `input-class` | `evokeChange` (boolean) |
| `evoke-radio-group` | `label`, `options`, `value`, `name`, `inline`, `disabled`, `error` | `evokeChange` (string) |

`options` is an array of `{ label, value, disabled? }`. In Angular/React/Vue bind it as a property (`[options]="roles"`, `options={roles}`, `:options="roles"`); in plain HTML pass a JSON string.
## Styling / themes

Components render in the **light DOM** (`shadow: false`), so global stylesheets reach them. Look and feel is driven by `--evoke-*` CSS variables. Pick **one** theme file and import it after the base CSS:

| Your stack | Import (global stylesheet) |
|---|---|
| Plain CSS | `@import 'evoke-stencil-ui-kit/dist/evoke-ui/evoke-ui.css';` and override `--evoke-*` yourself |
| Angular + Material | base + `@import 'evoke-stencil-ui-kit/themes/material.css';` (maps to `--mat-sys-*`) |
| Angular or React + Tailwind | base + `@import 'evoke-stencil-ui-kit/themes/tailwind.css';` (maps to Tailwind `--color-*`, `--radius-*`) |
| Any + Bootstrap | base + `@import 'evoke-stencil-ui-kit/themes/bootstrap.css';` (maps to `--bs-*`) |

```css
/* styles.css, Angular Material example */
@import 'evoke-stencil-ui-kit/dist/evoke-ui/evoke-ui.css';
@import 'evoke-stencil-ui-kit/themes/material.css';
```

On top of the theme you can pass utility classes through the class props: `button-class`, `input-class`, `card-class`, `modal-class`.

```html
<evoke-button button-class="px-6 py-3 rounded-full shadow-lg">Tailwind</evoke-button>
<evoke-button button-class="btn btn-lg">Bootstrap</evoke-button>
```

Tokens: `--evoke-primary`, `-primary-contrast`, `-danger`, `-success`, `-warning`, `-info`, `-surface`, `-text`, `-border`, `-radius`, `-radius-field`, `-font`, `-focus-ring`.

Light-DOM trade-off: component CSS is global, so it is prefixed with the tag name (`evoke-button .evoke-btn`) to avoid collisions.

## Test locally before publishing

Use `npm pack`: it creates the exact tarball that `npm publish` would upload, so it also catches problems with `files` / `exports`.

### 1. Build and pack
```bash
cd D:\Stenciljs_NPM_Package
npm run build
npm pack
```
This creates `evoke-stencil-ui-kit-0.1.0.tgz`. To check what is inside: `npm pack --dry-run`.

### 2. Install into a test project (Angular, React or Vue)
```bash
cd path/to/your-test-app
npm install D:\Stenciljs_NPM_Package\evoke-stencil-ui-kit-0.1.0.tgz
```

### 3. Register the components and a theme
- **Angular:** in `main.ts` call `defineCustomElements()` from `evoke-stencil-ui-kit/loader`, add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to the component/module, and import the base CSS plus one theme in `styles.css`.
- **React:** in `main.tsx` call `defineCustomElements()`, and import the base CSS plus one theme in your global CSS.

See [Install & register](#install--register) and [Styling / themes](#styling--themes) above for the exact snippets.

### 4. Verify
- Run the app (`ng serve` / `npm run dev`) and use `<evoke-button>`, `<evoke-input>`, `<evoke-card>`, `<evoke-alert>`, `<evoke-modal>`.
- Check the components are styled and the theme tokens change the look (Material / Tailwind / Bootstrap).
- Check events: `evokeInput` / `evokeChange` / `evokeClose` / `evokeDismiss` deliver the value in `event.detail`.
- Check class props work, e.g. `button-class="btn btn-lg"` (Bootstrap) or `button-class="px-6 py-3"` (Tailwind).

### 5. After changing the package
Rebuild and repack, then reinstall in the test app:
```bash
cd D:\Stenciljs_NPM_Package && npm run build && npm pack
cd path/to/your-test-app && npm install D:\Stenciljs_NPM_Package\evoke-stencil-ui-kit-0.1.0.tgz
```
(If the app keeps using the old code, delete its `node_modules/.vite` or `.angular/cache` folder and restart.)

Alternative: `npm link` (run `npm link` in the package folder, then `npm link evoke-stencil-ui-kit` in the app). It is faster to iterate but can break with duplicate-dependency or symlink issues; if so, use `npm pack`.

## Publish to npm

### One-time setup
1. Create an account at https://www.npmjs.com and enable 2FA.
2. Log in from the terminal:
   ```bash
   npm login
   npm whoami          # confirms you are logged in
   ```
3. Confirm the package name is free (a 404 means it is available):
   ```bash
   npm view evoke-stencil-ui-kit
   ```

### Every release
1. Make sure the build and the local test above pass.
2. Bump the version (follows semver; creates a git tag if this is a git repo):
   ```bash
   npm version patch    # 0.1.0 -> 0.1.1  (bug fix)
   npm version minor    # 0.1.0 -> 0.2.0  (new component/feature)
   npm version major    # 0.1.0 -> 1.0.0  (breaking change)
   ```
3. Preview what will be published (only `dist/` and `loader/` should be listed):
   ```bash
   npm pack --dry-run
   ```
4. Publish (`prepublishOnly` rebuilds automatically):
   ```bash
   npm publish
   ```
   If you enabled 2FA you will be asked for a one-time code (`npm publish --otp=123456`).
5. Verify:
   ```bash
   npm view evoke-stencil-ui-kit
   npm install evoke-stencil-ui-kit     # in a clean project
   ```

### Notes
- Unscoped names like `evoke-stencil-ui-kit` are public by default. If you later move to a scoped name (e.g. `@your-org/evoke-stencil-ui-kit`), publish with `npm publish --access public`.
- A published version can't be overwritten; fix problems by publishing a new version. Within 72 hours you can `npm unpublish evoke-stencil-ui-kit@0.1.0`.
- To try a release before going public, publish a pre-release under a tag: `npm version prerelease --preid=beta && npm publish --tag beta` (installed with `npm install evoke-stencil-ui-kit@beta`).
- Add `"repository"` and `"author"` fields to `package.json` so the npm page links to your source.

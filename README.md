# @evoke-tech/stencil-ui-kit

Framework-agnostic web components built with [Stencil](https://stenciljs.com). One package works in Angular, React, Vue, or plain HTML.

The kit ships 20 components (see [Components](#components)).

## Development

```bash
npm install
npm start            # dev server with live reload (opens src/index.html)
npm run build        # produces dist/ and loader/
```

See [Test locally](#test-locally-before-publishing) and [Publish to npm](#publish-to-npm) below.

## Install & register

```bash
npm install @evoke-tech/stencil-ui-kit
```

Include the design tokens once (global CSS):

```css
@import '@evoke-tech/stencil-ui-kit/dist/evoke-ui/evoke-ui.css';
```

### Angular
```ts
// main.ts
import { defineCustomElements } from '@evoke-tech/stencil-ui-kit/loader';
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
import { defineCustomElements } from '@evoke-tech/stencil-ui-kit/loader';
defineCustomElements();

<evoke-button variant="danger" onClick={save}>Delete</evoke-button>
<evoke-input label="Email" ref={el => el?.addEventListener('evokeInput', e => setEmail(e.detail))} />
```
(React 19 passes props/events to custom elements natively; for React 18 use `ref` + `addEventListener`.)

### Vue

**Recommended: use the Vue wrappers** (`@evoke-tech/stencil-ui-kit/vue`). They are generated with Stencil's Vue output target and need no compiler setting.

```ts
// main.ts
import { createApp } from 'vue';
import { EvokeUi } from '@evoke-tech/stencil-ui-kit/vue';
import '@evoke-tech/stencil-ui-kit/dist/evoke-ui/evoke-ui.css';

createApp(App).use(EvokeUi).mount('#app'); // registers the custom elements
```
```vue
<script setup>
import { EvokeButton, EvokeInput } from '@evoke-tech/stencil-ui-kit/vue';
</script>
<template>
  <EvokeButton @click="count++">Clicked {{ count }} times</EvokeButton>
  <EvokeInput label="Email" @evokeInput="email = $event.detail" />
</template>
```

**Why wrappers?** The components render into the page DOM (no shadow root) so Tailwind, Bootstrap and your CSS can style them. If you use the raw tag `<evoke-button>Count: {{ n }}</evoke-button>`, Vue replaces the tag's contents on every update and removes the button's inner markup. The wrappers pass the text to the tag in a way that avoids this.

**Using the raw tags instead?** Set `isCustomElement: t => t.startsWith('evoke-')` in your Vue compiler options, call `defineCustomElements()` from `@evoke-tech/stencil-ui-kit/loader`, and wrap any dynamic text in an element: `<evoke-button><span>{{ n }}</span></evoke-button>`.

### Plain HTML / CDN
```html
<script type="module" src="https://unpkg.com/@evoke-tech/stencil-ui-kit/dist/evoke-ui/evoke-ui.esm.js"></script>
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
## Components

20 components, each with two variants chosen by **one prop** (default = variant 1). Tags start with `evoke-`, events start with `evoke`, and the value is `event.detail` itself.

| Component | Variant 1 (default) | Variant 2 | Events (`event.detail`) |
|---|---|---|---|
| `evoke-button` | `variant="primary\|secondary\|danger"` (solid) | `variant="ghost"` (text only); also `outline` | native `click` |
| `evoke-input` | `appearance="outlined"` | `appearance="filled"` | `evokeInput`, `evokeChange` (string) |
| `evoke-select` | single (native `<select>`) | `multiple` (chips) + optional `searchable` | `evokeChange` (string, or string[] when `multiple`) |
| `evoke-checkbox` | standard | `indeterminate` | `evokeChange` (boolean) |
| `evoke-radio-group` | `appearance="classic"` | `appearance="segmented"` | `evokeChange` (string) |
| `evoke-card` | `appearance="outlined"` | `appearance="elevated"` (+ `clickable`) | `evokeClick` |
| `evoke-alert` | `appearance="subtle"` | `appearance="solid"` | `evokeDismiss` |
| `evoke-modal` | `position="center"` | `position="right"` (drawer) | `evokeClose` |
| `evoke-textarea` | fixed `rows` | `auto-grow` + `max-length` counter | `evokeInput`, `evokeChange` (string) |
| `evoke-switch` | plain toggle | with `label` + `description` | `evokeChange` (boolean) |
| `evoke-tabs` | `appearance="underline"` | `appearance="pill"` | `evokeChange` (string) |
| `evoke-badge` | `count` (with `max`) | `dot` | none |
| `evoke-tooltip` | `theme="dark"` | `theme="light"` (arrow) | none |
| `evoke-toast` | message only | message + `action` | `evokeAction`, `evokeClose` |
| `evoke-table` | basic | `striped` + `sortable` | `evokeSort` ({ key, direction }) |
| `evoke-pagination` | `appearance="numbered"` | `appearance="compact"` | `evokeChange` (number) |
| `evoke-chip` | filter (selectable) | `removable` | `evokeChange` (boolean), `evokeRemove` |
| `evoke-progress` | `type="linear"` | `type="circular"` | none |
| `evoke-app-bar` | `appearance="light"` | `appearance="dark"` | none (slots `logo`, `nav`, `actions`) |
| `evoke-quantity-stepper` | `appearance="inline"` | `appearance="compact"` (dropdown) | `evokeChange` (number) |

Every component also has a class pass-through prop (`button-class`, `input-class`, `select-class`, `textarea-class`, `card-class`, `modal-class`) and shows `error` text where it applies.

### Examples (one per variant)

```html
<!-- Button -->
<evoke-button>Solid primary</evoke-button>
<evoke-button variant="ghost" size="sm" icon="arrow-right">Ghost</evoke-button>
<evoke-button loading>Saving</evoke-button>
<evoke-button variant="ghost" icon="cart" icon-only accessible-label="Cart"></evoke-button>

<!-- Input -->
<evoke-input label="Email" icon="mail" hint="We never share it"></evoke-input>
<evoke-input label="Email" appearance="filled" error="Email is required"></evoke-input>

<!-- Select: set options as a property (Angular/React/Vue) or a JSON string (plain HTML) -->
<evoke-select label="Role" placeholder="Select your role" options='[{"label":"Developer","value":"dev"}]'></evoke-select>
<evoke-select label="Skills" multiple searchable options='[{"label":"Angular","value":"ng"},{"label":"React","value":"react"}]'></evoke-select>

<!-- Checkbox -->
<evoke-checkbox label="Remember me" checked></evoke-checkbox>
<evoke-checkbox label="Select all" indeterminate></evoke-checkbox>

<!-- Radio group -->
<evoke-radio-group label="Plan" inline options='[{"label":"Free","value":"free"},{"label":"Pro","value":"pro"}]'></evoke-radio-group>
<evoke-radio-group label="Billing" appearance="segmented" options='[{"label":"Monthly","value":"m"},{"label":"Yearly","value":"y"}]'></evoke-radio-group>

<!-- Card (the media slot is optional) -->
<evoke-card heading="Outlined">Body</evoke-card>
<evoke-card appearance="elevated" clickable heading="Product"><img slot="media" src="shoe.jpg" alt="" />Body</evoke-card>

<!-- Alert -->
<evoke-alert type="success" dismissible>Saved</evoke-alert>
<evoke-alert type="danger" appearance="solid">Payment failed</evoke-alert>

<!-- Modal: set `open`, listen for evokeClose. Focus is trapped and returned on close. -->
<evoke-modal open heading="Confirm">Centred dialog</evoke-modal>
<evoke-modal open heading="Cart" position="right" size="lg">Side drawer</evoke-modal>

<!-- Textarea -->
<evoke-textarea label="Notes" rows="3"></evoke-textarea>
<evoke-textarea label="Bio" auto-grow max-length="200"></evoke-textarea>

<!-- Switch -->
<evoke-switch accessible-label="Notifications"></evoke-switch>
<evoke-switch label="Email alerts" description="Get a message when an order ships"></evoke-switch>

<!-- Tabs: options are the tab list; put the active panel's content inside -->
<evoke-tabs label="Product" value="specs" options='[{"label":"Overview","value":"o"},{"label":"Specs","value":"specs"}]'>Panel content</evoke-tabs>
<evoke-tabs appearance="pill" options='[{"label":"All","value":"all"},{"label":"Sale","value":"sale"}]'></evoke-tabs>

<!-- Badge: wrap anything, or use it on its own -->
<evoke-badge count="3" label="3 items in cart"><evoke-button icon="cart" icon-only accessible-label="Cart"></evoke-button></evoke-badge>
<evoke-badge dot color="success" label="Online"></evoke-badge>

<!-- Tooltip: wrap the trigger; placement = top | bottom | left | right -->
<evoke-tooltip text="Delete item"><evoke-button variant="outline">Hover</evoke-button></evoke-tooltip>
<evoke-tooltip text="Details" theme="light" placement="bottom"><evoke-button variant="outline">Info</evoke-button></evoke-tooltip>

<!-- Toast: duration 0 keeps it open -->
<evoke-toast open message="Saved"></evoke-toast>
<evoke-toast open message="Added to cart" action="View cart" type="success"></evoke-toast>

<!-- Table: columns/rows as properties or JSON strings -->
<evoke-table columns='[{"key":"name","label":"Name"}]' rows='[{"name":"Maya"}]'></evoke-table>
<evoke-table striped sortable columns='[{"key":"name","label":"Name","sortable":true}]' rows='[{"name":"Maya"}]'></evoke-table>

<!-- Pagination: total = number of pages -->
<evoke-pagination page="2" total="10"></evoke-pagination>
<evoke-pagination page="2" total="10" appearance="compact"></evoke-pagination>

<!-- Chip -->
<evoke-chip label="In stock"></evoke-chip>
<evoke-chip label="Red" removable></evoke-chip>

<!-- Progress -->
<evoke-progress value="60" label="Uploading"></evoke-progress>
<evoke-progress type="circular" indeterminate label="Loading"></evoke-progress>

<!-- App bar -->
<evoke-app-bar sticky>
  <span slot="logo">Evoke</span>
  <span slot="nav"><a href="/" aria-current="page">Home</a><a href="/shop">Shop</a></span>
  <span slot="actions"><evoke-button size="sm">Sign in</evoke-button></span>
</evoke-app-bar>
<evoke-app-bar appearance="dark">...</evoke-app-bar>

<!-- Quantity stepper -->
<evoke-quantity-stepper value="2" min="1" max="10"></evoke-quantity-stepper>
<evoke-quantity-stepper value="3" appearance="compact"></evoke-quantity-stepper>
```

Props that take lists (`options`, `columns`, `rows`) accept an array property or a JSON string. Bind them as properties in frameworks: `[options]="roles"` (Angular), `options={roles}` (React 19), `:options="roles"` (Vue).

### Accessibility
Real `<button>`, `<input>`, `<select>` and `<textarea>` elements; visible labels; `aria-label` on icon-only controls (`accessible-label`); `aria-invalid` + `role="alert"` for errors; arrow-key navigation for tabs, radios, select (multi/searchable) and the stepper; Esc to close modal, drawer, select and tooltip; focus trapped in modal/drawer and restored on close; `prefers-reduced-motion` respected.

Icons (`icon` prop): `mail`, `lock`, `user`, `search`, `plus`, `minus`, `check`, `x`, `arrow-right`, `arrow-up`, `arrow-down`, `cart`, `info`, `alert`, and the chevrons.
## Styling / themes

Components render in the **light DOM** (`shadow: false`), so global stylesheets reach them. Look and feel is driven by `--evoke-*` CSS variables. Pick **one** theme file and import it after the base CSS:

| Your stack | Import (global stylesheet) |
|---|---|
| Plain CSS | `@import '@evoke-tech/stencil-ui-kit/dist/evoke-ui/evoke-ui.css';` and override `--evoke-*` yourself |
| Angular + Material | base + `@import '@evoke-tech/stencil-ui-kit/themes/material.css';` (maps to `--mat-sys-*`) |
| Angular or React + Tailwind | base + `@import '@evoke-tech/stencil-ui-kit/themes/tailwind.css';` (maps to Tailwind `--color-*`, `--radius-*`) |
| Any + Bootstrap | base + `@import '@evoke-tech/stencil-ui-kit/themes/bootstrap.css';` (maps to `--bs-*`) |

```css
/* styles.css, Angular Material example */
@import '@evoke-tech/stencil-ui-kit/dist/evoke-ui/evoke-ui.css';
@import '@evoke-tech/stencil-ui-kit/themes/material.css';
```

On top of the theme you can pass utility classes through the class props: `button-class`, `input-class`, `card-class`, `modal-class`.

```html
<evoke-button button-class="px-6 py-3 rounded-full shadow-lg">Tailwind</evoke-button>
<evoke-button button-class="btn btn-lg">Bootstrap</evoke-button>
```

Tokens: `--evoke-primary`, `-primary-contrast`, `-primary-text` (primary colour used for text on light backgrounds), `-surface-muted`, `-shadow`, `-text-muted`, `-danger`, `-success`, `-warning`, `-info`, `-surface`, `-text`, `-border`, `-radius`, `-radius-field`, `-font`, `-focus-ring`.

Light-DOM trade-off: component CSS is global, so it is prefixed with the tag name (`evoke-button .evoke-btn`) to avoid collisions.

## Test locally before publishing

Use `npm pack`: it creates the exact tarball that `npm publish` would upload, so it also catches problems with `files` / `exports`.

### 1. Build and pack
```bash
cd D:\Stenciljs_NPM_Package
npm run build
npm pack
```
This creates `evoke-tech-stencil-ui-kit-0.1.0.tgz`. To check what is inside: `npm pack --dry-run`.

### 2. Install into a test project (Angular, React or Vue)
```bash
cd path/to/your-test-app
npm install D:\Stenciljs_NPM_Package\evoke-tech-stencil-ui-kit-0.1.0.tgz
```

### 3. Register the components and a theme
- **Angular:** in `main.ts` call `defineCustomElements()` from `@evoke-tech/stencil-ui-kit/loader`, add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to the component/module, and import the base CSS plus one theme in `styles.css`.
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
cd path/to/your-test-app && npm install D:\Stenciljs_NPM_Package\evoke-tech-stencil-ui-kit-0.1.0.tgz
```
(If the app keeps using the old code, delete its `node_modules/.vite` or `.angular/cache` folder and restart.)

Alternative: `npm link` (run `npm link` in the package folder, then `npm link @evoke-tech/stencil-ui-kit` in the app). It is faster to iterate but can break with duplicate-dependency or symlink issues; if so, use `npm pack`.

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
   npm view @evoke-tech/stencil-ui-kit 
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
   npm publish --access public
   ```
   If you enabled 2FA you will be asked for a one-time code (`npm publish --otp=123456`).
5. Verify:
   ```bash
   npm view @evoke-tech/stencil-ui-kit
   npm install @evoke-tech/stencil-ui-kit     # in a clean project
   ```

### Notes
- Scoped packages are private by default, so the first publish needs `--access public` (see step 4). Later releases remember it.
- A published version can't be overwritten; fix problems by publishing a new version. Within 72 hours you can `npm unpublish @evoke-tech/stencil-ui-kit@0.1.0`.
- To try a release before going public, publish a pre-release under a tag: `npm version prerelease --preid=beta && npm publish --tag beta` (installed with `npm install @evoke-tech/stencil-ui-kit@beta`).
- Add `"repository"` and `"author"` fields to `package.json` so the npm page links to your source.

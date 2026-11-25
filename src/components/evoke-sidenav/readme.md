# evoke-sidenav



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                              | Type               | Default        |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------- | ------------------ | -------------- |
| `closeOnBackdrop` | `close-on-backdrop` |                                                                                                          | `boolean`          | `true`         |
| `heading`         | `heading`           | Optional title in the panel header                                                                       | `string`           | `''`           |
| `label`           | `label`             | Accessible name when there is no heading                                                                 | `string`           | `'Navigation'` |
| `mode`            | `mode`              | over: slides over the page with a backdrop (like a drawer). side: sits in the page next to your content. | `"over" \| "side"` | `'over'`       |
| `open`            | `open`              | Whether the side panel is visible                                                                        | `boolean`          | `false`        |
| `position`        | `position`          |                                                                                                          | `"end" \| "start"` | `'start'`      |


## Events

| Event        | Description                                                             | Type                |
| ------------ | ----------------------------------------------------------------------- | ------------------- |
| `evokeClose` | Fired when the panel asks to close (backdrop, Esc, or the close button) | `CustomEvent<void>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

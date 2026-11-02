# evoke-card



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                                             | Type                       | Default      |
| ------------ | ------------ | --------------------------------------------------------------------------------------- | -------------------------- | ------------ |
| `appearance` | `appearance` | Outlined (border) or elevated (shadow, no border)                                       | `"elevated" \| "outlined"` | `'outlined'` |
| `cardClass`  | `card-class` | Extra classes for the card container, e.g. "shadow-md" (Tailwind) or "card" (Bootstrap) | `string`                   | `''`         |
| `clickable`  | `clickable`  | Makes the whole card a button (hover/active/focus states, Enter/Space)                  | `boolean`                  | `false`      |
| `heading`    | `heading`    |                                                                                         | `string`                   | `''`         |


## Events

| Event        | Description                                | Type                |
| ------------ | ------------------------------------------ | ------------------- |
| `evokeClick` | Fired when a `clickable` card is activated | `CustomEvent<void>` |


## Slots

| Slot      | Description      |
| --------- | ---------------- |
|           | The default slot |
| `"media"` |                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

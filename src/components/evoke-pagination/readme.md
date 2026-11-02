# evoke-pagination



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                        | Type                      | Default      |
| ------------ | ------------ | -------------------------------------------------- | ------------------------- | ------------ |
| `appearance` | `appearance` | Numbered pages, or compact (Prev, "2 of 10", Next) | `"compact" \| "numbered"` | `'numbered'` |
| `disabled`   | `disabled`   |                                                    | `boolean`                 | `false`      |
| `page`       | `page`       | Current page (1-based)                             | `number`                  | `1`          |
| `total`      | `total`      | Total number of pages                              | `number`                  | `1`          |


## Events

| Event         | Description               | Type                  |
| ------------- | ------------------------- | --------------------- |
| `evokeChange` | Emits the new page number | `CustomEvent<number>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

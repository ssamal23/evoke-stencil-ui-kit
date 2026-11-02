# evoke-table



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                           | Type                                                                                                     | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------- |
| `caption`   | `caption`    | Visually hidden/visible table caption for screen readers                              | `string`                                                                                                 | `''`        |
| `columns`   | `columns`    | Columns as an array of { key, label, sortable?, align? } or a JSON string of the same | `string \| { key: string; label: string; sortable?: boolean; align?: "center" \| "right" \| "left"; }[]` | `[]`        |
| `emptyText` | `empty-text` |                                                                                       | `string`                                                                                                 | `'No data'` |
| `rows`      | `rows`       | Rows as an array of objects keyed by column key, or a JSON string of the same         | `Record<string, string \| number \| boolean>[] \| string`                                                | `[]`        |
| `sortable`  | `sortable`   | Allow sorting on columns marked `sortable` (or all columns if none are marked)        | `boolean`                                                                                                | `false`     |
| `striped`   | `striped`    | Alternate row shading                                                                 | `boolean`                                                                                                | `false`     |


## Events

| Event       | Description                                                                           | Type                                                        |
| ----------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `evokeSort` | Fired after a header is sorted: { key, direction } where direction is 'asc' or 'desc' | `CustomEvent<{ key: string; direction: "desc" \| "asc"; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

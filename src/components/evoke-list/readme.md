# evoke-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                                                        | Type                        | Default   |
| ------------ | ------------ | -------------------------------------------------------------------------------------------------- | --------------------------- | --------- |
| `appearance` | `appearance` | A plain list, or a selectable list (like a listbox)                                                | `"plain" \| "selectable"`   | `'plain'` |
| `items`      | `items`      | Items as an array of { label, value, description?, icon?, disabled? } or a JSON string of the same | `EvokeListItem[] \| string` | `[]`      |
| `label`      | `label`      | Accessible name for the list                                                                       | `string`                    | `''`      |
| `multiple`   | `multiple`   | Selectable list: allow several selected items                                                      | `boolean`                   | `false`   |
| `value`      | `value`      | Selected value, or an array of values when `multiple` (selectable list)                            | `string \| string[]`        | `''`      |


## Events

| Event         | Description                                                                 | Type                              |
| ------------- | --------------------------------------------------------------------------- | --------------------------------- |
| `evokeChange` | Emits the selected value, or the selected values (string[]) when `multiple` | `CustomEvent<string \| string[]>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

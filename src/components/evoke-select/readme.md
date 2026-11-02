# evoke-select



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                            | Type                      | Default              |
| ------------- | -------------- | -------------------------------------------------------------------------------------- | ------------------------- | -------------------- |
| `disabled`    | `disabled`     |                                                                                        | `boolean`                 | `false`              |
| `error`       | `error`        | Error message shown below the field (replaces the hint)                                | `string`                  | `''`                 |
| `hint`        | `hint`         |                                                                                        | `string`                  | `''`                 |
| `label`       | `label`        |                                                                                        | `string`                  | `''`                 |
| `multiple`    | `multiple`     | Multi-select: selected values are shown as removable chips                             | `boolean`                 | `false`              |
| `options`     | `options`      | Options as an array of { label, value, disabled? } or a JSON string of the same        | `EvokeOption[] \| string` | `[]`                 |
| `placeholder` | `placeholder`  |                                                                                        | `string`                  | `'Select an option'` |
| `searchable`  | `searchable`   | Adds a search box that filters the options                                             | `boolean`                 | `false`              |
| `selectClass` | `select-class` | Extra classes for the inner <select> (single, non-searchable mode), e.g. "form-select" | `string`                  | `''`                 |
| `value`       | `value`        | Selected value (string), or an array of values when `multiple`                         | `string \| string[]`      | `''`                 |


## Events

| Event         | Description                                                                         | Type                              |
| ------------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| `evokeChange` | Emits the selected value (string) or the selected values (string[]) when `multiple` | `CustomEvent<string \| string[]>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

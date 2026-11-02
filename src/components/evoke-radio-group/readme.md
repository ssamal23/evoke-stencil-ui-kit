# evoke-radio-group



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                                     | Type                       | Default     |
| ------------ | ------------ | ------------------------------------------------------------------------------- | -------------------------- | ----------- |
| `appearance` | `appearance` | Classic radio circles, or a segmented button group                              | `"classic" \| "segmented"` | `'classic'` |
| `disabled`   | `disabled`   |                                                                                 | `boolean`                  | `false`     |
| `error`      | `error`      | Error message shown below the group                                             | `string`                   | `''`        |
| `inline`     | `inline`     | Lay classic options out in a row instead of a column                            | `boolean`                  | `false`     |
| `label`      | `label`      |                                                                                 | `string`                   | `''`        |
| `name`       | `name`       |                                                                                 | `string`                   | `''`        |
| `options`    | `options`    | Options as an array of { label, value, disabled? } or a JSON string of the same | `EvokeOption[] \| string`  | `[]`        |
| `value`      | `value`      |                                                                                 | `string`                   | `''`        |


## Events

| Event         | Description              | Type                  |
| ------------- | ------------------------ | --------------------- |
| `evokeChange` | Emits the selected value | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

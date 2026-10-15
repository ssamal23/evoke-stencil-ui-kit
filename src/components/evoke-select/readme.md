# evoke-select



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                     | Type                      | Default              |
| ------------- | -------------- | ------------------------------------------------------------------------------- | ------------------------- | -------------------- |
| `disabled`    | `disabled`     |                                                                                 | `boolean`                 | `false`              |
| `error`       | `error`        | Error message shown below the field                                             | `string`                  | `''`                 |
| `label`       | `label`        |                                                                                 | `string`                  | `''`                 |
| `options`     | `options`      | Options as an array of { label, value, disabled? } or a JSON string of the same | `EvokeOption[] \| string` | `[]`                 |
| `placeholder` | `placeholder`  |                                                                                 | `string`                  | `'Select an option'` |
| `selectClass` | `select-class` | Extra classes for the inner <select>, e.g. "form-select" (Bootstrap)            | `string`                  | `''`                 |
| `value`       | `value`        |                                                                                 | `string`                  | `''`                 |


## Events

| Event         | Description              | Type                  |
| ------------- | ------------------------ | --------------------- |
| `evokeChange` | Emits the selected value | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

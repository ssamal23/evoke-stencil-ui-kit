# evoke-input



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                          | Type                                     | Default     |
| ------------- | ------------- | -------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| `disabled`    | `disabled`    |                                                                      | `boolean`                                | `false`     |
| `error`       | `error`       |                                                                      | `string`                                 | `''`        |
| `icon`        | `icon`        | Optional leading icon                                                | `"lock" \| "mail" \| "search" \| "user"` | `undefined` |
| `inputClass`  | `input-class` | Extra classes for the inner <input>, e.g. "form-control" (Bootstrap) | `string`                                 | `''`        |
| `label`       | `label`       |                                                                      | `string`                                 | `''`        |
| `placeholder` | `placeholder` |                                                                      | `string`                                 | `''`        |
| `type`        | `type`        |                                                                      | `string`                                 | `'text'`    |
| `value`       | `value`       |                                                                      | `string`                                 | `''`        |


## Events

| Event         | Description                                | Type                  |
| ------------- | ------------------------------------------ | --------------------- |
| `evokeChange` | Emits the new value on commit (blur/enter) | `CustomEvent<string>` |
| `evokeInput`  | Emits the new value on every keystroke     | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

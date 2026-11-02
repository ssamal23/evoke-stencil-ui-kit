# evoke-input



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                          | Type                                                                                                                                                                                                                                           | Default      |
| ------------- | ------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `appearance`  | `appearance`  | Outlined (default) or filled (tinted background, bottom border)      | `"filled" \| "outlined"`                                                                                                                                                                                                                       | `'outlined'` |
| `disabled`    | `disabled`    |                                                                      | `boolean`                                                                                                                                                                                                                                      | `false`      |
| `error`       | `error`       | Error message shown below the field (replaces the hint)              | `string`                                                                                                                                                                                                                                       | `''`         |
| `hint`        | `hint`        | Helper text shown below the field                                    | `string`                                                                                                                                                                                                                                       | `''`         |
| `icon`        | `icon`        | Optional leading icon                                                | `"alert" \| "arrow-down" \| "arrow-right" \| "arrow-up" \| "cart" \| "check" \| "chevron-down" \| "chevron-left" \| "chevron-right" \| "chevron-up" \| "info" \| "lock" \| "mail" \| "minus" \| "plus" \| "search" \| "sort" \| "user" \| "x"` | `undefined`  |
| `inputClass`  | `input-class` | Extra classes for the inner <input>, e.g. "form-control" (Bootstrap) | `string`                                                                                                                                                                                                                                       | `''`         |
| `label`       | `label`       |                                                                      | `string`                                                                                                                                                                                                                                       | `''`         |
| `name`        | `name`        |                                                                      | `string`                                                                                                                                                                                                                                       | `''`         |
| `placeholder` | `placeholder` |                                                                      | `string`                                                                                                                                                                                                                                       | `''`         |
| `required`    | `required`    |                                                                      | `boolean`                                                                                                                                                                                                                                      | `false`      |
| `type`        | `type`        |                                                                      | `string`                                                                                                                                                                                                                                       | `'text'`     |
| `value`       | `value`       |                                                                      | `string`                                                                                                                                                                                                                                       | `''`         |


## Events

| Event         | Description                                | Type                  |
| ------------- | ------------------------------------------ | --------------------- |
| `evokeChange` | Emits the new value on commit (blur/enter) | `CustomEvent<string>` |
| `evokeInput`  | Emits the new value on every keystroke     | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

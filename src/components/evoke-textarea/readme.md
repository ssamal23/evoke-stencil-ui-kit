# evoke-textarea



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                              | Type      | Default     |
| --------------- | ---------------- | -------------------------------------------------------- | --------- | ----------- |
| `autoGrow`      | `auto-grow`      | Grow with the content instead of scrolling               | `boolean` | `false`     |
| `disabled`      | `disabled`       |                                                          | `boolean` | `false`     |
| `error`         | `error`          |                                                          | `string`  | `''`        |
| `hint`          | `hint`           |                                                          | `string`  | `''`        |
| `label`         | `label`          |                                                          | `string`  | `''`        |
| `maxLength`     | `max-length`     | Max characters; also shows a live "n / max" counter      | `number`  | `undefined` |
| `name`          | `name`           |                                                          | `string`  | `''`        |
| `placeholder`   | `placeholder`    |                                                          | `string`  | `''`        |
| `required`      | `required`       |                                                          | `boolean` | `false`     |
| `rows`          | `rows`           | Visible rows (the minimum height when `auto-grow` is on) | `number`  | `4`         |
| `textareaClass` | `textarea-class` | Extra classes for the inner <textarea>                   | `string`  | `''`        |
| `value`         | `value`          |                                                          | `string`  | `''`        |


## Events

| Event         | Description                            | Type                  |
| ------------- | -------------------------------------- | --------------------- |
| `evokeChange` | Emits the new value on commit (blur)   | `CustomEvent<string>` |
| `evokeInput`  | Emits the new value on every keystroke | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# evoke-datepicker



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                 | Type      | Default        |
| ------------- | ------------- | ----------------------------------------------------------- | --------- | -------------- |
| `disabled`    | `disabled`    |                                                             | `boolean` | `false`        |
| `error`       | `error`       | Error message shown below the field (replaces the hint)     | `string`  | `''`           |
| `hint`        | `hint`        |                                                             | `string`  | `''`           |
| `label`       | `label`       |                                                             | `string`  | `''`           |
| `locale`      | `locale`      | Language for month and weekday names, e.g. "en-US", "de-DE" | `string`  | `'en-US'`      |
| `max`         | `max`         | Latest date that can be chosen, YYYY-MM-DD                  | `string`  | `''`           |
| `min`         | `min`         | Earliest date that can be chosen, YYYY-MM-DD                | `string`  | `''`           |
| `placeholder` | `placeholder` |                                                             | `string`  | `'YYYY-MM-DD'` |
| `required`    | `required`    |                                                             | `boolean` | `false`        |
| `value`       | `value`       | Selected date as YYYY-MM-DD (empty for none)                | `string`  | `''`           |
| `weekStart`   | `week-start`  | First day of the week: 0 = Sunday, 1 = Monday               | `0 \| 1`  | `0`            |


## Events

| Event         | Description                                                          | Type                  |
| ------------- | -------------------------------------------------------------------- | --------------------- |
| `evokeChange` | Emits the chosen date as YYYY-MM-DD, or an empty string when cleared | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

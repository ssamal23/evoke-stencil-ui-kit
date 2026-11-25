# evoke-timepicker



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                          | Type      | Default |
| ------------- | ------------- | ------------------------------------------------------------------------------------ | --------- | ------- |
| `disabled`    | `disabled`    |                                                                                      | `boolean` | `false` |
| `error`       | `error`       | Error message shown below the field (replaces the hint)                              | `string`  | `''`    |
| `hint`        | `hint`        |                                                                                      | `string`  | `''`    |
| `label`       | `label`       |                                                                                      | `string`  | `''`    |
| `placeholder` | `placeholder` |                                                                                      | `string`  | `''`    |
| `required`    | `required`    |                                                                                      | `boolean` | `false` |
| `step`        | `step`        | Gap between the minutes offered in the list, 1 to 30. You can still type any minute. | `number`  | `5`     |
| `twelveHour`  | `twelve-hour` | Show and accept AM/PM instead of 24-hour time                                        | `boolean` | `false` |
| `value`       | `value`       | Selected time as 24-hour HH:MM (empty for none), whatever `twelveHour` shows         | `string`  | `''`    |


## Events

| Event         | Description                                                             | Type                  |
| ------------- | ----------------------------------------------------------------------- | --------------------- |
| `evokeChange` | Emits the chosen time as 24-hour HH:MM, or an empty string when cleared | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

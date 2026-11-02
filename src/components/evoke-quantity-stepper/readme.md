# evoke-quantity-stepper



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                     | Type                    | Default      |
| ------------ | ------------ | --------------------------------------------------------------- | ----------------------- | ------------ |
| `appearance` | `appearance` | Inline (minus, value, plus) or compact with a quantity dropdown | `"compact" \| "inline"` | `'inline'`   |
| `disabled`   | `disabled`   |                                                                 | `boolean`               | `false`      |
| `label`      | `label`      | Accessible name for the control                                 | `string`                | `'Quantity'` |
| `max`        | `max`        |                                                                 | `number`                | `99`         |
| `min`        | `min`        |                                                                 | `number`                | `1`          |
| `value`      | `value`      |                                                                 | `number`                | `1`          |


## Events

| Event         | Description            | Type                  |
| ------------- | ---------------------- | --------------------- |
| `evokeChange` | Emits the new quantity | `CustomEvent<number>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

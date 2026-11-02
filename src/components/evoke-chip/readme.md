# evoke-chip



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                         | Type      | Default |
| ----------- | ----------- | --------------------------------------------------- | --------- | ------- |
| `disabled`  | `disabled`  |                                                     | `boolean` | `false` |
| `label`     | `label`     |                                                     | `string`  | `''`    |
| `removable` | `removable` | Shows a remove button instead of toggling selection | `boolean` | `false` |
| `selected`  | `selected`  | Selected state (filter chip)                        | `boolean` | `false` |


## Events

| Event         | Description                                              | Type                   |
| ------------- | -------------------------------------------------------- | ---------------------- |
| `evokeChange` | Emits the new selected state (filter chip)               | `CustomEvent<boolean>` |
| `evokeRemove` | Fired when the remove button is clicked (removable chip) | `CustomEvent<void>`    |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

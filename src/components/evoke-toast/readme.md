# evoke-toast



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                    | Type                                           | Default    |
| ---------- | ---------- | ------------------------------------------------------------------------------ | ---------------------------------------------- | ---------- |
| `action`   | `action`   | Label of an action button, e.g. "View cart". Leave empty for a simple message. | `string`                                       | `''`       |
| `duration` | `duration` | Auto-dismiss after this many ms; 0 keeps it open until closed                  | `number`                                       | `4000`     |
| `message`  | `message`  | Message text (or use the default slot)                                         | `string`                                       | `''`       |
| `open`     | `open`     |                                                                                | `boolean`                                      | `false`    |
| `position` | `position` |                                                                                | `"bottom" \| "top"`                            | `'bottom'` |
| `type`     | `type`     |                                                                                | `"danger" \| "info" \| "success" \| "warning"` | `'info'`   |


## Events

| Event         | Description                                             | Type                |
| ------------- | ------------------------------------------------------- | ------------------- |
| `evokeAction` | Fired when the action button is clicked                 | `CustomEvent<void>` |
| `evokeClose`  | Fired when the toast closes (button, action or timeout) | `CustomEvent<void>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

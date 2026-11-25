# evoke-stepper



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                         | Type                    | Default |
| ------------- | -------------- | ----------------------------------------------------------------------------------- | ----------------------- | ------- |
| `current`     | `current`      | Zero-based index of the current step                                                | `number`                | `0`     |
| `label`       | `label`        | Accessible name for the stepper                                                     | `string`                | `''`    |
| `linear`      | `linear`       | Steps must be done in order: the header cannot jump ahead, only Back and Next move. | `boolean`               | `true`  |
| `showActions` | `show-actions` | Show Back and Next buttons under the content (Next reads "Finish" on the last step) | `boolean`               | `true`  |
| `steps`       | `steps`        | Steps as an array of { label, description? } or a JSON string of the same           | `EvokeStep[] \| string` | `[]`    |


## Events

| Event           | Description                                   | Type                  |
| --------------- | --------------------------------------------- | --------------------- |
| `evokeChange`   | Emits the new current step index              | `CustomEvent<number>` |
| `evokeComplete` | Fired when Finish is pressed on the last step | `CustomEvent<void>`   |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

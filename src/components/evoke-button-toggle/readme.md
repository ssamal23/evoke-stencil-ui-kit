# evoke-button-toggle



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                 | Type                        | Default |
| ---------- | ---------- | ------------------------------------------------------------------------------------------- | --------------------------- | ------- |
| `disabled` | `disabled` |                                                                                             | `boolean`                   | `false` |
| `items`    | `items`    | Buttons as an array of { label, value, icon?, disabled? } or a JSON string of the same      | `EvokeListItem[] \| string` | `[]`    |
| `label`    | `label`    | Accessible name for the group                                                               | `string`                    | `''`    |
| `multiple` | `multiple` | Allow several buttons to be on at once (checkbox style). Otherwise one is on (radio style). | `boolean`                   | `false` |
| `value`    | `value`    | Selected value, or an array of values when `multiple`                                       | `string \| string[]`        | `''`    |


## Events

| Event         | Description                                                                 | Type                              |
| ------------- | --------------------------------------------------------------------------- | --------------------------------- |
| `evokeChange` | Emits the selected value, or the selected values (string[]) when `multiple` | `CustomEvent<string \| string[]>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

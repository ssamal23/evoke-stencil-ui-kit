# evoke-tabs



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                                  | Type                      | Default       |
| ------------ | ------------ | ---------------------------------------------------------------------------- | ------------------------- | ------------- |
| `appearance` | `appearance` | Underline tabs or pill tabs                                                  | `"pill" \| "underline"`   | `'underline'` |
| `label`      | `label`      | Accessible name for the tab list                                             | `string`                  | `''`          |
| `options`    | `options`    | Tabs as an array of { label, value, disabled? } or a JSON string of the same | `EvokeOption[] \| string` | `[]`          |
| `value`      | `value`      | Value of the active tab. Defaults to the first enabled tab.                  | `string`                  | `''`          |


## Events

| Event         | Description                               | Type                  |
| ------------- | ----------------------------------------- | --------------------- |
| `evokeChange` | Emits the value of the newly selected tab | `CustomEvent<string>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

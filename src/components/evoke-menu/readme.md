# evoke-menu



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                         | Type                          | Default   |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------- | ----------------------------- | --------- |
| `align`    | `align`    | Line the menu up with the left edge of the button (default) or the right edge                       | `"end" \| "start"`            | `'start'` |
| `disabled` | `disabled` |                                                                                                     | `boolean`                     | `false`   |
| `label`    | `label`    | Text of the button that opens the menu                                                              | `string`                      | `'Menu'`  |
| `options`  | `options`  | Menu items as an array of { label, value, icon?, disabled?, divider? } or a JSON string of the same | `EvokeMenuOption[] \| string` | `[]`      |


## Events

| Event         | Description                        | Type                  |
| ------------- | ---------------------------------- | --------------------- |
| `evokeSelect` | Emits the value of the chosen item | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

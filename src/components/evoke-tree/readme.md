# evoke-tree



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                              | Type                        | Default |
| ----------- | ------------ | ---------------------------------------------------------------------------------------- | --------------------------- | ------- |
| `expandAll` | `expand-all` | Open every node at the start (only when `expanded` is empty)                             | `boolean`                   | `false` |
| `expanded`  | `expanded`   | Values of the nodes that are open: an array, a JSON string, or a comma list              | `string \| string[]`        | `[]`    |
| `label`     | `label`      | Accessible name for the tree                                                             | `string`                    | `''`    |
| `nodes`     | `nodes`      | Nodes as an array of { label, value, children?, disabled? } or a JSON string of the same | `EvokeTreeNode[] \| string` | `[]`    |
| `value`     | `value`      | Value of the selected node                                                               | `string`                    | `''`    |


## Events

| Event         | Description                                   | Type                                                 |
| ------------- | --------------------------------------------- | ---------------------------------------------------- |
| `evokeChange` | Emits the value of the node that was selected | `CustomEvent<string>`                                |
| `evokeToggle` | Emits when a node is opened or closed         | `CustomEvent<{ value: string; expanded: boolean; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

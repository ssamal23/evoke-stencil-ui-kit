// In a bundled app (Vite, Rollup, webpack) register the components you use from the tree-shakeable build.
// The lazy loader ('@evoke-tech/stencil-ui-kit/loader') is for pages that load the kit with a script tag:
// a production build leaves its files out and no component starts.
import { defineCustomElement as button } from '@evoke-tech/stencil-ui-kit/components/evoke-button.js';
import { defineCustomElement as input } from '@evoke-tech/stencil-ui-kit/components/evoke-input.js';
import { defineCustomElement as select } from '@evoke-tech/stencil-ui-kit/components/evoke-select.js';
import { defineCustomElement as toggle } from '@evoke-tech/stencil-ui-kit/components/evoke-switch.js';
import { defineCustomElement as tabs } from '@evoke-tech/stencil-ui-kit/components/evoke-tabs.js';
import { defineCustomElement as list } from '@evoke-tech/stencil-ui-kit/components/evoke-list.js';
import { defineCustomElement as datepicker } from '@evoke-tech/stencil-ui-kit/components/evoke-datepicker.js';
import { defineCustomElement as slider } from '@evoke-tech/stencil-ui-kit/components/evoke-slider.js';
import { defineCustomElement as menu } from '@evoke-tech/stencil-ui-kit/components/evoke-menu.js';
import { defineCustomElement as stepper } from '@evoke-tech/stencil-ui-kit/components/evoke-stepper.js';
import { defineCustomElement as table } from '@evoke-tech/stencil-ui-kit/components/evoke-table.js';
import { defineCustomElement as modal } from '@evoke-tech/stencil-ui-kit/components/evoke-modal.js';

[button, input, select, toggle, tabs, list, datepicker, slider, menu, stepper, table, modal].forEach((define) => define());

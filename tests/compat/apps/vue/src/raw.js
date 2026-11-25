import { createApp } from 'vue';
// In a bundled app (Vite, Rollup, webpack) register the components you use from the tree-shakeable build.
// The lazy loader ('@evoke-tech/stencil-ui-kit/loader') is for pages that load the kit with a script tag.
import { defineCustomElement as defineButton } from '@evoke-tech/stencil-ui-kit/components/evoke-button.js';
import { defineCustomElement as defineInput } from '@evoke-tech/stencil-ui-kit/components/evoke-input.js';
import { defineCustomElement as defineSelect } from '@evoke-tech/stencil-ui-kit/components/evoke-select.js';
import { defineCustomElement as defineSwitch } from '@evoke-tech/stencil-ui-kit/components/evoke-switch.js';
import { defineCustomElement as defineTabs } from '@evoke-tech/stencil-ui-kit/components/evoke-tabs.js';
import { defineCustomElement as defineList } from '@evoke-tech/stencil-ui-kit/components/evoke-list.js';
import { defineCustomElement as defineDatepicker } from '@evoke-tech/stencil-ui-kit/components/evoke-datepicker.js';
import { defineCustomElement as defineSlider } from '@evoke-tech/stencil-ui-kit/components/evoke-slider.js';
import { defineCustomElement as defineMenu } from '@evoke-tech/stencil-ui-kit/components/evoke-menu.js';
import { defineCustomElement as defineStepper } from '@evoke-tech/stencil-ui-kit/components/evoke-stepper.js';
import { defineCustomElement as defineTable } from '@evoke-tech/stencil-ui-kit/components/evoke-table.js';
import { defineCustomElement as defineModal } from '@evoke-tech/stencil-ui-kit/components/evoke-modal.js';
import '@evoke-tech/stencil-ui-kit/dist/evoke-ui/evoke-ui.css';
import RawApp from './RawApp.vue';

[defineButton, defineInput, defineSelect, defineSwitch, defineTabs, defineList, defineDatepicker, defineSlider, defineMenu, defineStepper, defineTable, defineModal].forEach((define) => define());
createApp(RawApp).mount('#app');

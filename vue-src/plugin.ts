import type { Plugin } from 'vue';
import { defineCustomElements } from '@evoke-tech/stencil-ui-kit/loader';

/** Registers the Evoke custom elements. Use with `app.use(EvokeUi)`. */
export const EvokeUi: Plugin = {
  install() {
    defineCustomElements();
  },
};

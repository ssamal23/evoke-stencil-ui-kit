import { Config } from '@stencil/core';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'evoke-ui',
  globalStyle: 'src/themes/tokens.css',
  outputTargets: [
    // Lazy-loaded bundle + loader (script tag, or defineCustomElements() in any framework)
    { type: 'dist', esmLoaderPath: '../loader' },
    // Tree-shakeable individual custom elements
    { type: 'dist-custom-elements', customElementsExportBehavior: 'auto-define-custom-elements' },
    // Vue 3 wrapper components (import from '@evoke-tech/stencil-ui-kit/vue'). They pass slot content
    // as child vnodes, which avoids Vue wiping the light-DOM markup of our shadow:false components.
    vueOutputTarget({
      componentCorePackage: '@evoke-tech/stencil-ui-kit',
      proxiesFile: './vue-src/components.ts',
      // Each wrapper imports and registers its own element from the tree-shakeable build. The lazy loader does
      // not survive a Vite/Rollup production build (its chunk files are never emitted), so wrappers must not use it.
      includeImportCustomElements: true,
      customElementsDir: 'components',
    }),
    { type: 'docs-readme' },
    { type: 'www', serviceWorker: null },
  ],
};



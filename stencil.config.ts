import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'evoke-ui',
  globalStyle: 'src/themes/tokens.css',
  outputTargets: [
    // Lazy-loaded bundle + loader (script tag, or defineCustomElements() in any framework)
    { type: 'dist', esmLoaderPath: '../loader' },
    // Tree-shakeable individual custom elements
    { type: 'dist-custom-elements', customElementsExportBehavior: 'auto-define-custom-elements' },
    { type: 'docs-readme' },
    { type: 'www', serviceWorker: null },
  ],
};



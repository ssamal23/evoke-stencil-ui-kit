import type { Plugin } from 'vue';

/**
 * Kept so that `app.use(EvokeUi)` keeps working. It does nothing now: each wrapper component registers its own
 * element when you import it, which is what lets a Vite or Rollup production build include the components.
 * (The lazy loader this used to call cannot be bundled: its chunk files are not emitted, so no component started.)
 */
export const EvokeUi: Plugin = {
  install() {},
};

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Two pages: index.html uses the Vue wrappers, raw.html uses the plain evoke-* tags.
// isCustomElement is what the README tells people to set for the raw tags. It does not affect the wrappers
// (their tags are written EvokeButton, not evoke-button).
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('evoke-') } } })],
  build: {
    rollupOptions: { input: { index: 'index.html', raw: 'raw.html' } },
  },
});

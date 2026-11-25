import { createApp } from 'vue';
import { EvokeUi } from '@evoke-tech/stencil-ui-kit/vue';
import '@evoke-tech/stencil-ui-kit/dist/evoke-ui/evoke-ui.css';
import App from './App.vue';

createApp(App).use(EvokeUi).mount('#app');

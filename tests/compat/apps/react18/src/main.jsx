import { createRoot } from 'react-dom/client';
import '@evoke-tech/stencil-ui-kit/dist/evoke-ui/evoke-ui.css';
import './register.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);

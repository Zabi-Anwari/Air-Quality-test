import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('main.jsx loading');

window.initHomeMap = () => { 
  console.log('initHomeMap called');
};

console.log('About to render React app');
const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('React app rendered');

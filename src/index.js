import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';
import 'antd/dist/antd.css';
import './style.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

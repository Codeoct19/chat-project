import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthContext } from './components/context/Context';

const rootId = document.getElementById('root');
const root = createRoot(rootId);
root.render(<AuthContext> <App /> </AuthContext>, root);
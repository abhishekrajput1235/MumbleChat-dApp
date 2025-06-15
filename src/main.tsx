import { Buffer } from 'buffer';
window.Buffer = Buffer;


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { WalletProvider } from './context/WalletContext';
import { ChatProvider } from './context/ChatContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>
);
import { Buffer } from 'buffer';
window.Buffer = Buffer;


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { WalletProvider } from './context/WalletContext';
import { ChatProvider } from './context/ChatContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <WalletProvider>
        <ChatProvider>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </ChatProvider>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>
);
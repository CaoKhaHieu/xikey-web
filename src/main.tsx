import React from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './shared/utils/i18n.js';

import App from './App.tsx';
import store from './stores/index.ts';
import LoadingProvider from './shared/components/loading/index.tsx';
import { DialogProvider } from './shared/components/dialog/index.tsx';
import ChatProvider from './shared/contexts/chat-context/index.tsx';
import SocketProvider from './shared/contexts/socket-context/index.tsx';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <ChatProvider>
            <DialogProvider>
              <LoadingProvider>
                <App />
              </LoadingProvider>
            </DialogProvider>
          </ChatProvider>
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

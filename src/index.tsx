import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WebnativeProvider } from "./context/webnative"
import * as wn from "webnative"

const PERMISSIONS = {
  app: {
    name: "Blog",
    creator: "Fission",
  },
  fs: {
    public: [wn.path.directory("Apps", "Fission", "Blog")],
  },
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <WebnativeProvider permissions={PERMISSIONS}>
      <App />
    </WebnativeProvider>
  </React.StrictMode>
)

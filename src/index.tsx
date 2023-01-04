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
  }
}

const el = document.getElementById('root')

if (el) {
  const root = ReactDOM.createRoot(el);

  const path = wn.path.directory('Apps', 'Fission', 'Blog')
  console.log('wn path', path) 
  console.log(typeof path)
  console.log('dir', path.directory)

  root.render(
    <React.StrictMode>
      <WebnativeProvider permissions={PERMISSIONS}>
        <App />
      </WebnativeProvider>
    </React.StrictMode>
  )
}

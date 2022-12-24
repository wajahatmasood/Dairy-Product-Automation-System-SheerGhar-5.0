import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { Provider } from "react-redux";
import store from "./store"
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
// redux state store is being connected and saved
const root = ReactDOM.createRoot(document.getElementById('root'));
// we'vw created React Alert Setup here <-----
const options ={
  // this is 5sec
  timeout: 5000,
  position : positions.BOTTOM_CENTER,
  transitions: transitions.SCALE,
}
root.render(
  <Provider store ={store}>
    <AlertProvider template={AlertTemplate} {...options}>
    <App />
    </AlertProvider>
     
  </Provider>
);
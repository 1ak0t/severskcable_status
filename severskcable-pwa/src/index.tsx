import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from "./App";
import {Provider} from "react-redux";
import {store} from "./store";
import {checkAuthAction, fetchAllData} from "./store/api-actions";
import ErrorMessage from "./components/error-message/error-message";

store.dispatch(checkAuthAction());
store.dispatch(fetchAllData());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <ErrorMessage />
          <App />
      </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

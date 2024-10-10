import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import {store} from "./store";
import App from "./App";
import {Provider} from "react-redux";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {checkAuthAction, fetchAllData} from "./store/api-actions";
import browserHistory from "./browser-history";
import HistoryRouter from "./components/history-route/history-route";


store.dispatch(checkAuthAction());
store.dispatch(checkAuthAction());

const messageChannel = new MessageChannel();

if (navigator.serviceWorker.controller){
    navigator.serviceWorker.controller.postMessage({
        type: 'INIT_PORT',
    }, [messageChannel.port2]);
}

messageChannel.port1.onmessage = (event) => {
    store.dispatch(fetchAllData());
};


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <HistoryRouter history={browserHistory}>
              <ToastContainer />
              <App />
          </HistoryRouter>
      </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

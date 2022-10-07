import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import rootReducer from "./redux/reducer";

const store = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

root.render(
  <React.StrictMode>
    <Provider store={store(rootReducer, devTools && devTools())}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

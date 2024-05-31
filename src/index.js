import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter,BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { store } from "./state/store.js";
import { Provider } from "react-redux";
import theme from "./theme";
import "./assets/scss/index.scss";
import { ToastContainer, } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-phone-input-2/lib/material.css'
import "react-simple-keyboard/build/css/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ToastContainer position="top-center"/>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </ThemeProvider>
   </React.StrictMode>
);

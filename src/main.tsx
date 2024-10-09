import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { ApolloProvider } from '@apollo/client';
import client from "./components/ApolloClient.js"
import App from "./App.jsx";
import "./index.css";
// NOTE: Use Provider not-from-tool-kit helps connect Store to the React
import { Provider } from "react-redux";
// import { applyMiddleware } from "@reduxjs/toolkit";
// import createSagaMiddleware from 'redux-saga'
import { store } from "./state/store.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "Example React Dapp",
          url: window.location.href,
        },
        infuraAPIKey: "2805a7f778ed49ff93ab739c358f52b4",
      }}
    > */}
      <ApolloProvider client={client}>
        {/* NOTE: using this to connect Redux to React store field connect "STORE" to react*/}
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>,

    {/* </MetaMaskProvider> */}
  </StrictMode>,
);

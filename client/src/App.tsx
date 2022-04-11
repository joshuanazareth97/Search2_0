import { CircularProgress } from "@mui/material";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useSnackbar } from "notistack";
import React, { FC, ReactNode, useCallback, useEffect, useMemo } from "react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import Layout from "./components/Layout/Layout";
import { useAppSelector } from "./hooks";
import { routeList } from "./routes";
import { store } from "./store";
import { Theme } from "./Theme";

export const App: FC = () => {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={<CircularProgress />} persistor={persistor}>
        <Theme>
          <Context>
            <Content />
          </Context>
        </Theme>
      </PersistGate>
    </Provider>
  );
};

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const endpoint = useMemo(() => clusterApiUrl("https://solana-api.projectserum.com"), []);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      // new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      // new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  const { enqueueSnackbar } = useSnackbar();
  const onError = useCallback(
    (error: WalletError) => {
      enqueueSnackbar(
        error.message ? `${error.name}: ${error.message}` : error.name,
        { variant: "error" }
      );
      console.error(error);
    },
    [enqueueSnackbar]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletDialogProvider>{children}</WalletDialogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: FC = () => {
  const isLoggedIn = !!useAppSelector(
    (state) =>
      state.persistedReducer.auth.pubKey && state.persistedReducer.auth.token
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        {routeList
          .filter(({ auth }) => (isLoggedIn ? auth : !auth))
          .map(({ url, Component, auth }) => {
            console.log(url);
            return (
              <Route
                key={url}
                path={url}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            );
          })}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} />}
        />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

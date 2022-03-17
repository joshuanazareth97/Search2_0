import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import base58 from "bs58";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../config/axios";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login, logout } from "../../slices/auth.slice";
import { CustomWalletButton } from "../CustomWalletButton/CustomWalletButton";

type Props = {
  children?: React.ReactNode;
};

const Layout = (props: Props) => {
  const { wallet, connect, signMessage, publicKey } = useWallet();
  const { connection } = useConnection();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  console.log(request.defaults);
  const isLoggedIn = !!useAppSelector(
    (state) =>
      state.persistedReducer.auth.pubKey && state.persistedReducer.auth.token
  );

  useEffect(() => {
    const conn = async () => {
      if (!publicKey || isLoggedIn) return;
      try {
        const nonceResult = await request.get(
          `/users/nonce/${publicKey.toJSON()}`
        );
        if (!nonceResult.data.nonce) return;
        const message = new TextEncoder().encode(nonceResult.data.nonce);
        const signedArray = await signMessage?.(message);
        const jwtResult = await request.post("/users/authenticate", {
          publicKey: base58.encode(publicKey.toBytes()),
          signedMessage: base58.encode(signedArray || new Uint8Array()),
        });
        dispatch(
          login({
            pubKey: publicKey.toJSON(),
            token: jwtResult.data || "",
          })
        );
        navigate("/");
      } catch (err) {}
    };
    conn();
  }, [publicKey, signMessage, isLoggedIn]);

  return (
    <>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Search 2.0
            </Typography>
            {/* <Tooltip
              placement="bottom"
              title={publicKey?.toJSON?.() || "Connect a wallet"}
            > */}
            <CustomWalletButton onDisconnect={() => dispatch(logout())} />
            {/* </Tooltip> */}
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        padding="2rem"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="content"
      >
        {props.children}
      </Box>
    </>
  );
};

export default Layout;

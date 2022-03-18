import { Cloud } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import base58 from "bs58";
import React, { useCallback, useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { request } from "../../config/axios";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login, logout } from "../../slices/auth.slice";
import { CustomWalletButton } from "../CustomWalletButton/CustomWalletButton";

type Props = {
  children?: React.ReactNode;
};

interface IPriceQuote {
  value: string;
  type: string;
  market: string;
  timestamp: Date;
}

const Layout = (props: Props) => {
  const { wallet, connect, signMessage, publicKey } = useWallet();
  const { connection } = useConnection();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [latestQuote, setLatestQuote] = useState<IPriceQuote | null>(null);
  const [exchangeModalOpen, setExchangeModalOpen] =
    useState<null | HTMLElement>(null);

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

  useEffect(() => {
    const ws = new WebSocket("wss://api.serum-vial.dev/v1/ws");
    // if connecting to serum-vial server running locally
    // const ws = new WebSocket('ws://localhost:8000/v1/ws')

    ws.onmessage = (message: any) => {
      const { bestAsk, bestBid, market, timestamp, type } = JSON.parse(
        message.data
      );
      if (!(bestAsk && bestBid)) return;
      const avgPrice = (parseFloat(bestAsk[0]) + parseFloat(bestBid[0])) / 2;
      setLatestQuote({
        value: avgPrice.toFixed(2),
        type,
        market,
        timestamp: new Date(timestamp),
      });
      return () => {
        ws.close();
      };
    };

    ws.onopen = () => {
      // subscribe both to trades and level2 real-time channels
      const subscribeL1 = {
        op: "subscribe",
        channel: "level1",
        markets: ["SOL/USDT"],
      };
      ws.send(JSON.stringify(subscribeL1));
    };
  }, []);

  const handleChartClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setExchangeModalOpen(event.currentTarget);
    },
    []
  );

  const handleChartClose = () => {
    setExchangeModalOpen(null);
  };

  return (
    <>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              PostHuman AI
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  marginRight: "2rem",
                }}
                onClick={handleChartClick}
              >
                <FaChartLine stroke="white" />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={exchangeModalOpen}
                open={!!exchangeModalOpen}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                onClose={handleChartClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleChartClose}>
                  {latestQuote ? (
                    <>
                      <ListItemIcon>
                        <Cloud fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>{latestQuote.value}</ListItemText>
                    </>
                  ) : (
                    <CircularProgress />
                  )}
                </MenuItem>
              </Menu>
              {/* <Tooltip
              placement="bottom"
              title={publicKey?.toJSON?.() || "Connect a wallet"}
            > */}
              <CustomWalletButton onDisconnect={() => dispatch(logout())} />
              {/* </Tooltip> */}
            </Box>
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

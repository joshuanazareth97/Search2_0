import { SearchSharp } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import base58 from "bs58";
import React, { useCallback, useEffect, useState } from "react";
import questionImg from "../../assets/images/question.png";
import { request } from "../../config/axios";

type Props = {};

const QuestionImage = styled("img")`
  width: 25%;
  margin-bottom: 4rem;
`;

const Search = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const { wallet, connect, sendTransaction, publicKey, signTransaction } =
    useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const getTx = async () => {};
    getTx();
  }, []);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setAnswer("");
    const txSig = await sendTx();
    const result = await request.post("/users/query", {
      query: searchTerm,
      txID: txSig,
    });
    setLoading(false);
    setAnswer(result.data.answers?.choices?.[0]?.text || "");
  }, [searchTerm, setSearchTerm, answer, setAnswer]);

  const sendTx = async () => {
    if (!publicKey) return;
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey("7zg3CXi2Ved7Ac2PebF4h2DbimTgrRVW3MAgqJDzj19S"),
        lamports: LAMPORTS_PER_SOL * 0.01,
      })
    );
    const sig = await sendTransaction(transaction, connection);
    const response = await connection.confirmTransaction(sig, "processed");
    return sig;
  };

  return (
    <>
      <QuestionImage src={questionImg} />
      <TextField
        placeholder="Ask me anything"
        variant="filled"
        hiddenLabel
        sx={{
          alignSelf: "stretch",
          flexGrow: "1",
          marginBottom: "2rem",
          "& input": {
            fontSize: "1.25rem",
            fontWeight: "bold",
          },
        }}
        onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLoading(false);
          setAnswer("");
          setSearchTerm(event.target.value);
        }}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleSearch}
                edge="end"
                // color="primary"
              >
                <SearchSharp />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: "2",
          alignSelf: "stretch",
        }}
      >
        {/* <Button onClick={sendTx}>Send</Button> */}
        {loading && (
          <CircularProgress
            color="primary"
            size="6rem"
            sx={{
              alignSelf: "center",
            }}
          />
        )}
        {answer && (
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {answer}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Search;

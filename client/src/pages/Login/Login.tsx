import { Typography, styled, Box, Dialog } from "@mui/material";
import React, { useState } from "react";
import loginImg from "../../assets/images/login.svg";

type Props = {};

const LoginImage = styled("img")`
  width: 20%;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const Login = (props: Props) => {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const handleDisclaimerClose = () => {
    setDisclaimerOpen(false);
  };

  return (
    <>
      <LoginImage src={loginImg} />
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Typography
          align="center"
          sx={{
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          How to use:
        </Typography>
        <Typography
          component="div"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            p: "4 rem",
            "& li": {
              mb: "1rem",
            },
          }}
        >
          <ol>
            <li>
              Make sure you have the{" "}
              <a href="https://slope.finance/">Slope wallet extension</a>{" "}
              installed.
            </li>
            <li>
              Go to the wallet extension settings to switch to the Solana
              devnet, and get your wallet funded with devnet{" "}
              <a href="https://solfaucet.com/">SOL tokens</a>.
            </li>
            <li> Connect your wallet and log in using the top right menu.</li>
            <li>
              Start asking questions! Funds will be auto-streamed from your
              wallet for every query. <br />
              <small>
                [Note: Devnet funds do not have any monetary value, so this is a
                free demo service at the moment]
              </small>
            </li>
          </ol>
        </Typography>

        <Typography
          component="div"
          align="center"
          sx={{
            fontSize: "0.75rem",
            fontWeight: "bold",
            color: "secondary.main",
            cursor: "pointer",
          }}
          onClick={() => setDisclaimerOpen(true)}
        >
          Disclaimer
        </Typography>
      </Box>
      <Dialog
        open={disclaimerOpen}
        onClose={handleDisclaimerClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            align="center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Disclaimer
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ fontSize: "0.875rem", mt: 2 }}
          >
            Posthuman AI is an experimental, advanced generative AI software
            tasked with answering all factual questions of users concisely,
            accurately, completely and usefully. It uses prompt engineering to
            leverage the innate memory of large parts of the internet that the
            underlying GPT3 model was trained on. While demonstrating
            significantly better-than-google-search accuracy in nearly all our
            tests on public datasets (like open-SQUAD), we remind users that all
            answers are AI generated and we cannot guarantee the correctness of
            any answer. <br /> <br />
            This tool may be thought of as a intelligent alternative to search
            engines for getting quick, precise, to-the-point answers to any
            factual/theoretical question or conjecture - it is meant to only
            serve as a starting point of research, and you are expected to
            verify the answer yourself, as you would with search results. Please
            DO NOT use the answers this AI provides directly for any health,
            safety, or value critical use case, without adequate verification of
            the answers. <br /> <br />
            In our experiments, we found that the AI not only provided answers
            that were clearer and easier to understand than those created by
            human annotators; the AI also occasionally provided constructive
            conjecture on cutting edge scientific and engineering fields. This
            is to be expected from the huge dataset it was trained on - which
            gives it a wider perspective on prospective solutions than what any
            single human could contain in their memory.
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ fontSize: "0.875rem", mt: 2 }}
          >
            For any feedback, concerns, or queries reach out to us via{" "}
            <a href="mailto:dhruv.luci9@gmail.com" target="_blank">
              email
            </a>{" "}
            or on
            <a href="https://discord.gg/sU6R3zRC" target="_blank">
              {" "}
              Discord
            </a>
          </Typography>
        </Box>
      </Dialog>
    </>
  );
};

export default Login;

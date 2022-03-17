import { Typography, styled } from "@mui/material";
import React from "react";
import loginImg from "../../assets/images/login.svg";

type Props = {};

const LoginImage = styled("img")`
  width: 20%;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const Login = (props: Props) => {
  return (
    <>
      <LoginImage src={loginImg} />
      <Typography
        sx={{
          flexGrow: 1,
          fontWeight: "bold",
          fontSize: "1.25rem",
        }}
      >
        Log in by selecting your wallet provider in the top-right menu.
      </Typography>
    </>
  );
};

export default Login;

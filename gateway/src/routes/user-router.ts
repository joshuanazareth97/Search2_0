import StatusCodes from "http-status-codes";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import userService from "@services/user-service";
import { ParamMissingError, UnauthorisedError } from "@shared/errors";
import { request } from "http";

import { sign } from "tweetnacl";
import { createVerify, randomBytes } from "crypto";
import base58 from "bs58";
import { redisClient } from "src/config/redis.config";
import { askQuestion } from "src/config/axios.config";

const anakin =
  "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const paths = {
  authenticate: "/authenticate",
  nonce: "/nonce/:publicKey",
  query: "/query",
} as const;

let userMap: any = {};

router.get(paths.nonce, async (req, res) => {
  const { publicKey } = req.params;
  if (!publicKey) {
    throw new ParamMissingError();
  }
  const nonce = randomBytes(16).toString("base64");
  userMap[publicKey] = nonce;
  await redisClient.set(publicKey, nonce);
  res.status(OK).json({ nonce });
});

/**
 * Request a jwt
 */

router.post(paths.authenticate, async (req, res) => {
  const { publicKey, signedMessage } = req.body;
  if (!(publicKey && signedMessage)) {
    throw new ParamMissingError();
  }
  const userNonce = await redisClient.get(publicKey);
  if (!userNonce) {
    throw UnauthorisedError;
  }
  const isValid = sign.detached.verify(
    new TextEncoder().encode(userNonce),
    base58.decode(signedMessage),
    base58.decode(publicKey)
  );
  if (isValid) {
    delete userMap[publicKey];
    const token = jwt.sign({ publicKey }, anakin, { expiresIn: "1d" });
    res.status(OK).json(token);
  }
});

router.post(paths.query, async (req, res) => {
  const { query } = req.body;
  if (!query) throw new ParamMissingError();
  const result = await askQuestion(query);
  console.log("++++++++++++++");
  console.log(result);
  res.status(OK).json(result.data);
});
// Export default
export default router;

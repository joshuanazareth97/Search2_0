import { Transaction } from "@models/transaction.model";
import { ParamMissingError, UnauthorisedError } from "@shared/errors";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import base58 from "bs58";
import { randomBytes } from "crypto";
import { Router } from "express";
import StatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import { askQuestion } from "src/config/axios.config";
import { redisClient } from "src/config/redis.config";
import { sign } from "tweetnacl";

const anakin =
  "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

// Constants
const router = Router();
const { CREATED, OK, FORBIDDEN, NOT_MODIFIED, UNAUTHORIZED } = StatusCodes;

const solanaConn = new Connection(clusterApiUrl("devnet"), "confirmed");

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
  const { query, txID } = req.body;
  if (!(query && txID)) throw new ParamMissingError();
  let newTx;
  try {
    const txItem = await Transaction.findOne({
      txID,
    });
    if (txItem) {
      if (txItem.isAnswered) {
        return res
          .status(FORBIDDEN || 403)
          .json({ error: "Transaction expired" });
      } else {
        if (txItem.questionHash === query) {
          const result = await askQuestion(query);
          txItem.isAnswered = true;
          txItem.save();
          return res.status(OK).json(result.data);
        } else {
          return res
            .status(UNAUTHORIZED)
            .json({ error: "Question doesn't match" });
        }
      }
    } else {
      const txOnChain = await solanaConn.getTransaction(txID);
      console.dir(txOnChain);
      if (
        txOnChain?.meta?.logMessages?.[1] ===
        "Program 11111111111111111111111111111111 success"
      ) {
        newTx = new Transaction({
          txID,
          publicKey: "aaaaa",
          questionHash: query,
        });
        newTx.save();
        const result = await askQuestion(query);
        newTx.isAnswered = true;
        newTx.save();
        return res.status(OK).json(result.data);
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  } catch (error) {}
});
// Export default
export default router;

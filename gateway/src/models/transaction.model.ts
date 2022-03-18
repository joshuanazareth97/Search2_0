import { model, Schema } from "mongoose";

const transactionSchema = new Schema({
  txID: {
    type: String,
  },
  publicKey: {
    type: String,
  },
  questionHash: {
    type: String,
  },
  isAnswered: Boolean,
});

export const Transaction = model("Transaction", transactionSchema);
